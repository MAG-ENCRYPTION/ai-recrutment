# Plateforme de Recrutement Audit avec IA

Une plateforme web intelligente qui connecte les talents non-traditionnels avec les opportunités en audit légal, propulsée par l'intelligence artificielle.

## Fonctionnalités Principales

### Pour les Candidats
- **Profil Jeune Diplômé**: Soumission d'informations académiques, thèse, matières préférées
- **Profil Professionnel**: Upload de CV, description des compétences et passions
- **Analyse IA**: Analyse automatique du profil pour identifier les forces et compatibilités
- **Matching Intelligent**: Recommandations de missions basées sur le profil
- **Dashboard Personnalisé**: Suivi des candidatures et opportunités

### Pour les Recruteurs
- **Gestion de Missions**: Création et gestion d'offres de missions d'audit
- **Base de Candidats**: Accès aux profils analysés par IA
- **Scoring de Compatibilité**: Score de matching pour chaque candidat
- **Filtres et Recherche**: Outils avancés pour trouver les meilleurs talents

### Pour les Administrateurs
- **Gestion des Utilisateurs**: Administration complète des comptes
- **Gestion des Missions**: Supervision de toutes les missions
- **Activités d'Audit**: Configuration des types d'activités prédéfinies
- **Rapports**: Vue d'ensemble et statistiques

## Technologies Utilisées

### Frontend
- **Next.js 13**: Framework React avec App Router
- **React 18**: Bibliothèque UI
- **TypeScript**: Typage statique
- **Tailwind CSS**: Framework CSS utility-first
- **shadcn/ui**: Composants UI accessibles et stylisés
- **Lucide React**: Bibliothèque d'icônes

### Backend & Base de Données
- **Supabase**: Backend-as-a-Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Storage pour les CVs
  - Edge Functions pour l'analyse IA

### Intelligence Artificielle
- **Edge Functions**: Traitement IA côté serveur
- **Analyse NLP**: Extraction d'entités et similarité sémantique
- **Scoring**: Algorithmes de matching basés sur les compétences

## Installation

