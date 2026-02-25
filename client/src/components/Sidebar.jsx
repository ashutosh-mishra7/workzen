import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Trello,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/projects", icon: FolderKanban, label: "Projects" },
  { path: "/tasks", icon: CheckSquare, label: "Tasks" },
  { path: "/calendar", icon: Calendar, label: "Calendar" },
  { path: "/kanban", icon: Trello, label: "Kanban" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="
        relative flex flex-col h-full shrink-0
        bg-[#111827]
        border-r border-[#374151]
      "
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#374151]">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1F2937] shrink-0">
          <Zap size={16} className="text-[#F9FAFB]" />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="font-semibold text-sm tracking-wide text-[#F9FAFB] whitespace-nowrap"
            >
              WorkZen
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-14
          flex items-center justify-center
          w-6 h-6
          rounded-full
          bg-[#1F2937]
          border border-[#374151]
          text-[#9CA3AF]
          hover:bg-[#374151]
          hover:text-[#F9FAFB]
          transition-colors duration-150
          z-10
        "
      >
        {collapsed ? (
          <ChevronRight size={12} />
        ) : (
          <ChevronLeft size={12} />
        )}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-hidden">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `
                group relative flex items-center gap-3
                px-3 py-2.5
                rounded-lg
                text-sm font-medium
                transition-colors duration-150
                ${
                  isActive
                    ? "bg-[#1F2937] text-[#F9FAFB]"
                    : "text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB]"
                }
              `
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={`shrink-0 ${
                    isActive ? "text-[#F9FAFB]" : "text-[#9CA3AF]"
                  }`}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.12 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip */}
                {collapsed && (
                  <div
                    className="
                      absolute left-full ml-3
                      px-2 py-1
                      text-xs font-medium
                      rounded-md
                      bg-[#374151]
                      text-[#F9FAFB]
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-150
                      pointer-events-none
                      whitespace-nowrap
                      z-50
                    "
                  >
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pt-4 pb-5 border-t border-[#374151]">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-3 rounded-lg bg-[#0B0F19] border border-[#1F2937]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-[#1F2937] text-[#F9FAFB] shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-medium text-[#F9FAFB] truncate">
                {user?.name}
              </p>
              <p className="text-xs text-[#9CA3AF] truncate">
                {user?.email}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`
            flex items-center gap-3
            w-full
            px-3 py-2.5
            rounded-lg
            text-sm font-medium
            text-red-500
            hover:bg-[#1F2937]
            transition-colors duration-150
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <LogOut size={18} className="shrink-0" />

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.12 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;