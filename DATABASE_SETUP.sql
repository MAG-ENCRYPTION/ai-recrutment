/*
  # Audit Recruitment Platform - Database Setup

  INSTRUCTIONS:
  1. Ouvrez votre projet Supabase
  2. Allez dans SQL Editor
  3. Créez une nouvelle query
  4. Copiez-collez tout ce fichier
  5. Exécutez la query (Run)

  Ce script crée toute la structure de base de données nécessaire pour la plateforme.
*/

-- =====================================================
-- 1. TYPES ENUM
-- =====================================================

CREATE TYPE user_role AS ENUM ('candidate_graduate', 'candidate_professional', 'recruiter', 'admin');
CREATE TYPE notification_type AS ENUM ('match_found', 'profile_analyzed', 'new_mission', 'system');
CREATE TYPE education_level AS ENUM ('licence', 'master', 'doctorat', 'bachelor', 'mba');

-- =====================================================
-- 2. TABLES
-- =====================================================

-- Table: user_profiles
-- Extension des utilisateurs Supabase Auth avec informations de profil
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'candidate_graduate',
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company_name text,
  company_description text,
  profile_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: audit_activities
-- Liste prédéfinie des activités d'audit pour le matching
CREATE TABLE IF NOT EXISTS audit_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  keywords text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Table: missions
-- Missions/offres postées par les recruteurs
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  requirements text,
  activities uuid[] DEFAULT '{}',
  keywords text[] DEFAULT '{}',
  location text,
  contract_type text,
  salary_range text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: graduate_profiles
-- Profils des jeunes diplômés
CREATE TABLE IF NOT EXISTS graduate_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  education_level education_level NOT NULL,
  institution text NOT NULL,
  graduation_year integer NOT NULL,
  program_description text NOT NULL,
  subjects_liked text[] DEFAULT '{}',
  thesis_title text,
  thesis_problem text,
  thesis_favorite_part text,
  additional_info text,
  cv_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: professional_profiles
-- Profils des professionnels expérimentés
CREATE TABLE IF NOT EXISTS professional_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  years_experience integer NOT NULL,
  current_position text,
  cv_url text NOT NULL,
  cv_text text,
  best_skills text NOT NULL,
  passion_description text,
  preferred_work_environment text,
  additional_info text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: profile_analyses
-- Résultats des analyses IA des profils
CREATE TABLE IF NOT EXISTS profile_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  profile_type text NOT NULL,
  analysis_data jsonb NOT NULL DEFAULT '{}',
  profile_description text,
  identified_strengths text[] DEFAULT '{}',
  recommended_activities uuid[] DEFAULT '{}',
  overall_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: matches
-- Correspondances entre candidats et missions
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  mission_id uuid NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  compatibility_score integer NOT NULL,
  match_reason text,
  recruiter_viewed boolean DEFAULT false,
  candidate_viewed boolean DEFAULT false,
  recruiter_interested boolean DEFAULT false,
  candidate_interested boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(candidate_id, mission_id)
);

-- Table: notifications
-- Notifications in-app pour les utilisateurs
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE graduate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques RLS pour audit_activities
CREATE POLICY "Anyone authenticated can read activities"
  ON audit_activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage activities"
  ON audit_activities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques RLS pour missions
CREATE POLICY "Authenticated users can read active missions"
  ON missions FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Recruiters can manage own missions"
  ON missions FOR ALL
  TO authenticated
  USING (recruiter_id = auth.uid())
  WITH CHECK (recruiter_id = auth.uid());

CREATE POLICY "Admins can manage all missions"
  ON missions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques RLS pour graduate_profiles
CREATE POLICY "Users can read own graduate profile"
  ON graduate_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own graduate profile"
  ON graduate_profiles FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Recruiters can read graduate profiles"
  ON graduate_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    )
  );

-- Politiques RLS pour professional_profiles
CREATE POLICY "Users can read own professional profile"
  ON professional_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own professional profile"
  ON professional_profiles FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Recruiters can read professional profiles"
  ON professional_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    )
  );

-- Politiques RLS pour profile_analyses
CREATE POLICY "Users can read own analyses"
  ON profile_analyses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create analyses"
  ON profile_analyses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Recruiters can read all analyses"
  ON profile_analyses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    )
  );

-- Politiques RLS pour matches
CREATE POLICY "Candidates can read own matches"
  ON matches FOR SELECT
  TO authenticated
  USING (candidate_id = auth.uid());

CREATE POLICY "Recruiters can read matches for their missions"
  ON matches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM missions m
      WHERE m.id = matches.mission_id AND m.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can update match interest"
  ON matches FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM missions m
      WHERE m.id = matches.mission_id AND m.recruiter_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM missions m
      WHERE m.id = matches.mission_id AND m.recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can update own match interest"
  ON matches FOR UPDATE
  TO authenticated
  USING (candidate_id = auth.uid())
  WITH CHECK (candidate_id = auth.uid());

-- Politiques RLS pour notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- 4. INDEX POUR PERFORMANCES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_missions_recruiter ON missions(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_missions_active ON missions(is_active);
CREATE INDEX IF NOT EXISTS idx_matches_candidate ON matches(candidate_id);
CREATE INDEX IF NOT EXISTS idx_matches_mission ON matches(mission_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_profile_analyses_user ON profile_analyses(user_id);

-- =====================================================
-- 5. TRIGGERS POUR UPDATED_AT
-- =====================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer les triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at
  BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_graduate_profiles_updated_at
  BEFORE UPDATE ON graduate_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_profiles_updated_at
  BEFORE UPDATE ON professional_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_analyses_updated_at
  BEFORE UPDATE ON profile_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. DONNÉES INITIALES
-- =====================================================

-- Insérer les activités d'audit prédéfinies
INSERT INTO audit_activities (name, description, category, keywords) VALUES
  ('Audit des Comptes Fournisseurs', 'Vérification et analyse des comptes fournisseurs', 'Finance', ARRAY['comptabilité', 'fournisseurs', 'créditeurs', 'finance']),
  ('Audit des Comptes Clients', 'Analyse et contrôle des comptes clients', 'Finance', ARRAY['comptabilité', 'clients', 'débiteurs', 'finance']),
  ('Audit des Procédures Administratives', 'Revue des processus et procédures internes', 'Gouvernance', ARRAY['procédures', 'administration', 'contrôle interne', 'processus']),
  ('Audit Informatique', 'Évaluation des systèmes et infrastructures IT', 'Technologie', ARRAY['informatique', 'IT', 'systèmes', 'sécurité', 'technologie']),
  ('Audit Environnemental', 'Analyse de conformité environnementale', 'Environnement', ARRAY['environnement', 'développement durable', 'RSE', 'écologie']),
  ('Intelligence Juridique', 'Veille et analyse juridique', 'Juridique', ARRAY['droit', 'juridique', 'réglementation', 'conformité', 'legal']),
  ('Gestion de Risques', 'Identification et gestion des risques', 'Risques', ARRAY['risques', 'risk management', 'conformité', 'contrôle']),
  ('Audit Fiscal', 'Contrôle et optimisation fiscale', 'Fiscalité', ARRAY['fiscalité', 'impôts', 'taxes', 'fiscal']),
  ('Audit Social', 'Analyse des aspects sociaux et RH', 'Social', ARRAY['social', 'RH', 'ressources humaines', 'paie']),
  ('Due Diligence', 'Audit d''acquisition et fusion', 'M&A', ARRAY['acquisition', 'fusion', 'due diligence', 'évaluation'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

-- Vérifier que tout s'est bien passé
SELECT 'Database setup completed successfully!' as status;
