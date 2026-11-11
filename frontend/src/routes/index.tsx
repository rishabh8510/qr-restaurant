import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { StaffPage } from '@/pages/StaffPage';
import { MenuPage } from '@/pages/MenuPage';
import { OffersPage } from '@/pages/OffersPage';
import { RestaurantPage } from '@/pages/RestaurantPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { BannersPage } from '@/pages/BannersPage';
import { DishOfTheDayPage } from '@/pages/DishOfTheDayPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { TablesPage } from '@/pages/TablesPage';

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/restaurant" element={<RestaurantPage />} />
            <Route
              path="/staff"
              element={
                <ProtectedRoute roles={['admin']}>
                  <StaffPage />
                </ProtectedRoute>
              }
            />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/banners" element={<BannersPage />} />
            <Route path="/dish-of-the-day" element={<DishOfTheDayPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
