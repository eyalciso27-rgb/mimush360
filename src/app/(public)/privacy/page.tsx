import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'מדיניות פרטיות | מימוש 360',
  description: 'מדיניות הפרטיות של מימוש 360 — כיצד אנו אוספים, משתמשים ומגנים על המידע שלך.',
}

export default function PrivacyPage() {
  const lastUpdated = 'ינואר 2025'

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-black mb-3">מדיניות פרטיות</h1>
          <p className="text-white/75 text-base">עודכן לאחרונה: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">

            {/* Intro */}
            <div>
              <p className="text-gray-600">
                מימוש 360 (&quot;אנחנו&quot;, &quot;החברה&quot;) מחויבת להגנה על פרטיותכם. מדיניות זו מסבירה אילו
                פרטים אנו אוספים, כיצד אנו משתמשים בהם, ומהן הזכויות שלכם — בהתאם לחוק הגנת
                הפרטיות תשמ&quot;א-1981 ותקנותיו.
              </p>
            </div>

            {/* 1 */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">1. איזה מידע אנו אוספים?</h2>
              <div className="space-y-3 text-gray-600">
                <p><strong className="text-gray-800">מידע שאתם מוסרים לנו ישירות:</strong></p>
                <ul className="list-disc list-inside space-y-1.5 mr-4">
                  <li>שם מלא, מספר טלפון וכתובת דוא&quot;ל — בעת מילוי טופס יצירת קשר או שאלון זכאות</li>
                  <li>פרטים רפואיים ואישיים הרלוונטיים לבדיקת הזכאות — בעת שיחה עם נציג</li>
                  <li>כל מידע נוסף שתבחרו לשתף אתנו</li>
                </ul>
                <p className="mt-3"><strong className="text-gray-800">מידע הנאסף אוטומטית:</strong></p>
                <ul className="list-disc list-inside space-y-1.5 mr-4">
                  <li>כתובת IP, סוג דפדפן, מערכת הפעלה</li>
                  <li>עמודים שביקרתם בהם ומשך הביקור (דרך כלי אנליטיקה)</li>
                  <li>מקור ההגעה לאתר (חיפוש, מדיה חברתית וכו&apos;)</li>
                </ul>
                <p className="mt-3"><strong className="text-gray-800">עוגיות (Cookies):</strong></p>
                <p>
                  אנו משתמשים בעוגיות טכניות הכרחיות לתפקוד האתר, ובעוגיות אנליטיקה לשיפור השירות.
                  ניתן לנהל את העדפות העוגיות דרך הדפדפן שלכם.
                </p>
              </div>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">2. לשם מה אנו משתמשים במידע?</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mr-4">
                <li>יצירת קשר בחזרה ומענה לפנייתכם</li>
                <li>בדיקת זכאות למימוש זכויות רפואיות</li>
                <li>ליווי וייצוג מולביטוח לאומי וגורמים רלוונטיים</li>
                <li>שיפור השירות וחוויית המשתמש באתר</li>
                <li>עמידה בדרישות חוקיות ורגולטוריות</li>
                <li>שליחת עדכונים רלוונטיים — בכפוף להסכמתכם</li>
              </ul>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">3. שיתוף מידע עם צדדים שלישיים</h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  אנו <strong className="text-gray-800">לא מוכרים</strong> את המידע האישי שלכם לצדדים שלישיים.
                  עם זאת, ייתכן שנשתף מידע במקרים הבאים:
                </p>
                <ul className="list-disc list-inside space-y-1.5 mr-4">
                  <li><strong className="text-gray-800">גורמים מקצועיים:</strong> גורמים מורשים הנדרשים לטיפול בתיק שלכם (עם הסכמתכם)</li>
                  <li><strong className="text-gray-800">ספקי שירות:</strong> חברות תוכנה המסייעות בהפעלת האתר (כגון שרות אחסון ענן), בהסכמים של סודיות</li>
                  <li><strong className="text-gray-800">דרישה חוקית:</strong> בית משפט, רשויות אכיפה — כאשר קיימת חובה חוקית</li>
                </ul>
              </div>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">4. אבטחת מידע</h2>
              <p className="text-gray-600">
                אנו נוקטים באמצעי אבטחה סבירים לשמירה על המידע שלכם, לרבות הצפנת SSL, גישה מוגבלת
                לנתונים ואחסון מאובטח. עם זאת, אין אפשרות להבטיח אבטחה מוחלטת בסביבת האינטרנט.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">5. שמירת מידע</h2>
              <p className="text-gray-600">
                אנו שומרים את המידע האישי שלכם כל עוד הוא נחוץ למטרות שלשמן נאסף, או כנדרש על פי חוק.
                לאחר מכן נמחק את המידע או נפנה אותו בצורה מאובטחת.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">6. הזכויות שלכם</h2>
              <p className="text-gray-600 mb-3">בהתאם לחוק, עומדות לכם הזכויות הבאות:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mr-4">
                <li><strong className="text-gray-800">עיון:</strong> לדעת אילו פרטים מוחזקים אצלנו לגביכם</li>
                <li><strong className="text-gray-800">תיקון:</strong> לבקש תיקון של מידע שגוי</li>
                <li><strong className="text-gray-800">מחיקה:</strong> לבקש מחיקת המידע שלכם, בכפוף לחובות חוקיות</li>
                <li><strong className="text-gray-800">הגבלת עיבוד:</strong> לבקש הגבלה של השימוש במידע שלכם</li>
                <li><strong className="text-gray-800">ביטול הסכמה:</strong> לביטול הסכמה לקבלת פניות שיווקיות בכל עת</li>
              </ul>
              <p className="mt-3 text-gray-600">
                לממוש זכויותיכם, אנא פנו אלינו בפרטים המופיעים בסעיף 8.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">7. קישורים לאתרים חיצוניים</h2>
              <p className="text-gray-600">
                האתר עשוי לכלול קישורים לאתרים חיצוניים (כגון ביטוח לאומי, WhatsApp). אנו אינם
                אחראים למדיניות הפרטיות של אתרים אלה ומומלץ לעיין בה ישירות.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">8. יצירת קשר</h2>
              <p className="text-gray-600 mb-4">
                לכל שאלה, בקשה או תלונה בנושא פרטיות, ניתן לפנות אלינו:
              </p>
              <div className="bg-gray-50 rounded-xl p-5 space-y-2 text-sm text-gray-600">
                <p><strong className="text-gray-800">מימוש 360</strong></p>
                <p>
                  דוא&quot;ל:{' '}
                  <a href="mailto:info@mimush360.co.il" className="text-[#2D6A4F] hover:underline">
                    info@mimush360.co.il
                  </a>
                </p>
                <p>
                  טלפון:{' '}
                  <a href="tel:0500000000" className="text-[#2D6A4F] hover:underline" dir="ltr">
                    050-000-0000
                  </a>
                </p>
              </div>
            </div>

            {/* 9 */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">9. שינויים במדיניות</h2>
              <p className="text-gray-600">
                אנו עשויים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו באתר עם עדכון
                תאריך &quot;עודכן לאחרונה&quot;. המשך שימוש באתר לאחר פרסום שינויים מהווה הסכמה למדיניות המעודכנת.
              </p>
            </div>

            {/* Footer note */}
            <div className="text-sm text-gray-400 pt-4 border-t border-gray-100">
              <p>מדיניות זו עודכנה לאחרונה: {lastUpdated}</p>
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
