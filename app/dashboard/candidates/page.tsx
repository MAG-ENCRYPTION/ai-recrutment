'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, UserProfile, Match } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, TrendingUp, Mail, Phone } from 'lucide-react';

interface CandidateWithMatch {
  candidate: UserProfile;
  match: Match;
  score: number;
}

export default function CandidatesPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [candidates, setCandidates] = useState<CandidateWithMatch[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateWithMatch[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/login');
    }

    if (profile && profile.role !== 'recruiter' && profile.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [profile, loading, router]);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!profile) return;

      const { data: missions } = await supabase
        .from('missions')
        .select('id')
        .eq('recruiter_id', profile.id);

      const missionIds = missions?.map(m => m.id) || [];

      if (missionIds.length === 0) {
        setLoadingCandidates(false);
        return;
      }

      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .in('mission_id', missionIds)
        .order('compatibility_score', { ascending: false });

      if (matches) {
        const candidateIds = matches.map(m => m.candidate_id);
        const { data: candidateProfiles } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', candidateIds);

        if (candidateProfiles) {
          const candidatesWithMatches = matches.map(match => {
            const candidate = candidateProfiles.find(c => c.id === match.candidate_id);
            return {
              candidate: candidate!,
              match,
              score: match.compatibility_score,
            };
          }).filter(c => c.candidate);

          setCandidates(candidatesWithMatches);
          setFilteredCandidates(candidatesWithMatches);
        }
      }

      setLoadingCandidates(false);
    };

    fetchCandidates();
  }, [profile]);

  useEffect(() => {
    let filtered = [...candidates];

    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.candidate.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.candidate.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(c => c.candidate.role === filterRole);
    }

    setFilteredCandidates(filtered);
  }, [searchQuery, filterRole, candidates]);

  if (loading || !profile) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Candidats</h1>
          <p className="text-slate-600 mt-2">
            Découvrez les candidats correspondant à vos missions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recherche et filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un candidat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les profils</SelectItem>
                  <SelectItem value="candidate_graduate">Jeunes diplômés</SelectItem>
                  <SelectItem value="candidate_professional">Professionnels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {loadingCandidates ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Aucun candidat trouvé</p>
                <p>
                  {candidates.length === 0
                    ? 'Créez des missions pour commencer à recevoir des candidatures'
                    : 'Aucun résultat pour cette recherche'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCandidates.map(({ candidate, match, score }) => (
              <Card key={candidate.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {candidate.first_name} {candidate.last_name}
                          </CardTitle>
                          <CardDescription>
                            {candidate.role === 'candidate_graduate' ? 'Jeune diplômé' : 'Professionnel'}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{score}% compatible</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {candidate.email}
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center text-sm text-slate-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {candidate.phone}
                        </div>
                      )}
                    </div>

                    {match.match_reason && (
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-slate-900 mb-1">
                          Raison de la correspondance
                        </p>
                        <p className="text-sm text-slate-600">{match.match_reason}</p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm">Voir le profil complet</Button>
                      <Button size="sm" variant="outline">Contacter</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
