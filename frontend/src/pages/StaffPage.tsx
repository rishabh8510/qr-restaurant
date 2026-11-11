import { useState } from 'react';
import { Plus, Pencil, Trash2, Power, UserCheck, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@/types';
import {
  useStaffList,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
  useToggleStaffStatus,
} from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Minimum 8 characters').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export function StaffPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useStaffList({ limit: 50 });
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deleteMutation = useDeleteStaff();
  const toggleMutation = useToggleStaffStatus();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', email: '', phone: '', password: '' });
    setModalOpen(true);
  };

  const openEdit = (staff: User) => {
    setEditing(staff);
    reset({ name: staff.name, email: staff.email, phone: staff.phone || '', password: '' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const onSubmit = (data: FormData) => {
    if (editing) {
      const payload: Record<string, unknown> = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
      };
      if (data.password) payload.password = data.password;
      updateMutation.mutate(
        { id: editing.id, data: payload },
        { onSuccess: () => closeModal() }
      );
    } else {
      createMutation.mutate(
        { ...data, password: data.password || 'Staff@123456' },
        { onSuccess: () => closeModal() }
      );
    }
  };

  if (isLoading) return <Loader />;

  const staff = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Staff Management</h1>
          <p className="text-xs font-medium text-gray-500">
            Create, manage, and monitor restaurant and kitchen staff accounts
          </p>
        </div>
        <Button onClick={openCreate} variant="default" className="gap-2 bg-gray-900 text-white hover:bg-black font-bold">
          <Plus className="h-4 w-4" />
          <span>Add Staff Member</span>
        </Button>
      </div>

      {staff.length === 0 ? (
        <EmptyState
          title="No staff members yet"
          description="Create your first staff member to assign kitchen orders and manage tables."
          action={<Button onClick={openCreate}>Add Staff</Button>}
        />
      ) : (
        <Card className="overflow-hidden border-gray-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3.5">Staff Member</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staff.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-700">
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-medium text-gray-600">
                      {s.phone || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline" className="gap-1 capitalize text-xs">
                        <Shield className="h-3 w-3 text-gray-500" />
                        <span>{s.role}</span>
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={s.isActive ? 'success' : 'outline'}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(s)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
                          title="Edit staff details"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleMutation.mutate(s.id)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
                          title="Toggle active status"
                        >
                          <Power className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(s.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                          title="Delete staff"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Edit Staff Member' : 'Add New Staff'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" placeholder="e.g. John Doe" {...register('name')} error={errors.name?.message} />
          <Input label="Email Address" type="email" placeholder="john@restaurant.com" {...register('email')} error={errors.email?.message} />
          <Input label="Phone Number" placeholder="+91 9876543210" {...register('phone')} />
          <Input
            label={editing ? 'New Password (leave empty to retain current)' : 'Account Password'}
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
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
              {editing ? 'Update Staff' : 'Create Account'}
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
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? They will immediately lose access to the system."
        loading={deleteMutation.isPending}
        confirmText="Delete Staff"
      />
    </div>
  );
}
