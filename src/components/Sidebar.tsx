"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  HomeIcon,
  CloudIcon,
  DollarSignIcon,
  NewspaperIcon,
} from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: "GitHub", path: "/", icon: HomeIcon },
    { label: "Weather", path: "/weather", icon: CloudIcon },
    { label: "Finance", path: "/finance", icon: DollarSignIcon },
    { label: "News", path: "/news", icon: NewspaperIcon },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-6 flex flex-col space-y-6">
      <h2 className="text-xl font-semibold mb-6">Dashboard Menu</h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.path}>
            <button
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 ease-in-out w-full text-left hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                pathname === item.path ? "bg-blue-600" : ""
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
