'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Upload } from 'lucide-react';

interface ProfessionalProfileFormProps {
  onSuccess?: () => void;
}

export default function ProfessionalProfileForm({ onSuccess }: ProfessionalProfileFormProps) {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    years_experience: 0,
    current_position: '',
    best_skills: '',
    passion_description: '',
    preferred_work_environment: '',
    additional_info: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profile) return;

      const { data } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (data) {
        setFormData({
          years_experience: data.years_experience,
          current_position: data.current_position || '',
          best_skills: data.best_skills,
          passion_description: data.passion_description || '',
          preferred_work_environment: data.preferred_work_environment || '',
          additional_info: data.additional_info || '',
        });
      }
    };

    fetchProfile();
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier ne doit pas dépasser 10 Mo');
        return;
      }
      setCvFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let cvUrl = '';

      if (cvFile) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${profile?.id}_${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(fileName, cvFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('cvs')
          .getPublicUrl(fileName);

        cvUrl = publicUrl;
      }

      const { data: existing } = await supabase
        .from('professional_profiles')
        .select('id, cv_url')
        .eq('user_id', profile?.id)
        .maybeSingle();

      const profileData = {
        user_id: profile?.id,
        years_experience: formData.years_experience,
        current_position: formData.current_position,
        cv_url: cvUrl || existing?.cv_url || '',
        best_skills: formData.best_skills,
        passion_description: formData.passion_description,
        preferred_work_environment: formData.preferred_work_environment,
        additional_info: formData.additional_info,
      };

      if (existing) {
        await supabase
          .from('professional_profiles')
          .update(profileData)
          .eq('user_id', profile?.id);
      } else {
        await supabase
          .from('professional_profiles')
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
        <CardTitle>Profil Professionnel</CardTitle>
        <CardDescription>
          Partagez votre expérience et vos compétences pour que notre IA trouve les missions qui vous correspondent
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
                Notre IA analyse votre profil et votre CV...
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="years_experience">Années d'expérience *</Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                max="50"
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_position">Poste actuel</Label>
              <Input
                id="current_position"
                value={formData.current_position}
                onChange={(e) => setFormData({ ...formData, current_position: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cv_file">Télécharger votre CV * (PDF, Word - Max 10 Mo)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="cv_file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <Button type="button" variant="outline" size="icon" disabled>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {cvFile && (
              <p className="text-sm text-muted-foreground">
                Fichier sélectionné: {cvFile.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="best_skills">Ce que vous savez le mieux faire *</Label>
            <Textarea
              id="best_skills"
              value={formData.best_skills}
              onChange={(e) => setFormData({ ...formData, best_skills: e.target.value })}
              placeholder="Décrivez vos principales compétences et expertises..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passion_description">Vos passions professionnelles</Label>
            <Textarea
              id="passion_description"
              value={formData.passion_description}
              onChange={(e) => setFormData({ ...formData, passion_description: e.target.value })}
              placeholder="Qu'est-ce qui vous passionne dans votre travail? Qu'aimez-vous particulièrement faire?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_work_environment">Environnement de travail préféré</Label>
            <Textarea
              id="preferred_work_environment"
              value={formData.preferred_work_environment}
              onChange={(e) => setFormData({ ...formData, preferred_work_environment: e.target.value })}
              placeholder="Décrivez l'atmosphère et le type de travail que vous appréciez..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_info">Informations complémentaires</Label>
            <Textarea
              id="additional_info"
              value={formData.additional_info}
              onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
              placeholder="Certifications, projets remarquables, compétences spécifiques..."
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
