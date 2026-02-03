'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

interface GraduateProfileFormProps {
  onSuccess?: () => void;
}

export default function GraduateProfileForm({ onSuccess }: GraduateProfileFormProps) {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    education_level: 'master',
    institution: '',
    graduation_year: new Date().getFullYear(),
    program_description: '',
    subjects_liked: '',
    thesis_title: '',
    thesis_problem: '',
    thesis_favorite_part: '',
    additional_info: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profile) return;

      const { data } = await supabase
        .from('graduate_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (data) {
        setFormData({
          education_level: data.education_level,
          institution: data.institution,
          graduation_year: data.graduation_year,
          program_description: data.program_description,
          subjects_liked: data.subjects_liked?.join(', ') || '',
          thesis_title: data.thesis_title || '',
          thesis_problem: data.thesis_problem || '',
          thesis_favorite_part: data.thesis_favorite_part || '',
          additional_info: data.additional_info || '',
        });
      }
    };

    fetchProfile();
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const subjects = formData.subjects_liked
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const profileData = {
        user_id: profile?.id,
        education_level: formData.education_level,
        institution: formData.institution,
        graduation_year: formData.graduation_year,
        program_description: formData.program_description,
        subjects_liked: subjects,
        thesis_title: formData.thesis_title,
        thesis_problem: formData.thesis_problem,
        thesis_favorite_part: formData.thesis_favorite_part,
        additional_info: formData.additional_info,
      };

      const { data: existing } = await supabase
        .from('graduate_profiles')
        .select('id')
        .eq('user_id', profile?.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('graduate_profiles')
          .update(profileData)
          .eq('user_id', profile?.id);
      } else {
        await supabase
          .from('graduate_profiles')
          .insert([profileData]);
      }

      await supabase
        .from('user_profiles')
        .update({ profile_completed: true })
        .eq('id', profile?.id);

      await refreshProfile();

      setAnalyzing(true);

      setTimeout(() => {
        setAnalyzing(false);
        onSuccess?.();
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Jeune Diplômé</CardTitle>
        <CardDescription>
          Partagez des informations sur votre formation pour que notre IA identifie les meilleures opportunités
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

          {analyzing && (
            <Alert className="border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <AlertDescription className="text-blue-800">
                Notre IA analyse votre profil...
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="education_level">Niveau d'études *</Label>
              <Select
                value={formData.education_level}
                onValueChange={(value) => setFormData({ ...formData, education_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="licence">Licence</SelectItem>
                  <SelectItem value="bachelor">Bachelor</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="mba">MBA</SelectItem>
                  <SelectItem value="doctorat">Doctorat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Établissement *</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="graduation_year">Année de diplomation *</Label>
            <Input
              id="graduation_year"
              type="number"
              min="1990"
              max="2030"
              value={formData.graduation_year}
              onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program_description">Description du programme *</Label>
            <Textarea
              id="program_description"
              value={formData.program_description}
              onChange={(e) => setFormData({ ...formData, program_description: e.target.value })}
              placeholder="Décrivez votre programme d'études, les matières principales, les compétences acquises..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjects_liked">Matières préférées *</Label>
            <Input
              id="subjects_liked"
              value={formData.subjects_liked}
              onChange={(e) => setFormData({ ...formData, subjects_liked: e.target.value })}
              placeholder="Comptabilité, Finance, Droit, Informatique (séparées par des virgules)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thesis_title">Titre du mémoire/projet</Label>
            <Input
              id="thesis_title"
              value={formData.thesis_title}
              onChange={(e) => setFormData({ ...formData, thesis_title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thesis_problem">Problématique du mémoire</Label>
            <Textarea
              id="thesis_problem"
              value={formData.thesis_problem}
              onChange={(e) => setFormData({ ...formData, thesis_problem: e.target.value })}
              placeholder="Quelle était la problématique principale de votre mémoire?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thesis_favorite_part">Partie préférée du traitement</Label>
            <Textarea
              id="thesis_favorite_part"
              value={formData.thesis_favorite_part}
              onChange={(e) => setFormData({ ...formData, thesis_favorite_part: e.target.value })}
              placeholder="Quelle partie de votre travail avez-vous le plus apprécié?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_info">Informations complémentaires</Label>
            <Textarea
              id="additional_info"
              value={formData.additional_info}
              onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
              placeholder="Stages, projets, compétences particulières..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={loading || analyzing}>
              {loading ? 'Enregistrement...' : analyzing ? 'Analyse en cours...' : 'Enregistrer et analyser'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
