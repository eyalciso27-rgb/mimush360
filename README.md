# מימוש 360 — אתר רשמי

אתר לחברת מימוש 360 לסיוע במימוש זכויות רפואיות מול ביטוח לאומי.

## סטק טכנולוגי

| שכבה | טכנולוגיה |
|------|-----------|
| Framework | Next.js 16 App Router |
| Language | TypeScript (Strict) |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui + Radix UI |
| Backend | Supabase (Auth, DB, Storage) |
| Deployment | Vercel |
| Forms | React Hook Form + Zod |
| Integrations | Typeform, WhatsApp |

## התקנה ועבודה מקומית

### 1. משתני סביבה

```bash
cp .env.local.example .env.local
```

ערוך `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://mimush360.co.il
NEXT_PUBLIC_TYPEFORM_ID=your-typeform-id
TYPEFORM_WEBHOOK_SECRET=your-webhook-secret
```

### 2. הגדרת Supabase

1. צור פרויקט ב-[supabase.com](https://supabase.com)
2. הרץ `supabase/schema.sql` ב-SQL Editor
3. הפעל Email Auth ב-Auth → Providers
4. הפעל TOTP MFA ב-Auth → Multi Factor Auth (אופציונלי)

### 3. הרצה

```bash
npm install
npm run dev
```

---

## מבנה הפרויקט

```
src/
  app/
    (public)/       # /, /about, /how-it-works, /testimonials, /contact, /lp
    (admin)/        # /admin/* - מוגן ב-middleware
    api/            # /api/contact, /api/webhooks/typeform
  components/
    layout/         # Header, Footer, WhatsAppButton
    sections/       # Hero, Features, Testimonials, HowItWorks, CTA
    admin/          # AdminSidebar
    ui/             # UI primitives
  lib/
    supabase/       # client.ts, server.ts
    validations/    # Zod schemas
    utils.ts        # siteConfig + helpers
  types/
    database.ts     # TypeScript types for all DB entities
  middleware.ts     # Auth guard + security headers
supabase/
  schema.sql        # Full DB schema + RLS policies
```

---

## פריסה ב-Vercel

1. חבר ל-Vercel → הגדר Environment Variables
2. הגדר דומיין: `mimush360.co.il`
3. הגדר Typeform Webhook: `https://yourdomain.com/api/webhooks/typeform`

---

## כניסה לפאנל ניהול

1. ב-Supabase → Authentication → Users → Invite user
2. ב-SQL Editor: `UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';`
3. גש ל-`/admin/login`

---

## Built for מימוש 360
