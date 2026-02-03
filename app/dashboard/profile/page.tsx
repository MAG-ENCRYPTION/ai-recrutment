'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import GraduateProfileForm from '@/components/forms/GraduateProfileForm';
import ProfessionalProfileForm from '@/components/forms/ProfessionalProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/login');
    }
  }, [profile, loading, router]);

  if (loading || !profile) {
    return null;
  }

  if (profile.role === 'recruiter' || profile.role === 'admin') {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>Paramètres du profil</CardTitle>
            <CardDescription>
              Gérez les informations de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom complet</label>
                <p className="text-sm text-muted-foreground">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
              {profile.company_name && (
                <div>
                  <label className="text-sm font-medium">Cabinet</label>
                  <p className="text-sm text-muted-foreground">{profile.company_name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {showSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Votre profil a été mis à jour avec succès!
            </AlertDescription>
          </Alert>
        )}

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mon Profil</h1>
          <p className="text-slate-600 mt-2">
            Complétez vos informations pour que notre IA analyse votre profil
          </p>
        </div>

        {profile.role === 'candidate_graduate' ? (
          <GraduateProfileForm onSuccess={handleSuccess} />
        ) : (
          <ProfessionalProfileForm onSuccess={handleSuccess} />
        )}
      </div>
    </DashboardLayout>
  );
}
