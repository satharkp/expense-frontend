import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  LogOut,
  PieChart
} from 'lucide-react';
import { cn } from '../lib/utils';
import LogoutButton from './LogoutButton';

const NavItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
      active
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
    )}
  >
    <Icon className="h-5 w-5" />
    {label}
  </Link>
);

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/categories', label: 'Categories', icon: PieChart },
    { to: '/income', label: 'Income', icon: TrendingUp },
    { to: '/expenses', label: 'Expenses', icon: TrendingDown },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 lg:flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 flex-col border-r border-neutral-200 bg-white lg:flex sticky top-0 h-screen overflow-y-auto">
        <div className="flex h-16 items-center px-6 shrink-0">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Wallet className="h-6 w-6" />
            <span>FinTrack</span>
          </Link>
        </div>
        <div className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              active={location.pathname === item.to}
            />
          ))}
        </div>
        <div className="p-4 border-t border-neutral-100 shrink-0">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer">
            <LogoutButton customClass="w-full flex items-center gap-3 text-inherit hover:text-inherit" icon={<LogOut className="h-5 w-5" />} />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <Wallet className="h-5 w-5" />
            <span>FinTrack</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-600"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-b border-neutral-200 bg-white px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                {...item}
                active={location.pathname === item.to}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
            <div className="pt-3 mt-3 border-t border-neutral-100 text-danger hover:text-red-700 font-medium">
              <LogoutButton customClass="flex items-center gap-3 text-inherit hover:text-inherit" icon={<LogOut className="h-5 w-5" />} />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-4 md:p-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
