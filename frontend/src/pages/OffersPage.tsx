import { useState } from 'react';
import { Plus, Pencil, Trash2, Tag, Percent, Gift, Calendar, ArrowUpRight } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Offer } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import {
  useOffersList,
  useCreateOffer,
  useUpdateOffer,
  useDeleteOffer,
  useCategoriesList,
  useProductsList,
} from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce.number().min(0, 'Discount must be positive'),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
  isActive: z.boolean().optional(),
  offerKind: z.enum(['menu', 'loyalty']),
  applicableTo: z.enum(['all', 'products', 'categories']).optional(),
  minOrderCount: z.coerce.number().int().min(1).optional().nullable(),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

export function OffersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data, isLoading } = useOffersList({ limit: 50 });
  const { data: catData } = useCategoriesList({ limit: 100 });
  const { data: prodData } = useProductsList({ limit: 200 });
  const createMutation = useCreateOffer();
  const updateMutation = useUpdateOffer();
  const deleteMutation = useDeleteOffer();

  const categories = catData?.data ?? [];
  const products = prodData?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      offerKind: 'menu',
      applicableTo: 'all',
      productIds: [],
      categoryIds: [],
    },
  });

  const offerKind = watch('offerKind');
  const applicableTo = watch('applicableTo');

  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    const today = new Date().toISOString().slice(0, 16);
    reset({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      startDate: today,
      endDate: today,
      isActive: true,
      offerKind: 'menu',
      applicableTo: 'all',
      minOrderCount: 5,
      productIds: [],
      categoryIds: [],
    });
    setModalOpen(true);
  };

  const openEdit = (o: Offer) => {
    setEditing(o);
    setImageFile(null);
    reset({
      title: o.title,
      description: o.description || '',
      discountType: o.discountType,
      discountValue: Number(o.discountValue),
      startDate: o.startDate?.slice(0, 16) || '',
      endDate: o.endDate?.slice(0, 16) || '',
      isActive: o.isActive,
      offerKind: o.offerKind || 'menu',
      applicableTo: o.applicableTo || 'all',
      minOrderCount: o.minOrderCount || null,
      productIds: o.productIds || [],
      categoryIds: o.categoryIds || [],
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setImageFile(null);
  };

  const onSubmit = (formData: FormData) => {
    const form = new FormData();
    form.append('title', formData.title);
    form.append('discountType', formData.discountType);
    form.append('discountValue', String(formData.discountValue));
    form.append('startDate', formData.startDate);
    form.append('endDate', formData.endDate);
    form.append('offerKind', formData.offerKind);
    if (formData.description) form.append('description', formData.description);
    if (formData.isActive !== undefined) form.append('isActive', String(formData.isActive));
    if (formData.offerKind === 'loyalty') {
      if (formData.minOrderCount != null) {
        form.append('minOrderCount', String(formData.minOrderCount));
      }
    } else {
      if (formData.applicableTo) form.append('applicableTo', formData.applicableTo);
      if (formData.applicableTo === 'categories' && formData.categoryIds?.length) {
        form.append('categoryIds', JSON.stringify(formData.categoryIds));
      }
      if (formData.applicableTo === 'products' && formData.productIds?.length) {
        form.append('productIds', JSON.stringify(formData.productIds));
      }
    }
    if (imageFile) form.append('image', imageFile);

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data: form },
        { onSuccess: () => closeModal() }
      );
    } else {
      createMutation.mutate(form, { onSuccess: () => closeModal() });
    }
  };

  if (isLoading) return <Loader />;
  const offers = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Discounts &amp; Loyalty Offers</h1>
          <p className="text-xs font-medium text-gray-500">
            Create automated menu item discounts and customer loyalty order rewards
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={openCreate}
            variant="default"
            className="gap-2 bg-gray-900 text-white hover:bg-black font-bold"
          >
            <Plus className="h-4 w-4" />
            <span>Create Offer</span>
          </Button>
        )}
      </div>

      {offers.length === 0 ? (
        <EmptyState
          title="No offers active yet"
          description="Create your first discount offer or milestone loyalty reward for returning customers."
          action={
            isAdmin ? (
              <Button onClick={openCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Create Offer</span>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o) => (
            <Card
              key={o.id}
              className="flex flex-col justify-between overflow-hidden border-gray-100 bg-white transition-all hover:shadow-md"
            >
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={o.isActive ? 'success' : 'outline'} className="text-[10px]">
                    {o.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {o.offerKind === 'loyalty' ? 'Loyalty Reward' : 'Menu Discount'}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-black tracking-tight text-gray-900">{o.title}</h3>
                  {o.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{o.description}</p>
                  )}
                </div>

                <div className="my-4 rounded-xl bg-gray-50/80 p-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-gray-500">Discount Rate</span>
                    <span className="text-xl font-black text-emerald-600">
                      {o.discountType === 'percentage'
                        ? `${o.discountValue}% OFF`
                        : `₹${o.discountValue} OFF`}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {o.offerKind === 'loyalty'
                      ? `Applied on customer's order #${o.minOrderCount}`
                      : `Applied to ${o.applicableTo || 'all'} menu items`}
                  </p>
                </div>

                {/* Actions */}
                {isAdmin && (
                  <div className="mt-auto flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEdit(o)}
                      className="h-8 px-2.5 text-xs text-gray-600 hover:text-gray-900"
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteId(o.id)}
                      className="h-8 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isAdmin && (
        <>
          <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Edit Offer' : 'Create Offer'}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Offer Title"
                placeholder="e.g. 20% Happy Hours / 5th Order Freebie"
                {...register('title')}
                error={errors.title?.message}
              />

              <Input
                label="Offer Description"
                placeholder="Short description for the menu"
                {...register('description')}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Offer Kind
                  </label>
                  <select
                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-900 shadow-2xs outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    {...register('offerKind')}
                  >
                    <option value="menu">Menu Discount (Applicable directly to items)</option>
                    <option value="loyalty">Loyalty (Reward on Nth order)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Discount Type
                  </label>
                  <select
                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-900 shadow-2xs outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    {...register('discountType')}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>

              <Input
                label="Discount Value"
                type="number"
                step="0.01"
                placeholder="15"
                {...register('discountValue')}
                error={errors.discountValue?.message}
              />

              {offerKind === 'loyalty' && (
                <Input
                  label="Target Order Count (e.g. 5 = applies on 5th order)"
                  type="number"
                  min={1}
                  {...register('minOrderCount')}
                  error={errors.minOrderCount?.message}
                />
              )}

              {offerKind === 'menu' && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Applies To
                  </label>
                  <select
                    className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-900 shadow-2xs outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    {...register('applicableTo')}
                  >
                    <option value="all">Entire Menu</option>
                    <option value="categories">Specific Categories</option>
                    <option value="products">Specific Products</option>
                  </select>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Valid From"
                  type="datetime-local"
                  {...register('startDate')}
                  error={errors.startDate?.message}
                />
                <Input
                  label="Valid Until"
                  type="datetime-local"
                  {...register('endDate')}
                  error={errors.endDate?.message}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-gray-700">
                  Enable and publish this offer immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="bg-gray-900 text-white hover:bg-black font-bold"
                  loading={isSubmitting || createMutation.isPending || updateMutation.isPending}
                >
                  {editing ? 'Update Offer' : 'Save Offer'}
                </Button>
              </div>
            </form>
          </Modal>

          <ConfirmDialog
            open={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={() =>
              deleteId &&
              deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
            }
            title="Delete Offer"
            message="Are you sure you want to delete this offer? Active orders will no longer receive this discount."
            loading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
}
