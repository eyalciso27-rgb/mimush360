import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'הצהרת נגישות | מימוש 360',
  description: 'הצהרת נגישות של אתר מימוש 360 בהתאם לתקן ישראלי 5568.',
}

export default function AccessibilityPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-black mb-3">הצהרת נגישות</h1>
          <p className="text-white/75 text-base">מימוש 360 מחויבת לנגישות אתר לכלל המשתמשים</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">

            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">כללי</h2>
              <p>
                מימוש 360 שואפת להנגיש את תכני האתר לכלל המשתמשים, לרבות אנשים עם מוגבלויות,
                בהתאם לתקן הישראלי 5568 (המבוסס על הנחיות WCAG 2.1 ברמה AA) ועל חוק שוויון זכויות
                לאנשים עם מוגבלות, תשנ&quot;ח-1998 ותקנות הנגישות.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">רמת הנגישות</h2>
              <p>
                האתר עומד ברמת תאימות <strong>AA</strong> לפי תקן WCAG 2.1 ו-IS 5568. אנו ממשיכים לעבוד
                על שיפור הנגישות באופן שוטף.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">התאמות הנגישות באתר</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>תמיכה בניווט מקלדת מלא</li>
                <li>תיאורי alt לכלל התמונות</li>
                <li>תגיות ARIA לרכיבים אינטראקטיביים</li>
                <li>ניגודיות צבעים בהתאם לתקן</li>
                <li>תמיכה בקוראי מסך (NVDA, JAWS, VoiceOver)</li>
                <li>כותרות ומבנה סמנטי תקין</li>
                <li>גופן ברמת קריאות גבוהה (Heebo)</li>
                <li>כפתור דילוג לתוכן הראשי</li>
                <li>סרגל נגישות עם אפשרויות: שינוי גודל טקסט, ניגודיות, גרייסקייל, הדגשת קישורים ועצירת אנימציות</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">דפדפנים וטכנולוגיות נתמכות</h2>
              <p className="text-gray-600">
                האתר נבדק ועובד בצורה מיטבית על: Chrome, Firefox, Edge, Safari (גרסאות עדכניות).
                תומך בתצוגה במובייל (iOS ו-Android).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">מגבלות ידועות</h2>
              <p className="text-gray-600">
                ייתכן שחלק מהתכנים שמקורם בגורמים חיצוניים (כגון קישורים חיצוניים, מסמכי PDF ממקורות חיצוניים)
                אינם עומדים במלוא דרישות הנגישות. אנו עובדים על שיפור מתמיד.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-900 mb-3">יצירת קשר בנושא נגישות</h2>
              <p className="text-gray-600 mb-4">
                נתקלתם בבעיית נגישות? נשמח לשמוע ולתקן. ניתן לפנות אלינו:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <strong>רכז/ת נגישות:</strong> מימוש 360
                </li>
                <li>
                  <strong>דוא&quot;ל:</strong>{' '}
                  <a href="mailto:info@mimush360.co.il" className="text-[#2D6A4F] hover:underline">
                    info@mimush360.co.il
                  </a>
                </li>
                <li>
                  <strong>טלפון:</strong>{' '}
                  <a href="tel:0500000000" className="text-[#2D6A4F] hover:underline" dir="ltr">
                    050-000-0000
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-sm text-gray-400 pt-4 border-t border-gray-100">
              <p>הצהרה זו עודכנה לאחרונה: ינואר 2025</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#2D6A4F] hover:text-[#1B4332] font-medium transition-colors"
            >
              ← חזרה לדף הבית
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
