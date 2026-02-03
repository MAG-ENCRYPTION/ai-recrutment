# Guide de Déploiement - Plateforme Audit Recrutement

Ce guide explique comment déployer l'application en production.

## Prérequis

- Projet Supabase configuré (voir SETUP_INSTRUCTIONS.md)
- Compte Vercel ou autre plateforme de déploiement
- Git repository (GitHub, GitLab, etc.)

## Déploiement sur Vercel (Recommandé)

### Méthode 1: Depuis l'interface Vercel

1. **Créer un compte Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Créez un compte avec GitHub, GitLab ou email

2. **Importer le projet**
   - Cliquez sur "Add New..." > "Project"
   - Sélectionnez votre repository Git
   - Cliquez sur "Import"

3. **Configurer les variables d'environnement**
   - Dans la section "Environment Variables", ajoutez:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
   ```

4. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez la fin du build (3-5 minutes)
   - Votre application est en ligne!

### Méthode 2: Depuis la ligne de commande

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   vercel
   ```

4. **Configurer les variables d'environnement**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   ```

5. **Redéployer en production**
   ```bash
   vercel --prod
   ```

## Déploiement sur Netlify

1. **Créer un compte Netlify**
   - Allez sur [netlify.com](https://netlify.com)
   - Connectez-vous avec GitHub

2. **Nouveau site**
   - Cliquez sur "Add new site" > "Import an existing project"
   - Sélectionnez votre repository

3. **Configuration du build**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Variables d'environnement**
   - Ajoutez les variables dans Site settings > Environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

5. **Déployer**
   - Cliquez sur "Deploy site"

## Configuration Supabase pour la Production

### 1. URLs Autorisées

Dans Supabase Dashboard > Authentication > URL Configuration:

**Site URL:**
```
https://votre-domaine.vercel.app
```

**Redirect URLs (ajoutez ces lignes):**
```
https://votre-domaine.vercel.app/**
https://votre-domaine.com/**
```

### 2. Sécurité

1. **Limites de taux (Rate Limiting)**
   - Allez dans Settings > API
   - Configurez les limites selon vos besoins

2. **Activer les logs d'audit**
   - Settings > Logs
   - Activez "Log retention"

3. **Sauvegardes automatiques**
   - Upgrade vers un plan payant pour les sauvegardes automatiques
   - Ou configurez des sauvegardes manuelles régulières

### 3. Performance

1. **Activer le cache**
   - Les politiques RLS sont déjà optimisées
   - Utilisez les index créés lors de la migration

2. **CDN pour le Storage**
   - Le storage Supabase utilise déjà un CDN
   - Vérifiez que vos fichiers sont publics si nécessaire

## Domaine Personnalisé

### Sur Vercel

1. **Ajouter un domaine**
   - Allez dans Settings > Domains
   - Cliquez sur "Add"
   - Entrez votre domaine (ex: audit-recrutement.com)

2. **Configurer le DNS**
   Ajoutez ces enregistrements chez votre registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL/HTTPS**
   - Automatiquement géré par Vercel
   - Certificat Let's Encrypt gratuit

### Mettre à jour Supabase

N'oubliez pas d'ajouter votre domaine personnalisé dans les URLs autorisées Supabase!

## Variables d'Environnement

### Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-de-production
```

### Staging (optionnel)

Si vous voulez un environnement de staging:

```env
NEXT_PUBLIC_SUPABASE_URL=https://projet-staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=clé-anon-staging
```

## Monitoring et Analytics

### 1. Vercel Analytics

Activez Vercel Analytics pour suivre:
- Nombre de visiteurs
- Performances (Core Web Vitals)
- Erreurs

```bash
npm install @vercel/analytics
```

Ajoutez dans `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Supabase Logs

Consultez régulièrement les logs dans Supabase:
- Database logs
- API logs
- Auth logs

## Edge Functions (Optionnel - IA)

Si vous implémentez les Edge Functions pour l'analyse IA:

### Installation

```bash
npm install -g supabase
supabase login
supabase link --project-ref votre-projet-id
```

### Créer une fonction

```bash
supabase functions new analyze-profile
```

### Déployer

```bash
supabase functions deploy analyze-profile --no-verify-jwt
```

### Définir les secrets

```bash
supabase secrets set OPENAI_API_KEY=sk-...
```

## CI/CD Automatique

### GitHub Actions (Vercel)

Créez `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Sauvegardes

### Base de données

1. **Backup automatique (Plan Pro)**
   - Activé automatiquement
   - Point-in-time recovery

2. **Backup manuel**
   ```bash
   # Installer Supabase CLI
   npm install -g supabase

   # Exporter la base de données
   supabase db dump -f backup.sql
   ```

### Storage (CVs)

1. **Backup manuel**
   - Téléchargez régulièrement le contenu du bucket
   - Utilisez l'API Storage

2. **Script de backup**
   ```javascript
   const { createClient } = require('@supabase/supabase-js')
   const supabase = createClient(URL, KEY)

   async function backupCVs() {
     const { data } = await supabase.storage.from('cvs').list()
     // Télécharger chaque fichier
   }
   ```

## Rollback

### En cas de problème

**Sur Vercel:**
1. Allez dans Deployments
2. Trouvez le dernier déploiement qui fonctionnait
3. Cliquez sur "..." > "Promote to Production"

**Base de données:**
1. Utilisez Point-in-time recovery (Plan Pro)
2. Ou restaurez un backup manuel

## Checklist Avant le Déploiement

- [ ] Tests locaux réussis (`npm run build`)
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Storage bucket créé
- [ ] URLs autorisées dans Supabase
- [ ] Domaine configuré (optionnel)
- [ ] Analytics activés
- [ ] Sauvegardes configurées
- [ ] Documentation mise à jour

## Support Post-Déploiement

### Surveillance

1. **Erreurs**
   - Vérifiez Vercel Logs
   - Vérifiez Supabase Logs
   - Configurez des alertes

2. **Performance**
   - Surveillez Core Web Vitals
   - Optimisez les requêtes lentes

3. **Sécurité**
   - Revoyez les politiques RLS régulièrement
   - Mettez à jour les dépendances
   ```bash
   npm audit
   npm update
   ```

## Mises à jour

### Process de mise à jour

1. **Développer dans une branche**
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   ```

2. **Tester localement**
   ```bash
   npm run dev
   npm run build
   ```

3. **Déployer en staging** (optionnel)
   ```bash
   vercel
   ```

4. **Merger en production**
   ```bash
   git checkout main
   git merge feature/nouvelle-fonctionnalite
   git push
   ```

Vercel déploie automatiquement!

## Coûts Estimés

### Gratuit (Début)
- **Vercel**: Plan Hobby (gratuit)
  - Bande passante: 100 GB/mois
  - Builds: Illimités

- **Supabase**: Plan Free
  - Base de données: 500 MB
  - Storage: 1 GB
  - Bandwidth: 2 GB

### Production (Recommandé)
- **Vercel Pro**: $20/mois
  - Support prioritaire
  - Domaines personnalisés illimités

- **Supabase Pro**: $25/mois
  - 8 GB base de données
  - 100 GB storage
  - Backups automatiques

## Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Netlify](https://docs.netlify.com)
- [Documentation Supabase](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

Besoin d'aide ? Consultez les documentations officielles ou contactez le support.
