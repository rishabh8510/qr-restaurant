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
import { UtensilsCrossed, AlertCircle, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import logoImg from '@/assets/logo.jpeg';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (isLoading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/orders" replace />;

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/orders', { replace: true });
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
            <img src={logoImg} alt="Lotus Hut" className="h-full w-full object-cover" />
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

              <div className="w-full">
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register('password')}
                    className={`flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-10 py-2 text-sm shadow-2xs transition-colors placeholder:text-gray-400 focus-visible:border-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.password?.message ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password?.message && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

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

