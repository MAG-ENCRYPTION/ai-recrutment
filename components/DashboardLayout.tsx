'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Briefcase,
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  User,
  Building,
  Shield,
  Menu,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/dashboard',
      icon: Home,
      roles: ['candidate_graduate', 'candidate_professional', 'recruiter', 'admin'],
    },
    {
      name: 'Mon Profil',
      href: '/dashboard/profile',
      icon: User,
      roles: ['candidate_graduate', 'candidate_professional'],
    },
    {
      name: 'Mes Candidatures',
      href: '/dashboard/applications',
      icon: FileText,
      roles: ['candidate_graduate', 'candidate_professional'],
    },
    {
      name: 'Missions',
      href: '/dashboard/missions',
      icon: Building,
      roles: ['recruiter'],
    },
    {
      name: 'Candidats',
      href: '/dashboard/candidates',
      icon: Users,
      roles: ['recruiter'],
    },
    {
      name: 'Administration',
      href: '/dashboard/admin',
      icon: Shield,
      roles: ['admin'],
    },
  ];

  const filteredNavigation = navigation.filter(
    (item) => profile && item.roles.includes(profile.role)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <div className="bg-slate-900 p-2 rounded-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-slate-900">
                  Audit Recrutement
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <span className="hidden md:block">
                      {profile?.first_name} {profile?.last_name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
