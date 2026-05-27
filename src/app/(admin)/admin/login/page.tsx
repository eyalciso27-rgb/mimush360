'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mfaCode, setMfaCode] = useState('')
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials')
  const [loading, setLoading] = useState(false)
  const errorParam = searchParams.get('error')
  const [error, setError] = useState<string | null>(
    errorParam === 'no_access' ? 'אין לך הרשאות גישה לפאנל הניהול. פנה למנהל המערכת.' : null
  )

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('שם משתמש או סיסמה שגויים')
        return
      }

      // Check for MFA
      if (data.session === null && data.user === null) {
        // MFA required
        setStep('mfa')
        return
      }

      // Full page reload so middleware reads the new session cookies correctly
      window.location.href = redirectTo
    } catch {
      setError('שגיאה בהתחברות. נסו שוב.')
    } finally {
      setLoading(false)
    }
  }

  const handleMfa = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const factors = await supabase.auth.mfa.listFactors()
      const totpFactor = factors.data?.totp?.[0]

      if (!totpFactor) {
        setError('לא נמצא גורם אימות')
        return
      }

      const { data: challengeData } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      })

      if (!challengeData) {
        setError('שגיאה ביצירת אתגר MFA')
        return
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challengeData.id,
        code: mfaCode,
      })

      if (verifyError) {
        setError('קוד אימות שגוי')
        return
      }

      window.location.href = redirectTo
    } catch {
      setError('שגיאה באימות. נסו שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4332] to-[#1B2A4A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.jpg"
            alt="מימוש 360"
            width={64}
            height={64}
            className="rounded-2xl object-contain mb-3"
            priority
          />
          <h1 className="text-xl font-bold text-white">מימוש 360</h1>
          <p className="text-white/60 text-sm">פאנל ניהול</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-[#2D6A4F]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-gray-900">
              {step === 'credentials' ? 'כניסה לפאנל' : 'אימות דו-שלבי'}
            </h2>
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mimush360.co.il"
                  autoComplete="email"
                  required
                  dir="ltr"
                  className="text-right"
                  aria-required="true"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">סיסמה</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    dir="ltr"
                    className="text-right pl-10"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] rounded"
                    aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] font-semibold"
                disabled={loading || !email || !password}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    מתחבר...
                  </>
                ) : (
                  'כניסה'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleMfa} className="space-y-4" noValidate>
              <p className="text-sm text-gray-600">
                הזינו את קוד האימות מאפליקציית המאמת שלכם.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="mfa-code">קוד אימות (6 ספרות)</Label>
                <Input
                  id="mfa-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  dir="ltr"
                  className="text-center text-lg tracking-widest"
                  autoFocus
                  aria-required="true"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep('credentials')
                    setMfaCode('')
                    setError(null)
                  }}
                  className="flex-1"
                >
                  חזרה
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#2D6A4F] hover:bg-[#1B4332]"
                  disabled={loading || mfaCode.length !== 6}
                  aria-busy={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    'אמת'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          גישה מורשית בלבד. כל פעולה מתועדת.
        </p>
      </div>
    </div>
  )
}
