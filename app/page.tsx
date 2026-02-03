import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, TrendingUp, Sparkles, ArrowRight, CheckCircle, Building } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-slate-900 p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-slate-900">
                Audit Recrutement IA
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link href="/signup">
                <Button>S'inscrire</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Propulsé par l'Intelligence Artificielle
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Recrutement intelligent pour
                <br />
                <span className="text-slate-700">les cabinets d'audit</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Connectez les talents non-traditionnels avec les opportunités en audit légal.
                Notre IA analyse les profils pour identifier les meilleures correspondances.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Espace recruteur
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Comment ça fonctionne
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle>1. Créez votre profil</CardTitle>
                  <CardDescription>
                    Jeune diplômé ou professionnel expérimenté, partagez votre parcours et vos aspirations
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle>2. Analyse IA</CardTitle>
                  <CardDescription>
                    Notre intelligence artificielle analyse votre profil et identifie vos forces uniques
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle>3. Matching intelligent</CardTitle>
                  <CardDescription>
                    Recevez des opportunités de missions parfaitement adaptées à votre profil
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-slate-900">
                  Pour les candidats
                </h2>
                <p className="text-lg text-slate-600">
                  Que vous soyez fraîchement diplômé ou professionnel expérimenté, notre plateforme
                  vous aide à valoriser vos compétences uniques et à trouver des opportunités en audit.
                </p>
                <ul className="space-y-4">
                  {[
                    'Analyse IA de votre profil académique ou professionnel',
                    'Matching avec des missions adaptées à vos compétences',
                    'Valorisation de parcours non-traditionnels',
                    'Accès à des cabinets d\'audit de renom',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button size="lg">
                    Créer mon profil candidat
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Users className="h-24 w-24 mx-auto mb-4" />
                  <p>Espace candidat</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 h-96 flex items-center justify-center order-2 lg:order-1">
                <div className="text-center text-slate-400">
                  <Building className="h-24 w-24 mx-auto mb-4" />
                  <p>Espace recruteur</p>
                </div>
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <h2 className="text-4xl font-bold text-slate-900">
                  Pour les recruteurs
                </h2>
                <p className="text-lg text-slate-600">
                  Élargissez votre vivier de talents et découvrez des profils non-traditionnels
                  parfaitement adaptés aux missions d'audit de haut niveau.
                </p>
                <ul className="space-y-4">
                  {[
                    'Accès à des talents diversifiés et qualifiés',
                    'Scoring IA pour chaque candidat',
                    'Gestion simplifiée de vos missions',
                    'Recommandations personnalisées',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button size="lg">
                    Créer mon compte recruteur
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">
              Prêt à transformer votre recrutement ?
            </h2>
            <p className="text-xl text-slate-300">
              Rejoignez la plateforme qui révolutionne le recrutement dans l'audit
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-slate-900 p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 font-bold text-slate-900">
                  Audit Recrutement
                </span>
              </div>
              <p className="text-sm text-slate-600">
                La plateforme de recrutement intelligente pour les cabinets d'audit
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Plateforme</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/signup">S'inscrire</Link></li>
                <li><Link href="/login">Connexion</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Légal</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#">Confidentialité</a></li>
                <li><a href="#">Conditions</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-slate-600">
            2024 Audit Recrutement. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
