'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Mission } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Briefcase, Edit, Trash2 } from 'lucide-react';

export default function MissionsPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/login');
    }

    if (profile && profile.role !== 'recruiter' && profile.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [profile, loading, router]);

  useEffect(() => {
    const fetchMissions = async () => {
      if (!profile) return;

      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('recruiter_id', profile.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMissions(data);
      }

      setLoadingMissions(false);
    };

    fetchMissions();
  }, [profile]);

  const deleteMission = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) return;

    await supabase.from('missions').delete().eq('id', id);
    setMissions(missions.filter(m => m.id !== id));
  };

  if (loading || !profile) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mes Missions</h1>
            <p className="text-slate-600 mt-2">
              Gérez vos offres de missions et trouvez les meilleurs candidats
            </p>
          </div>
          <Link href="/dashboard/missions/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle mission
            </Button>
          </Link>
        </div>

        {loadingMissions ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          </div>
        ) : missions.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Aucune mission pour le moment</p>
                <p className="mb-4">Créez votre première mission pour commencer à recevoir des candidatures</p>
                <Link href="/dashboard/missions/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une mission
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {missions.map((mission) => (
              <Card key={mission.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle>{mission.title}</CardTitle>
                        <Badge variant={mission.is_active ? 'default' : 'secondary'}>
                          {mission.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center space-x-4">
                        {mission.location && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {mission.location}
                          </span>
                        )}
                        {mission.contract_type && (
                          <span>{mission.contract_type}</span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMission(mission.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">{mission.description}</p>
                  {mission.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mission.keywords.map((keyword, i) => (
                        <Badge key={i} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
