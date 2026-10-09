// src/components/BusinessBottombar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  BarChart3,
  Store,
  Settings,
} from "lucide-react";

const TABS = [
  {
    to: "/business",
    label: "Home",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    to: "/business/promotions",
    label: "Promos",
    icon: Megaphone,
  },
  {
    to: "/business/ads",
    label: "Ads",
    icon: BarChart3,
  },
  {
    to: "/business/profile",
    label: "Profile",
    icon: Store,
  },
  {
    to: "/business/settings",
    label: "Settings",
    icon: Settings,
  },
];

const BusinessBottombar = () => {
  const location = useLocation();

  const isActive = (tab) => {
    if (tab.exact) return location.pathname === tab.to;
    return (
      location.pathname === tab.to || location.pathname.startsWith(`${tab.to}/`)
    );
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch justify-around h-16">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);

          return (
            <Link
              key={tab.to}
              to={tab.to}
              aria-label={tab.label}
              className="relative flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors active:scale-95"
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  active ? "text-[#3B82F6]" : "text-gray-400 dark:text-gray-500"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "text-[#3B82F6]" : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {tab.label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#3B82F6]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BusinessBottombar;
