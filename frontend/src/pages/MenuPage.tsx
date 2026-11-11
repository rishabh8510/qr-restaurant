import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronRight, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category, SubCategory, Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import {
  useCategoriesList,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useSubCategoriesList,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
  useProductsList,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

type Level = 'categories' | 'subCategories' | 'items';

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

const subCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

const itemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  oldPrice: z.coerce.number().min(0).optional().or(z.literal('')),
  discount: z.string().optional(),
  weight: z.string().optional(),
  prepTime: z.string().optional(),
  tags: z.string().optional(),
  isVeg: z.boolean().optional(),
  isEgg: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;
type SubCategoryFormData = z.infer<typeof subCategorySchema>;
type ItemFormData = z.infer<typeof itemSchema>;

export function MenuPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [level, setLevel] = useState<Level>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: Level; id: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: catData, isLoading: catLoading } = useCategoriesList({ limit: 100 });
  const { data: subData, isLoading: subLoading } = useSubCategoriesList(
    selectedCategory ? { limit: 100, categoryId: selectedCategory.id } : undefined
  );
  // Load products under selected sub-category OR directly under selected category (no sub)
  const productQueryParams: Record<string, string | number> | undefined =
    selectedSubCategory
      ? { limit: 100, subCategoryId: selectedSubCategory.id }
      : selectedCategory && level === 'items'
        ? { limit: 100, categoryId: selectedCategory.id }
        : undefined;
  const { data: prodData, isLoading: prodLoading } = useProductsList(
    productQueryParams,
    { enabled: !!productQueryParams }
  );

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const createSubCategory = useCreateSubCategory();
  const updateSubCategory = useUpdateSubCategory();
  const deleteSubCategory = useDeleteSubCategory();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const catForm = useForm<CategoryFormData>({ resolver: zodResolver(categorySchema) });
  const subForm = useForm<SubCategoryFormData>({ resolver: zodResolver(subCategorySchema) });
  const itemForm = useForm<ItemFormData>({ resolver: zodResolver(itemSchema) });

  const openCreate = () => {
    setImageFile(null);
    setEditingCategory(null);
    setEditingSubCategory(null);
    setEditingProduct(null);
    if (level === 'categories') {
      catForm.reset({ name: '', slug: '', description: '', isActive: true });
    } else if (level === 'subCategories') {
      subForm.reset({ name: '', slug: '', description: '', isActive: true });
    } else {
      itemForm.reset({
        name: '',
        description: '',
        price: 0,
        oldPrice: '',
        discount: '',
        weight: '',
        prepTime: '',
        tags: '',
        isVeg: true,
        isEgg: false,
        isVegan: false,
        isAvailable: true,
        isActive: true,
        isNew: false,
        isBestseller: false,
      });
    }
    setModalOpen(true);
  };

  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setEditingSubCategory(null);
    setEditingProduct(null);
    setImageFile(null);
    catForm.reset({
      name: c.name,
      slug: c.slug || '',
      description: c.description || '',
      isActive: c.isActive,
    });
    setModalOpen(true);
  };

  const openEditSubCategory = (s: SubCategory) => {
    setEditingSubCategory(s);
    setEditingCategory(null);
    setEditingProduct(null);
    setImageFile(null);
    subForm.reset({
      name: s.name,
      slug: s.slug || '',
      description: s.description || '',
      isActive: s.isActive,
    });
    setModalOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditingCategory(null);
    setEditingSubCategory(null);
    setImageFile(null);
    itemForm.reset({
      name: p.name,
      description: p.description || '',
      price: Number(p.price),
      oldPrice: p.oldPrice != null ? Number(p.oldPrice) : '',
      discount: p.discount || '',
      weight: p.weight || '',
      prepTime: p.prepTime || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      isVeg: p.isVeg ?? true,
      isEgg: p.isEgg ?? false,
      isVegan: p.isVegan ?? false,
      isAvailable: p.isAvailable,
      isActive: p.isActive,
      isNew: p.isNew ?? false,
      isBestseller: p.isBestseller ?? false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setEditingSubCategory(null);
    setEditingProduct(null);
    setImageFile(null);
  };

  const onSubmitCategory = (data: CategoryFormData) => {
    const form = new FormData();
    form.append('name', data.name);
    if (data.slug) form.append('slug', data.slug);
    if (data.description) form.append('description', data.description);
    if (data.isActive !== undefined) form.append('isActive', String(data.isActive));
    if (imageFile) form.append('image', imageFile);

    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, data: form }, { onSuccess: () => closeModal() });
    } else {
      createCategory.mutate(form, { onSuccess: () => closeModal() });
    }
  };

  const onSubmitSubCategory = (data: SubCategoryFormData) => {
    if (!selectedCategory) return;
    const form = new FormData();
    form.append('name', data.name);
    form.append('categoryId', selectedCategory.id);
    if (data.slug) form.append('slug', data.slug);
    if (data.description) form.append('description', data.description);
    if (data.isActive !== undefined) form.append('isActive', String(data.isActive));
    if (imageFile) form.append('image', imageFile);

    if (editingSubCategory) {
      updateSubCategory.mutate(
        { id: editingSubCategory.id, data: form },
        { onSuccess: () => closeModal() }
      );
    } else {
      createSubCategory.mutate(form, { onSuccess: () => closeModal() });
    }
  };

  const onSubmitItem = (data: ItemFormData) => {
    // Allow items under category only OR under sub-category
    if (!selectedCategory && !selectedSubCategory) return;
    const form = new FormData();
    form.append('name', data.name);
    form.append('price', String(data.price));
    if (selectedSubCategory) {
      form.append('subCategoryId', selectedSubCategory.id);
    }
    if (selectedCategory) form.append('categoryId', selectedCategory.id);
    if (data.description) form.append('description', data.description);
    if (data.oldPrice !== undefined && data.oldPrice !== '') {
      form.append('oldPrice', String(data.oldPrice));
    }
    if (data.discount) form.append('discount', data.discount);
    if (data.weight) form.append('weight', data.weight);
    if (data.prepTime) form.append('prepTime', data.prepTime);
    if (data.tags) form.append('tags', data.tags);
    form.append('isVeg', String(!!data.isVeg));
    form.append('isEgg', String(!!data.isEgg));
    form.append('isVegan', String(!!data.isVegan));
    form.append('isAvailable', String(!!data.isAvailable));
    form.append('isActive', String(!!data.isActive));
    form.append('isNew', String(!!data.isNew));
    form.append('isBestseller', String(!!data.isBestseller));
    if (imageFile) form.append('image', imageFile);

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, data: form }, { onSuccess: () => closeModal() });
    } else {
      createProduct.mutate(form, { onSuccess: () => closeModal() });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    const onSuccess = () => setDeleteTarget(null);
    if (type === 'categories') deleteCategory.mutate(id, { onSuccess });
    else if (type === 'subCategories') deleteSubCategory.mutate(id, { onSuccess });
    else deleteProduct.mutate(id, { onSuccess });
  };

  const goToCategory = (c: Category) => {
    setSelectedCategory(c);
    setSelectedSubCategory(null);
    setLevel('subCategories');
  };

  const goToSubCategory = (s: SubCategory) => {
    setSelectedSubCategory(s);
    setLevel('items');
  };

  /** Open items that belong directly to the category (no sub-category) */
  const goToCategoryItems = () => {
    if (!selectedCategory) return;
    setSelectedSubCategory(null);
    setLevel('items');
  };

  const goBack = () => {
    if (level === 'items') {
      setSelectedSubCategory(null);
      setLevel('subCategories');
    } else if (level === 'subCategories') {
      setSelectedCategory(null);
      setLevel('categories');
    }
  };

  const isLoading =
    (level === 'categories' && catLoading) ||
    (level === 'subCategories' && subLoading) ||
    (level === 'items' && prodLoading);

  const categories = catData?.data || [];
  const subCategories = subData?.data || [];
  // When viewing category-level items (no sub selected), only show products without a sub-category
  const products = (prodData?.data || []).filter((p: Product) => {
    if (selectedSubCategory) return true;
    // category-level: only direct items
    return !p.subCategoryId;
  });

  const title =
    level === 'categories'
      ? 'Menu'
      : level === 'subCategories'
        ? selectedCategory?.name || 'Sub Categories'
        : selectedSubCategory?.name || (selectedCategory ? `${selectedCategory.name} Items` : 'Items');

  const subtitle =
    level === 'categories'
      ? isAdmin
        ? 'Category → (optional Sub-category) → Item. Items can sit under category or sub-category.'
        : 'Browse menu categories'
      : level === 'subCategories'
        ? isAdmin
          ? 'Manage sub-categories under this category'
          : 'Browse sub-categories'
        : isAdmin
          ? 'Manage items under this sub-category'
          : 'Browse items';

  const addLabel =
    level === 'categories' ? 'Add Category' : level === 'subCategories' ? 'Add Sub Category' : 'Add Item';

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {level !== 'categories' && (
            <button
              onClick={goBack}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span
                className={
                  level === 'categories'
                    ? 'font-medium text-gray-700'
                    : 'cursor-pointer hover:text-primary-600'
                }
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                  setLevel('categories');
                }}
              >
                Menu
              </span>
              {selectedCategory && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span
                    className={
                      level === 'subCategories'
                        ? 'font-medium text-gray-700'
                        : 'cursor-pointer hover:text-primary-600'
                    }
                    onClick={() => {
                      setSelectedSubCategory(null);
                      setLevel('subCategories');
                    }}
                  >
                    {selectedCategory.name}
                  </span>
                </>
              )}
              {selectedSubCategory && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="font-medium text-gray-700">{selectedSubCategory.name}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        {isAdmin && (
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> {addLabel}
          </Button>
        )}
      </div>

      {/* Categories */}
      {level === 'categories' &&
        (categories.length === 0 ? (
          <EmptyState
            title="No categories"
            description={
              isAdmin ? 'Create your first category (e.g. North Indian, Chinese)' : 'No categories available'
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                className="group cursor-pointer overflow-hidden border-gray-100 bg-white transition-all hover:shadow-md hover:border-gray-200"
                onClick={() => goToCategory(cat)}
              >
                {cat.image && (
                  <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {cat.name}
                      </h3>
                      {cat.slug && <p className="text-[11px] font-mono text-gray-400">/{cat.slug}</p>}
                      {cat.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">{cat.description}</p>
                      )}
                      <div className="mt-2.5">
                        <Badge variant={cat.isActive ? 'success' : 'outline'} className="text-[10px]">
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditCategory(cat)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTarget({ type: 'categories', id: cat.id })}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-2.5 text-xs font-bold text-primary-600">
                    <span>Manage sub-categories</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}

      {/* Sub-categories */}
      {level === 'subCategories' && (
        <div className="space-y-4">
          {/* Direct items under category (no sub-category required) */}
          <div
            className="card cursor-pointer border-2 border-dashed border-primary-200 bg-primary-50/50 transition hover:shadow-md"
            onClick={goToCategoryItems}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary-800">
                  Items under {selectedCategory?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Add dishes directly under this category (without a sub-category)
                </p>
              </div>
              <div className="flex items-center text-sm font-medium text-primary-600">
                Manage items <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {subCategories.length === 0 ? (
            <EmptyState
              title="No sub-categories"
              description={
                isAdmin
                  ? 'Optional: add sub-categories (e.g. Roti, Dal) or use the card above to add items directly under the category'
                  : 'No sub-categories available'
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subCategories.map((sub) => (
                <Card
                  key={sub.id}
                  className="group cursor-pointer overflow-hidden border-gray-100 bg-white transition-all hover:shadow-md hover:border-gray-200"
                  onClick={() => goToSubCategory(sub)}
                >
                  {sub.image && (
                    <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {sub.name}
                        </h3>
                        {sub.slug && <p className="text-[11px] font-mono text-gray-400">/{sub.slug}</p>}
                        {sub.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">{sub.description}</p>
                        )}
                        <div className="mt-2.5">
                          <Badge variant={sub.isActive ? 'success' : 'outline'} className="text-[10px]">
                            {sub.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditSubCategory(sub)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteTarget({ type: 'subCategories', id: sub.id })}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-2.5 text-xs font-bold text-primary-600">
                      <span>Open items</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Items */}
      {level === 'items' &&
        (products.length === 0 ? (
          <EmptyState
            title="No items"
            description={
              isAdmin
                ? selectedSubCategory
                  ? 'Add menu items under this sub-category'
                  : 'Add menu items directly under this category'
                : 'No items available'
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Card key={p.id} className="group overflow-hidden border-gray-100 bg-white transition-all hover:shadow-md">
                {p.image && (
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                    />
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="font-bold text-gray-900">{p.name}</h3>
                        {p.isVeg && (
                          <span className="rounded-sm border border-emerald-600 bg-white px-1 text-[9px] font-black text-emerald-700">
                            VEG
                          </span>
                        )}
                        {!p.isVeg && !p.isEgg && (
                          <span className="rounded-sm border border-red-600 bg-white px-1 text-[9px] font-black text-red-700">
                            NON-VEG
                          </span>
                        )}
                        {p.isEgg && (
                          <span className="rounded-sm border border-amber-600 bg-white px-1 text-[9px] font-black text-amber-700">
                            EGG
                          </span>
                        )}
                        {p.isBestseller && (
                          <Badge variant="warning" className="text-[10px] font-bold">
                            ★ Bestseller
                          </Badge>
                        )}
                      </div>
                      {p.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">{p.description}</p>
                      )}
                      <div className="mt-2.5 flex flex-wrap items-baseline gap-2">
                        <span className="text-lg font-black text-gray-900">₹{Number(p.price).toFixed(2)}</span>
                        {p.oldPrice != null && Number(p.oldPrice) > 0 && (
                          <span className="text-xs font-semibold text-gray-400 line-through">
                            ₹{Number(p.oldPrice).toFixed(2)}
                          </span>
                        )}
                        {p.discount && (
                          <span className="text-xs font-bold text-emerald-600">{p.discount}</span>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant={p.isAvailable ? 'success' : 'destructive'} className="text-[10px]">
                          {p.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                        <Badge variant={p.isActive ? 'outline' : 'secondary'} className="text-[10px]">
                          {p.isActive ? 'Active' : 'Hidden'}
                        </Badge>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex shrink-0 gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditProduct(p)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTarget({ type: 'items', id: p.id })}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}

      {isAdmin && (
        <>
          {/* Category modal */}
          <Modal
            open={modalOpen && level === 'categories'}
            onClose={closeModal}
            title={editingCategory ? 'Edit Category' : 'Add Category'}
          >
            <form onSubmit={catForm.handleSubmit(onSubmitCategory)} className="space-y-4">
              <Input
                label="Name"
                {...catForm.register('name')}
                error={catForm.formState.errors.name?.message}
              />
              <Input
                label="Slug (optional)"
                placeholder="north-indian"
                {...catForm.register('slug')}
              />
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={3} {...catForm.register('description')} />
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
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...catForm.register('isActive')} /> Active
              </label>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={
                    catForm.formState.isSubmitting ||
                    createCategory.isPending ||
                    updateCategory.isPending
                  }
                >
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Modal>

          {/* Sub-category modal */}
          <Modal
            open={modalOpen && level === 'subCategories'}
            onClose={closeModal}
            title={editingSubCategory ? 'Edit Sub Category' : 'Add Sub Category'}
          >
            <form onSubmit={subForm.handleSubmit(onSubmitSubCategory)} className="space-y-4">
              <Input
                label="Name"
                {...subForm.register('name')}
                error={subForm.formState.errors.name?.message}
              />
              <Input
                label="Slug (optional)"
                placeholder="roti"
                {...subForm.register('slug')}
              />
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={3} {...subForm.register('description')} />
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
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...subForm.register('isActive')} /> Active
              </label>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={
                    subForm.formState.isSubmitting ||
                    createSubCategory.isPending ||
                    updateSubCategory.isPending
                  }
                >
                  {editingSubCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Modal>

          {/* Item modal */}
          <Modal
            open={modalOpen && level === 'items'}
            onClose={closeModal}
            title={editingProduct ? 'Edit Item' : 'Add Item'}
            size="lg"
          >
            <form onSubmit={itemForm.handleSubmit(onSubmitItem)} className="space-y-4">
              <Input
                label="Name"
                {...itemForm.register('name')}
                error={itemForm.formState.errors.name?.message}
              />
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={2} {...itemForm.register('description')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Price (₹)"
                  type="number"
                  step="0.01"
                  {...itemForm.register('price')}
                  error={itemForm.formState.errors.price?.message}
                />
                <Input
                  label="Old Price (₹)"
                  type="number"
                  step="0.01"
                  placeholder="optional"
                  {...itemForm.register('oldPrice')}
                />
              </div>
              <Input
                label="Discount label"
                placeholder="e.g. 13% OFF"
                {...itemForm.register('discount')}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Weight / Qty"
                  placeholder="e.g. 1 piece, 250 ml"
                  {...itemForm.register('weight')}
                />
                <Input
                  label="Prep time"
                  placeholder="e.g. 15 min"
                  {...itemForm.register('prepTime')}
                />
              </div>
              <Input
                label="Tags (comma separated)"
                placeholder="Bestseller, Creamy, Spicy"
                {...itemForm.register('tags')}
              />
              <div>
                <label className="label">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...itemForm.register('isVeg')} /> Veg
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...itemForm.register('isEgg')} /> Egg
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...itemForm.register('isVegan')} /> Vegan
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...itemForm.register('isAvailable')} /> Available
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...itemForm.register('isActive')} /> Active
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...itemForm.register('isNew')} /> New
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...itemForm.register('isBestseller')} /> Bestseller
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={
                    itemForm.formState.isSubmitting ||
                    createProduct.isPending ||
                    updateProduct.isPending
                  }
                >
                  {editingProduct ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Modal>

          <ConfirmDialog
            open={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            title={
              deleteTarget?.type === 'categories'
                ? 'Delete Category'
                : deleteTarget?.type === 'subCategories'
                  ? 'Delete Sub Category'
                  : 'Delete Item'
            }
            message="Are you sure? This cannot be undone."
            loading={
              deleteCategory.isPending || deleteSubCategory.isPending || deleteProduct.isPending
            }
          />
        </>
      )}
    </div>
  );
}
