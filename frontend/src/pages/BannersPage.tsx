import { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type Banner = {
  id: string;
  image: string;
  title: string | null;
  isActive: boolean;
};

export function BannersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: () => api.get<{ success: boolean; data: Banner[] }>('/banners').then((r) => r.data),
  });

  const createMut = useMutation({
    mutationFn: (form: FormData) =>
      api.post('/banners', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] });
      setOpen(false);
      setFile(null);
      setTitle('');
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/banners/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] });
      setDeleteId(null);
    },
  });

  if (isLoading) return <Loader />;
  const banners = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Promotional Banners</h1>
          <p className="text-xs font-medium text-gray-500">
            Showcase special seasonal announcements and deals on the customer app
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setOpen(true)}
            variant="default"
            className="gap-2 bg-gray-900 text-white hover:bg-black font-bold"
          >
            <Plus className="h-4 w-4" />
            <span>Add Banner</span>
          </Button>
        )}
      </div>

      {banners.length === 0 ? (
        <EmptyState
          title="No banners uploaded yet"
          description="Add your first promotional carousel banner to display on the menu page."
          action={
            isAdmin ? (
              <Button onClick={() => setOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Upload Banner</span>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((b) => (
            <Card
              key={b.id}
              className="group overflow-hidden border-gray-100 bg-white transition-all hover:shadow-md"
            >
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <img
                  src={b.image}
                  alt={b.title || 'Banner'}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                />
              </div>
              <CardContent className="flex items-center justify-between p-4">
                <span className="truncate text-sm font-bold text-gray-900">
                  {b.title || 'Promotional Banner'}
                </span>
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteId(b.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                    title="Delete banner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isAdmin && (
        <>
          <Modal open={open} onClose={() => setOpen(false)} title="Upload Promo Banner">
            <div className="space-y-4">
              <Input
                label="Banner Headline (Optional)"
                placeholder="e.g. 20% Off Weekend Special"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Banner Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="flex w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-black cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="bg-gray-900 text-white hover:bg-black font-bold"
                  loading={createMut.isPending}
                  disabled={!file}
                  onClick={() => {
                    if (!file) return;
                    const form = new FormData();
                    form.append('image', file);
                    if (title) form.append('title', title);
                    form.append('isActive', 'true');
                    createMut.mutate(form);
                  }}
                >
                  Upload &amp; Publish
                </Button>
              </div>
            </div>
          </Modal>

          <ConfirmDialog
            open={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={() => deleteId && deleteMut.mutate(deleteId)}
            title="Delete Banner"
            message="Are you sure you want to remove this banner from the customer website?"
            loading={deleteMut.isPending}
            confirmText="Delete"
          />
        </>
      )}
    </div>
  );
}