### Prérequis
- Node.js 18+ et npm
- Un compte Supabase

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd audit-recrutement
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**

   a. Créez un projet sur [Supabase](https://supabase.com)

   b. Créez un fichier `.env.local`:
```bash
cp .env.local.example .env.local
```

   c. Remplissez les variables d'environnement:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. **Configuration de la base de données**

   Exécutez les migrations SQL dans l'éditeur SQL de Supabase:

   - Créez les tables (user_profiles, audit_activities, missions, etc.)
   - Configurez les politiques RLS
   - Insérez les activités d'audit par défaut

   Voir le fichier `supabase/migrations/create_audit_recruitment_schema.sql`

5. **Créer le bucket de storage**

   Dans Supabase Storage, créez un bucket nommé `cvs`:
   - Public: Oui
   - File size limit: 10MB
   - Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document

6. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Structure du Projet

```
audit-recrutement/
├── app/                          # Pages Next.js (App Router)
│   ├── page.tsx                 # Page d'accueil
│   ├── login/                   # Page de connexion
│   ├── signup/                  # Page d'inscription
│   └── dashboard/               # Pages du dashboard
│       ├── page.tsx             # Dashboard principal
│       ├── profile/             # Profil candidat
│       ├── missions/            # Gestion des missions (recruteur)
│       ├── candidates/          # Liste des candidats (recruteur)
│       └── admin/               # Panneau admin
├── components/                   # Composants React réutilisables
│   ├── ui/                      # Composants shadcn/ui
│   ├── forms/                   # Formulaires
│   │   ├── GraduateProfileForm.tsx
│   │   └── ProfessionalProfileForm.tsx
│   └── DashboardLayout.tsx      # Layout du dashboard
├── contexts/                     # Contextes React
│   └── AuthContext.tsx          # Gestion de l'authentification
├── lib/                         # Utilitaires et configuration
│   ├── supabase.ts              # Client Supabase + Types
│   └── utils.ts                 # Fonctions utilitaires
├── supabase/                    # Configuration Supabase
│   ├── migrations/              # Migrations SQL
│   └── functions/               # Edge Functions pour l'IA
└── public/                      # Fichiers statiques
```

## Utilisation

### 1. Inscription

Visitez `/signup` et créez un compte en choisissant votre type:
- **Candidat Jeune Diplômé**: Pour les récents diplômés
- **Candidat Professionnel**: Pour les professionnels expérimentés
- **Recruteur**: Pour les cabinets d'audit

### 2. Pour les Candidats

**Jeune Diplômé**:
1. Allez dans "Mon Profil"
2. Remplissez vos informations académiques
3. Décrivez votre programme, matières préférées, thèse
4. Soumettez pour analyse IA

**Professionnel**:
1. Allez dans "Mon Profil"
2. Uploadez votre CV (PDF/Word)
3. Décrivez vos compétences et passions
4. Soumettez pour analyse IA

L'IA analyse automatiquement votre profil et génère:
- Un score de compatibilité
- Une description de votre profil
- Des recommandations d'activités d'audit
- Des correspondances avec des missions

### 3. Pour les Recruteurs

1. Créez vos missions dans "Missions" > "Nouvelle mission"
2. Sélectionnez les activités d'audit associées
3. Consultez les candidats matchés dans "Candidats"
4. Filtrez par type, score, compétences
5. Contactez les candidats intéressants

### 4. Pour les Administrateurs

Accédez au panneau d'administration pour:
- Gérer tous les utilisateurs
- Superviser les missions
- Voir les statistiques globales
- Configurer les activités d'audit

## Modèle de Données

### Tables Principales

- **user_profiles**: Profils utilisateurs avec rôles
- **graduate_profiles**: Profils des jeunes diplômés
- **professional_profiles**: Profils des professionnels
- **missions**: Missions d'audit postées par les recruteurs
- **audit_activities**: Activités d'audit prédéfinies
- **profile_analyses**: Résultats des analyses IA
- **matches**: Correspondances candidats-missions
- **notifications**: Notifications in-app

### Rôles Utilisateurs

- `candidate_graduate`: Jeune diplômé
- `candidate_professional`: Professionnel expérimenté
- `recruiter`: Recruteur de cabinet
- `admin`: Administrateur

## Sécurité

### Row Level Security (RLS)

Toutes les tables utilisent RLS pour garantir:
- Les candidats ne voient que leurs propres données
- Les recruteurs ne voient que leurs missions et candidats matchés
- Les admins ont accès complet
- Aucune donnée n'est accessible sans authentification

### Authentification

- JWT tokens via Supabase Auth
- Tokens stockés en localStorage
- Refresh automatique des sessions
- Politiques de mot de passe sécurisées

## Déploiement

### Vercel (Recommandé pour le Frontend)

1. Créez un compte sur [Vercel](https://vercel.com)
2. Connectez votre repository GitHub
3. Configurez les variables d'environnement
4. Déployez automatiquement

### Supabase (Backend)

Le backend est déjà hébergé sur Supabase. Assurez-vous de:
1. Configurer les variables d'environnement de production
2. Activer les Edge Functions si utilisées
3. Configurer les domaines personnalisés si nécessaire

## Développement

### Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linter ESLint
npm run typecheck    # Vérification TypeScript
```

### Tests

```bash
# À implémenter
npm run test         # Tests unitaires
npm run test:e2e     # Tests end-to-end
```

## Fonctionnalités Future (Roadmap)

- [ ] Analyse IA avancée avec modèles NLP
- [ ] Notifications en temps réel (WebSockets)
- [ ] Chat intégré candidat-recruteur
- [ ] Export de rapports PDF
- [ ] Internationalisation (EN, ES)
- [ ] Application mobile (React Native)
- [ ] Tests automatisés complets
- [ ] Analytics et tableaux de bord avancés

## Support

Pour toute question ou problème:
- Ouvrez une issue sur GitHub
- Consultez la documentation Supabase
- Contactez l'équipe de support

## Licence

Tous droits réservés - 2024

---

Développé avec Next.js, Supabase et l'IA pour révolutionner le recrutement en audit.
