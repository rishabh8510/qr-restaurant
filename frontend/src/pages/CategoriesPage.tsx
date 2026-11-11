import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import {
  useCategoriesList,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export function CategoriesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data, isLoading } = useCategoriesList({ limit: 100 });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    reset({ name: '', description: '', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setImageFile(null);
    reset({ name: cat.name, description: cat.description || '', isActive: cat.isActive });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setImageFile(null);
  };

  const onSubmit = (data: FormData) => {
    const form = new FormData();
    form.append('name', data.name);
    if (data.description) form.append('description', data.description);
    if (data.isActive !== undefined) form.append('isActive', String(data.isActive));
    if (imageFile) form.append('image', imageFile);

    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form }, { onSuccess: () => closeModal() });
    } else {
      createMutation.mutate(form, { onSuccess: () => closeModal() });
    }
  };

  if (isLoading) return <Loader />;
  const categories = data?.data || [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-gray-500">
            {isAdmin ? 'Manage menu categories' : 'View menu categories'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        )}
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories"
          description={isAdmin ? 'Create your first category' : 'No categories available'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="card">
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="mb-3 h-32 w-full rounded-lg object-cover"
                />
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{cat.description}</p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(cat)}
                      className="rounded p-1.5 text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <>
          <Modal
            open={modalOpen}
            onClose={closeModal}
            title={editing ? 'Edit Category' : 'Add Category'}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Name" {...register('name')} error={errors.name?.message} />
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={3} {...register('description')} />
              </div>
              <div>
                <label className="label">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={
                    isSubmitting || createMutation.isPending || updateMutation.isPending
                  }
                >
                  {editing ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Modal>
          <ConfirmDialog
            open={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={() =>
              deleteId &&
              deleteMutation.mutate(deleteId, {
                onSuccess: () => setDeleteId(null),
              })
            }
            title="Delete Category"
            message="Are you sure? This cannot be undone."
            loading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
}
