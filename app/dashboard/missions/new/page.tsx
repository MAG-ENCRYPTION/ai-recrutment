'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, AuditActivity } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';

export default function NewMissionPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activities, setActivities] = useState<AuditActivity[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    selectedActivities: [] as string[],
    keywords: '',
    location: '',
    contract_type: '',
    salary_range: '',
  });

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/login');
    }

    if (profile && profile.role !== 'recruiter' && profile.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [profile, loading, router]);

  useEffect(() => {
    const fetchActivities = async () => {
      const { data } = await supabase
        .from('audit_activities')
        .select('*')
        .order('category', { ascending: true });

      if (data) {
        setActivities(data);
      }
    };

    fetchActivities();
  }, []);

  const handleActivityToggle = (activityId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(activityId)
        ? prev.selectedActivities.filter(id => id !== activityId)
        : [...prev.selectedActivities, activityId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const keywords = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const { error: insertError } = await supabase
        .from('missions')
        .insert([
          {
            recruiter_id: profile?.id,
            title: formData.title,
            description: formData.description,
            requirements: formData.requirements,
            activities: formData.selectedActivities,
            keywords,
            location: formData.location,
            contract_type: formData.contract_type,
            salary_range: formData.salary_range,
            is_active: true,
          },
        ]);

      if (insertError) throw insertError;

      router.push('/dashboard/missions');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la mission');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !profile) {
    return null;
  }

  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, AuditActivity[]>);

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nouvelle Mission</h1>
          <p className="text-slate-600 mt-2">
            Créez une nouvelle mission pour attirer les meilleurs candidats
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Détails de la mission</CardTitle>
            <CardDescription>
              Complétez les informations pour publier votre mission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Titre de la mission *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Auditeur Junior en Comptabilité"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez la mission, les responsabilités, l'environnement de travail..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Exigences</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Compétences requises, expérience, diplômes..."
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <Label>Activités d'audit associées</Label>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez les activités qui correspondent à cette mission
                </p>
                {Object.entries(groupedActivities).map(([category, categoryActivities]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-700">{category}</h4>
                    <div className="space-y-2 pl-4">
                      {categoryActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={activity.id}
                            checked={formData.selectedActivities.includes(activity.id)}
                            onCheckedChange={() => handleActivityToggle(activity.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={activity.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {activity.name}
                            </label>
                            {activity.description && (
                              <p className="text-sm text-muted-foreground">
                                {activity.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Mots-clés</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="Comptabilité, Finance, Audit, etc. (séparés par des virgules)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Paris, Lyon, Remote..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contract_type">Type de contrat</Label>
                  <Input
                    id="contract_type"
                    value={formData.contract_type}
                    onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                    placeholder="CDI, CDD, Stage..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range">Fourchette salariale</Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  placeholder="35-45K €/an"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/missions')}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Publication...' : 'Publier la mission'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
