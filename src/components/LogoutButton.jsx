import { LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LogoutButton({ className, icon, children }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className={cn("flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors", className)}
    >
      {icon || <LogOut className="h-4 w-4" />}
      {children || "Logout"}
    </button>
  );
}