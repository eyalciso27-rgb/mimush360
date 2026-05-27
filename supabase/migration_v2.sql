-- Migration v2: Add faqs table, extend leads

-- FAQs table
CREATE TABLE IF NOT EXISTS public.faqs (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question      TEXT NOT NULL,
  answer        TEXT NOT NULL,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default FAQs (from the hardcoded ones currently in how-it-works page)
INSERT INTO public.faqs (question, answer, display_order) VALUES
  ('כמה זמן לוקח התהליך?', 'התהליך תלוי בסוג הזכאות ובנסיבות האישיות. בממוצע, מדובר על כמה חודשים מרגע הגשת הבקשה ועד קבלת ההחלטה.', 1),
  ('כמה עולה השירות?', 'הייעוץ הראשוני הוא חינם לחלוטין. בהמשך, העלות תלויה בסוג השירות ותוסבר לכם בשקיפות מלאה לפני כל התחייבות.', 2),
  ('מה קורה אם הבקשה נדחית?', 'אנחנו לא מוותרים. במקרה של דחייה, בוחנים את האפשרויות להשיג ולערער — ולרוב מצליחים לשנות את ההחלטה.', 3),
  ('האם אני צריך לבוא למשרד?', 'לא בהכרח. רוב ההתנהלות יכולה להתבצע מרחוק, דרך טלפון, וואטסאפ ומייל. נסגל את התהליך לצרכים שלכם.', 4),
  ('האם גם בני משפחה יכולים להגיש?', 'כן! אנחנו מסייעים גם לבני משפחה שמגישים תביעות בשם יקיריהם. ניתן לטפל בכמה תיקים בו-זמנית.', 5)
ON CONFLICT DO NOTHING;

-- Extend leads table
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;

-- Add meta_description to pages table
ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- RLS for faqs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "faqs_public_select" ON public.faqs;
CREATE POLICY "faqs_public_select"
  ON public.faqs FOR SELECT
  USING (is_published = TRUE OR public.get_current_user_role() IN ('admin', 'editor', 'viewer'));

DROP POLICY IF EXISTS "faqs_editor_write" ON public.faqs;
CREATE POLICY "faqs_editor_write"
  ON public.faqs FOR ALL
  USING (public.get_current_user_role() IN ('admin', 'editor'));

-- Trigger for updated_at on faqs
DROP TRIGGER IF EXISTS update_faqs_updated_at ON public.faqs;
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Grants
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
