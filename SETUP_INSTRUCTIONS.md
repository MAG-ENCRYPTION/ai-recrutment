# Instructions de Configuration - Plateforme Audit Recrutement

Ce guide vous accompagne étape par étape dans la configuration complète de l'application.

## Étape 1: Configuration de Supabase

### 1.1 Créer un Projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Donnez un nom à votre projet (ex: "audit-recrutement")
5. Choisissez un mot de passe de base de données sécurisé
6. Sélectionnez une région proche de vos utilisateurs
7. Cliquez sur "Create new project"

### 1.2 Récupérer les Clés API

Une fois le projet créé:

1. Dans le menu de gauche, cliquez sur "Settings" (icône engrenage)
2. Allez dans "API"
3. Copiez les valeurs suivantes:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Commence par `eyJhbGciOiJIUzI1N...`

### 1.3 Exécuter la Migration SQL

1. Dans le menu de gauche, cliquez sur "SQL Editor"
2. Cliquez sur "New query"
3. Copiez tout le contenu du fichier `supabase/migrations/001_create_audit_recruitment_schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur "Run" (ou appuyez sur Ctrl+Enter)

Vous devriez voir le message "Success. No rows returned" - c'est normal!

Cette migration crée:
- 8 tables (user_profiles, audit_activities, missions, etc.)
- Toutes les politiques de sécurité RLS
- Les activités d'audit par défaut
- Les index pour les performances

### 1.4 Créer le Bucket de Storage

Pour les CVs des candidats:

1. Dans le menu de gauche, cliquez sur "Storage"
2. Cliquez sur "New bucket"
3. Nom du bucket: `cvs`
4. Configurez:
   - **Public bucket**: ✅ Coché (pour permettre l'accès aux CVs)
   - **File size limit**: 10 MB
   - **Allowed MIME types**:
     - `application/pdf`
     - `application/msword`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
5. Cliquez sur "Create bucket"

### 1.5 Vérifier l'Authentification

1. Dans le menu de gauche, cliquez sur "Authentication"
2. Allez dans "Providers"
3. Vérifiez que "Email" est activé (par défaut)
4. Vous pouvez désactiver "Email confirmation" pour faciliter les tests:
   - Allez dans "Settings" > "Auth" > "Email Auth"
   - Décochez "Enable email confirmations"

## Étape 2: Configuration de l'Application Next.js

### 2.1 Installation des Dépendances

```bash
cd /tmp/cc-agent/63328011/project
npm install
```

### 2.2 Configuration des Variables d'Environnement

1. Créez un fichier `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Éditez `.env.local` et remplacez par vos valeurs:

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-très-longue
```

### 2.3 Lancer l'Application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Étape 3: Créer les Premiers Utilisateurs

### 3.1 Créer un Compte Admin

1. Allez sur [http://localhost:3000/signup](http://localhost:3000/signup)
2. Créez un compte avec le type "Candidat" (temporaire)
3. Connectez-vous à Supabase Dashboard
4. Allez dans "Table Editor" > "user_profiles"
5. Trouvez votre utilisateur et changez:
   - `role`: `admin`
6. Déconnectez-vous et reconnectez-vous

Vous avez maintenant accès au panneau d'administration!

### 3.2 Créer un Compte Recruteur

1. Inscrivez-vous avec le type "Recruteur"
2. Remplissez les informations du cabinet
3. Vous pouvez maintenant créer des missions

### 3.3 Créer un Compte Candidat

1. Inscrivez-vous avec "Candidat Jeune Diplômé" ou "Candidat Professionnel"
2. Complétez votre profil
3. L'IA analysera automatiquement votre profil (simulé pour l'instant)

## Étape 4: Tester l'Application

### Test du Flux Candidat

1. Connectez-vous en tant que candidat
2. Allez dans "Mon Profil"
3. Remplissez toutes les informations
4. Soumettez le formulaire
5. Vérifiez que le profil est marqué comme "complété"

### Test du Flux Recruteur

1. Connectez-vous en tant que recruteur
2. Créez une nouvelle mission:
   - Titre, description
   - Sélectionnez des activités d'audit
   - Ajoutez des mots-clés
3. Allez dans "Candidats" pour voir les profils (vides pour l'instant)

### Test du Panneau Admin

1. Connectez-vous en tant qu'admin
2. Vérifiez l'accès au panneau d'administration
3. Consultez les statistiques

## Étape 5: Configuration Optionnelle

### 5.1 Edge Functions pour l'IA (Avancé)

Pour implémenter l'analyse IA réelle:

1. Installez Supabase CLI:
```bash
npm install -g supabase
```

2. Connectez-vous à votre projet:
```bash
supabase login
supabase link --project-ref votre-projet-id
```

3. Créez une Edge Function:
```bash
supabase functions new analyze-profile
```

4. Implémentez la logique d'analyse dans le fichier créé

5. Déployez:
```bash
supabase functions deploy analyze-profile
```

### 5.2 Email Templates

Pour personnaliser les emails d'authentification:

1. Allez dans Supabase Dashboard
2. "Authentication" > "Email Templates"
3. Personnalisez les templates pour:
   - Confirmation d'inscription
   - Réinitialisation de mot de passe
   - Changement d'email

## Étape 6: Déploiement en Production

### 6.1 Déployer sur Vercel

1. Créez un compte sur [https://vercel.com](https://vercel.com)
2. Installez Vercel CLI:
```bash
npm install -g vercel
```

3. Déployez:
```bash
vercel
```

4. Configurez les variables d'environnement dans Vercel:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

5. Redéployez:
```bash
vercel --prod
```

### 6.2 Configuration de Production Supabase

1. Activez les sauvegardes automatiques
2. Configurez les limites de taux (rate limiting)
3. Ajoutez votre domaine personnalisé dans les URLs autorisées
4. Activez les logs d'audit

## Dépannage

### Erreur: "Invalid API key"

- Vérifiez que vous avez copié la bonne clé `anon` dans `.env.local`
- Vérifiez qu'il n'y a pas d'espaces avant/après la clé

### Erreur: "relation does not exist"

- La migration SQL n'a pas été exécutée correctement
- Retournez à l'étape 1.3 et réexécutez la migration

### Erreur: "Row Level Security policy violation"

- Les politiques RLS sont strictes par défaut
- Vérifiez que vous êtes bien authentifié
- Vérifiez que votre rôle utilisateur est correct dans la table `user_profiles`

### Problème de téléchargement de CV

- Vérifiez que le bucket `cvs` existe et est public
- Vérifiez les MIME types autorisés
- Vérifiez la taille limite (10 MB)

## Support

Pour toute question:

1. Consultez la documentation Supabase: [https://supabase.com/docs](https://supabase.com/docs)
2. Consultez la documentation Next.js: [https://nextjs.org/docs](https://nextjs.org/docs)
3. Ouvrez une issue sur le repository GitHub

## Prochaines Étapes

Une fois l'application configurée:

1. Personnalisez les couleurs et le design (voir `tailwind.config.ts`)
2. Implémentez l'analyse IA réelle avec les Edge Functions
3. Ajoutez des tests (Jest + React Testing Library)
4. Configurez les notifications en temps réel
5. Ajoutez l'export PDF des profils
6. Implémentez le système de chat

Bonne configuration !
