-- ============================================================
-- מימוש 360 — Supabase Database Schema
-- Run this in the Supabase SQL Editor to initialize the DB
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'viewer'
                CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- PAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pages (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  content      JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default pages
INSERT INTO public.pages (slug, title, is_published) VALUES
  ('home', 'דף ראשי', TRUE),
  ('about', 'אודות', TRUE),
  ('how-it-works', 'איך זה עובד', TRUE),
  ('contact', 'צור קשר', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          TEXT NOT NULL,
  content       TEXT NOT NULL,
  rating        SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert sample testimonials
INSERT INTO public.testimonials (name, content, rating, is_published, display_order) VALUES
  ('מ. כהן', 'הייתי בייאוש מוחלט אחרי שנים של ניסיונות כושלים מול ביטוח לאומי. מימוש 360 לקחו את העניין לידיים ותוך כמה חודשים קיבלתי את כל מה שמגיע לי. ממליץ בחום!', 5, TRUE, 1),
  ('ר. לוי', 'שירות מקצועי ואנושי ברמה אחרת. הם ידעו בדיוק מה לעשות, הסבירו לי כל צעד ולא הרגשתי לבד בתהליך. תודה ענקית לצוות.', 5, TRUE, 2),
  ('ש. אברהם', 'לא האמנתי שיש אנשים שבאמת רוצים לעזור ולא רק להרוויח. כל הצוות היה זמין, סבלני ואדיב. הצליחו לממש זכויות שלא ידעתי שבכלל קיימות.', 5, TRUE, 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name             TEXT,
  phone                 TEXT,
  email                 TEXT,
  message               TEXT,
  source                TEXT NOT NULL DEFAULT 'contact_form',
  status                TEXT NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new', 'contacted', 'qualified', 'disqualified', 'converted')),
  typeform_response_id  TEXT UNIQUE,
  metadata              JSONB,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);

-- ============================================================
-- LEAD NOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id     UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_by  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_notes_lead_id_idx ON public.lead_notes(lead_id);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  value       TEXT NOT NULL DEFAULT '',
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('phone',        '050-1234567',              'מספר טלפון ראשי'),
  ('whatsapp',     '972501234567',             'מספר וואטסאפ (ללא +)'),
  ('email',        'info@mimush360.co.il',     'כתובת אימייל ראשית'),
  ('address',      'ישראל',                    'כתובת העסק'),
  ('typeform_id',  '',                          'מזהה טופס Typeform')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs(created_at DESC);

-- ============================================================
-- UPDATE TIMESTAMP TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['profiles', 'pages', 'testimonials', 'leads', 'site_settings']
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS update_%s_updated_at ON public.%s;
       CREATE TRIGGER update_%s_updated_at
       BEFORE UPDATE ON public.%s
       FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.get_current_user_role() IN ('admin', 'editor', 'viewer'));

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL
  USING (public.get_current_user_role() = 'admin');

-- PAGES policies — public read, admin/editor write
DROP POLICY IF EXISTS "pages_public_select" ON public.pages;
CREATE POLICY "pages_public_select"
  ON public.pages FOR SELECT
  USING (is_published = TRUE OR public.get_current_user_role() IN ('admin', 'editor', 'viewer'));

DROP POLICY IF EXISTS "pages_editor_write" ON public.pages;
CREATE POLICY "pages_editor_write"
  ON public.pages FOR ALL
  USING (public.get_current_user_role() IN ('admin', 'editor'));

-- TESTIMONIALS policies — public read published, admin/editor write
DROP POLICY IF EXISTS "testimonials_public_select" ON public.testimonials;
CREATE POLICY "testimonials_public_select"
  ON public.testimonials FOR SELECT
  USING (is_published = TRUE OR public.get_current_user_role() IN ('admin', 'editor', 'viewer'));

DROP POLICY IF EXISTS "testimonials_editor_write" ON public.testimonials;
CREATE POLICY "testimonials_editor_write"
  ON public.testimonials FOR ALL
  USING (public.get_current_user_role() IN ('admin', 'editor'));

-- LEADS policies — admin/editor/viewer read, service role write (public insert via service key)
DROP POLICY IF EXISTS "leads_admin_select" ON public.leads;
CREATE POLICY "leads_admin_select"
  ON public.leads FOR SELECT
  USING (public.get_current_user_role() IN ('admin', 'editor', 'viewer'));

DROP POLICY IF EXISTS "leads_admin_write" ON public.leads;
CREATE POLICY "leads_admin_write"
  ON public.leads FOR ALL
  USING (public.get_current_user_role() IN ('admin', 'editor'));

-- LEAD NOTES policies
DROP POLICY IF EXISTS "lead_notes_admin_select" ON public.lead_notes;
CREATE POLICY "lead_notes_admin_select"
  ON public.lead_notes FOR SELECT
  USING (public.get_current_user_role() IN ('admin', 'editor', 'viewer'));

DROP POLICY IF EXISTS "lead_notes_editor_write" ON public.lead_notes;
CREATE POLICY "lead_notes_editor_write"
  ON public.lead_notes FOR ALL
  USING (public.get_current_user_role() IN ('admin', 'editor'));

-- SITE SETTINGS policies — public read, admin write
DROP POLICY IF EXISTS "settings_public_select" ON public.site_settings;
CREATE POLICY "settings_public_select"
  ON public.site_settings FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "settings_admin_write" ON public.site_settings;
CREATE POLICY "settings_admin_write"
  ON public.site_settings FOR ALL
  USING (public.get_current_user_role() = 'admin');

-- AUDIT LOGS policies — admin/viewer read, insert via triggers/service
DROP POLICY IF EXISTS "audit_logs_admin_select" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_select"
  ON public.audit_logs FOR SELECT
  USING (public.get_current_user_role() IN ('admin', 'viewer'));

-- ============================================================
-- GRANT anon + service_role
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
-- anon: read-only on public tables
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT ON public.pages TO anon;
-- authenticated: full CRUD (RLS policies enforce per-row access)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
-- service_role: bypass RLS
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
