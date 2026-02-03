'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  Users,
  FileText,
  Plus,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    matches: 0,
    applications: 0,
    profileScore: 0,
    missions: 0,
    candidates: 0,
  });

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/login');
    }
  }, [profile, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!profile) return;

      if (profile.role === 'candidate_graduate' || profile.role === 'candidate_professional') {
        const { count: matchesCount } = await supabase
          .from('matches')
          .select('*', { count: 'exact', head: true })
          .eq('candidate_id', profile.id);

        const { data: analysis } = await supabase
          .from('profile_analyses')
          .select('overall_score')
          .eq('user_id', profile.id)
          .maybeSingle();

        setStats({
          ...stats,
          matches: matchesCount || 0,
          profileScore: analysis?.overall_score || 0,
        });
      } else if (profile.role === 'recruiter') {
        const { count: missionsCount } = await supabase
          .from('missions')
          .select('*', { count: 'exact', head: true })
          .eq('recruiter_id', profile.id);

        const { data: missions } = await supabase
          .from('missions')
          .select('id')
          .eq('recruiter_id', profile.id);

        const missionIds = missions?.map(m => m.id) || [];

        const { count: candidatesCount } = await supabase
          .from('matches')
          .select('*', { count: 'exact', head: true })
          .in('mission_id', missionIds.length > 0 ? missionIds : ['']);

        setStats({
          ...stats,
          missions: missionsCount || 0,
          candidates: candidatesCount || 0,
        });
      }
    };

    fetchStats();
  }, [profile]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const renderCandidateDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Bienvenue, {profile.first_name}!
        </h1>
        <p className="text-slate-600 mt-2">
          Voici un aperçu de votre profil et de vos opportunités.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Correspondances
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.matches}</div>
            <p className="text-xs text-muted-foreground">
              Missions correspondantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Score du profil
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileScore}%</div>
            <p className="text-xs text-muted-foreground">
              Compatibilité moyenne
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Candidatures
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications}</div>
            <p className="text-xs text-muted-foreground">
              En cours
            </p>
          </CardContent>
        </Card>
      </div>

      {!profile.profile_completed && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>Complétez votre profil</CardTitle>
            <CardDescription>
              Soumettez vos informations pour que notre IA analyse votre profil et trouve les meilleures opportunités.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/profile">
              <Button>
                Compléter mon profil
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Missions recommandées</CardTitle>
          <CardDescription>
            Basées sur votre profil et vos compétences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {profile.profile_completed
              ? 'Aucune mission pour le moment'
              : 'Complétez votre profil pour voir les recommandations'}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRecruiterDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Tableau de bord recruteur
          </h1>
          <p className="text-slate-600 mt-2">
            Gérez vos missions et découvrez les meilleurs candidats.
          </p>
        </div>
        <Link href="/dashboard/missions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle mission
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Missions actives
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.missions}</div>
            <p className="text-xs text-muted-foreground">
              En ligne actuellement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Candidats matchés
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.candidates}</div>
            <p className="text-xs text-muted-foreground">
              Profils correspondants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de réponse
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Candidats récents</CardTitle>
          <CardDescription>
            Les profils les plus récents correspondant à vos missions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Aucun candidat pour le moment
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">
        Panneau d'administration
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Missions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Analyses IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Correspondances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {(profile.role === 'candidate_graduate' || profile.role === 'candidate_professional') && renderCandidateDashboard()}
      {profile.role === 'recruiter' && renderRecruiterDashboard()}
      {profile.role === 'admin' && renderAdminDashboard()}
    </DashboardLayout>
  );
}
