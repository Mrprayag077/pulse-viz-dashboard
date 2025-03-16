"use client";

import { useRouter, usePathname } from "next/navigation";
import { Github, Cloud, BarChart2, Newspaper } from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    { label: "GitHub", path: "/", icon: <Github size={20} /> },
    { label: "News", path: "/news", icon: <Newspaper size={20} /> },
    { label: "Finance", path: "/finance", icon: <BarChart2 size={20} /> },
    { label: "Weather", path: "/weather", icon: <Cloud size={20} /> },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col space-y-4 shadow-lg">
      <div className="mb-8">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          PulseViz Dash
        </h2>
        <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-2"></div>
      </div>

      <ul className="space-y-3 cursor-pointer">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li key={item.path} className="hover:scale-105">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full cursor-pointer flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/70 to-purple-600/70 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                <span className="text-blue-400">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-6 bg-white rounded-full"></span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto">
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-xs font-bold">UI</span>
            </div>
            <div>
              <p className="text-sm font-medium">Smart Dashboard</p>
              <p className="text-xs text-gray-400">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
