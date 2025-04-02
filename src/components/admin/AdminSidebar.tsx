
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  Users, 
  CalendarDays, 
  CreditCard, 
  Home, 
  Settings, 
  BadgePercent, 
  LogOut, 
  LayoutDashboard, 
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="md:hidden absolute top-4 left-4 z-50">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-indigo-900 text-white transform transition-transform duration-200 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-950">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)] p-4">
          <div className="flex-1 space-y-2">
            <NavItem 
              to="/admin/dashboard" 
              icon={<LayoutDashboard className="h-5 w-5" />} 
              label="Dashboard" 
              isActive={isActive("/admin/dashboard")} 
            />
            <NavItem 
              to="/admin/users" 
              icon={<Users className="h-5 w-5" />} 
              label="User Management" 
              isActive={isActive("/admin/users")} 
            />
            <NavItem 
              to="/admin/events" 
              icon={<CalendarDays className="h-5 w-5" />} 
              label="Event Management" 
              isActive={isActive("/admin/events")} 
            />
            <NavItem 
              to="/admin/payments" 
              icon={<CreditCard className="h-5 w-5" />} 
              label="Payment Management" 
              isActive={isActive("/admin/payments")} 
            />
            <NavItem 
              to="/admin/coupons" 
              icon={<BadgePercent className="h-5 w-5" />} 
              label="Coupons & Offers" 
              isActive={isActive("/admin/coupons")} 
            />
            <NavItem 
              to="/admin/settings" 
              icon={<Settings className="h-5 w-5" />} 
              label="Settings" 
              isActive={isActive("/admin/settings")} 
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-indigo-800">
            <NavItem 
              to="/" 
              icon={<Home className="h-5 w-5" />} 
              label="Back to Site" 
              isActive={false} 
            />
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm rounded-md text-white hover:bg-indigo-800 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
};

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
        isActive 
          ? "bg-indigo-800 text-white" 
          : "text-indigo-100 hover:bg-indigo-800 hover:text-white"
      )}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default AdminSidebar;
