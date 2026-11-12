import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Loader';
import { Card, CardContent } from '@/components/ui/Card';
import { UtensilsCrossed, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (isLoading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Invalid credentials. Please verify your email and password.';
      setError(msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full overflow-hidden shadow-lg ring-4 ring-red-100">
            <img src="/logo.jpeg" alt="Lotus Hut" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Lotus Hut</h1>
          <p className="mt-1 text-xs font-semibold text-gray-500">
            Admin &amp; Kitchen Management System
          </p>
        </div>

        {/* Card */}
        <Card className="border border-gray-100 bg-white shadow-xl">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">Sign in to your account</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Enter your staff or admin credentials to continue
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 ring-1 ring-red-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                id="email"
                placeholder="admin@restaurant.com"
                autoComplete="email"
                {...register('email')}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                id="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
                error={errors.password?.message}
              />

              <Button
                type="submit"
                variant="default"
                className="mt-2 w-full gap-2 bg-gray-900 text-white shadow-md hover:bg-black"
                loading={isSubmitting}
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer security badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Encrypted Enterprise Session</span>
        </div>
      </div>
    </div>
  );
}
