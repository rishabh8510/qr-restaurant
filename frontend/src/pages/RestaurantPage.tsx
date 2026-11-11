import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant, useUpdateRestaurant } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { Store, Upload, CheckCircle2, ShieldAlert } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export function RestaurantPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data, isLoading } = useRestaurant();
  const mutation = useUpdateRestaurant();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (data?.data) {
      const r = data.data;
      reset({
        name: r.name,
        description: r.description || '',
        address: r.address || '',
        phone: r.phone || '',
        email: r.email || '',
      });
      if (r.logo) setPreviewUrl(r.logo);
    }
  }, [data, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = (formData: FormData) => {
    const form = new FormData();
    form.append('name', formData.name);
    if (formData.description) form.append('description', formData.description);
    if (formData.address) form.append('address', formData.address);
    if (formData.phone) form.append('phone', formData.phone);
    if (formData.email) form.append('email', formData.email);
    if (logoFile) form.append('logo', logoFile);

    mutation.mutate(form, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      },
    });
  };

  if (isLoading) return <Loader />;
  const restaurant = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Restaurant Profile</h1>
        <p className="text-xs font-medium text-gray-500">
          {isAdmin ? 'Manage your restaurant branding, contact details, and address' : 'View restaurant profile'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Logo / Branding Card */}
        <Card className="lg:col-span-1 border-gray-100 bg-white">
          <CardHeader>
            <CardTitle className="text-base">Brand Identity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
              {previewUrl ? (
                <img src={previewUrl} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <Store className="h-10 w-10 text-gray-300" />
              )}
            </div>

            {isAdmin && (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-2xs transition hover:bg-gray-50">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Logo</span>
                </span>
              </label>
            )}

            <p className="mt-3 text-[11px] text-gray-400">
              Recommended: 400×400px square image in PNG or JPG.
            </p>
          </CardContent>
        </Card>

        {/* Details Form Card */}
        <Card className="lg:col-span-2 border-gray-100 bg-white">
          <CardHeader>
            <CardTitle className="text-base">General Information</CardTitle>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Restaurant profile saved successfully!</span>
              </div>
            )}

            {isAdmin ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Restaurant / Cafe Name"
                  placeholder="e.g. Blue Tokai Coffee"
                  {...register('name')}
                  error={errors.name?.message}
                />

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    About / Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of your cafe or cuisine..."
                    className="flex w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-2xs transition placeholder:text-gray-400 focus-visible:border-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900"
                    {...register('description')}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Contact Phone"
                    placeholder="+91 98765 43210"
                    {...register('phone')}
                  />
                  <Input
                    label="Official Email"
                    type="email"
                    placeholder="contact@cafe.com"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>

                <Input
                  label="Physical Address"
                  placeholder="123 Coffee Lane, Indiranagar, Bengaluru"
                  {...register('address')}
                />

                <div className="flex justify-end pt-3">
                  <Button
                    type="submit"
                    variant="default"
                    className="bg-gray-900 text-white hover:bg-black font-bold px-6"
                    loading={isSubmitting || mutation.isPending}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Name</p>
                  <p className="font-bold text-gray-900">{restaurant?.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Address</p>
                  <p className="text-gray-700">{restaurant?.address || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Phone</p>
                  <p className="text-gray-700">{restaurant?.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</p>
                  <p className="text-gray-700">{restaurant?.email || '—'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
