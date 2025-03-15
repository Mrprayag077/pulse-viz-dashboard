"use client";

import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-4">
      <ul>
        <li className="py-2">
          <button onClick={() => handleNavigation("/weather")}>Weather</button>
        </li>
        <li className="py-2">
          <button onClick={() => handleNavigation("/news")}>News</button>
        </li>
        <li className="py-2">
          <button onClick={() => handleNavigation("/finance")}>Finance</button>
        </li>
        <li className="py-2">
          <button onClick={() => handleNavigation("/")}>GitHub</button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
