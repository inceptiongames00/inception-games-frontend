"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Crosshair,
  LogOut,
  Menu,
  X,
  MessageSquare,
  UserPlus,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/kaziPortal/dashboard", icon: LayoutDashboard },
  {
    name: "Tournament",
    href: "/kaziPortal/dashboard/tournament",
    icon: Trophy,
  },
  { name: "Scrims", href: "/kaziPortal/dashboard/scrims", icon: Crosshair },
  {
    name: "Send Message",
    href: "/kaziPortal/dashboard/SendMessages",
    icon: MessageSquare,
  },
  {
    name: "Create User",
    href: "/kaziPortal/dashboard/create-user",
    icon: UserPlus,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-black/10 sticky top-0 z-40 shadow-sm">
        <h2 className="text-2xl font-extrabold !text-black">Inception</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-black/10 flex flex-col shadow-2xl md:shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold !text-black">Inception</h2>
            <p className="text-xs text-gray-500 mt-1 font-medium tracking-wide uppercase">
              Workspace
            </p>
          </div>
          <button
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 font-semibold shadow-sm border border-purple-100"
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 border border-transparent"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-purple-600" : "text-gray-400 group-hover:text-gray-600"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-black/5 mt-auto">
          <Link
            href="/kaziPortal"
            className="flex items-center gap-3 px-4 py-3 text-red-500/80 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-300 font-medium group"
          >
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Logout
          </Link>
        </div>
      </div>
    </>
  );
}
