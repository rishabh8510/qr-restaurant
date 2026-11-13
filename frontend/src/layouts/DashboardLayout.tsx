import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingBag,
  UtensilsCrossed,
  Percent,
  ImageIcon,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  QrCode,
  Clock,
  CircleDot,
  Coffee,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logoImg from '@/assets/logo.jpeg';
import clsx from 'clsx';

const adminNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Live Orders', icon: ShoppingBag, badge: 'LIVE' },
  { to: '/tables', label: 'QR & Standees', icon: QrCode },
  { to: '/menu', label: 'Menu & Dishes', icon: UtensilsCrossed },
  { to: '/restaurant', label: 'Restaurant Info', icon: Store },
  { to: '/staff', label: 'Staff Accounts', icon: Users },
  { to: '/offers', label: 'Discounts & Offers', icon: Percent },
  { to: '/banners', label: 'Banners', icon: ImageIcon },
  { to: '/dish-of-the-day', label: 'Dish of Day', icon: Sparkles },
  { to: '/settings', label: 'POS Settings', icon: Settings },
];

const staffNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Live Orders', icon: ShoppingBag, badge: 'LIVE' },
  { to: '/tables', label: 'QR & Standees', icon: QrCode },
  { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/offers', label: 'Offers', icon: Percent },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const tick = () => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const nav = user?.role === 'admin' ? adminNav : staffNav;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentNav = nav.find((n) => location.pathname.startsWith(n.to));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Obsidian Slate Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0B0F19] text-white shadow-2xl transition-transform duration-200 ease-out border-r border-slate-800/60',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-slate-800/80 px-5">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Lotus Hut"
              className="h-10 w-10 shrink-0 rounded-full object-cover shadow-md shadow-red-950/40 ring-2 ring-red-500/40"
            />
            <div>
              <p className="text-sm font-black tracking-tight text-white leading-none">
                LOTUS HUT
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE · LIVE</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Navigation
          </p>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150',
                  isActive
                    ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                )
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black tracking-wider text-emerald-400">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Footer Card */}
        <div className="shrink-0 border-t border-slate-800/80 p-3">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-900/90 p-3 ring-1 ring-slate-800">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-xs font-black text-amber-400 ring-1 ring-amber-400/30">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{user?.name}</p>
              <p className="truncate text-[10px] capitalize text-slate-400">{user?.role} Account</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-500/20 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 flex h-18 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md lg:px-8 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Management Console
              </p>
              <h2 className="text-base font-black text-slate-900">
                {currentNav?.label || 'Overview'}
              </h2>
            </div>
          </div>

          {/* Right Header: Live Kitchen Clock & User */}
          <div className="flex items-center gap-4">
            {/* Live Clock */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span className="tabular-nums tracking-widest">{currentTime}</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-xs font-black text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-bold">{user?.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-2xl">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500">{user?.email}</p>
                      <span className="mt-1.5 inline-block rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900 ring-1 ring-amber-200">
                        {user?.role}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
