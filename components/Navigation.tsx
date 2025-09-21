// components/Navigation.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: "🏠" },
    { href: "/interview", label: "Practice Interview", icon: "🎤" },
    { href: "/interviews", label: "My Interviews", icon: "📊" },
    { href: "/resume", label: "Resume Reviewer", icon: "🔍" },
    { href: "/resume-generator", label: "Resume Builder", icon: "📄" },
  ];

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-white">
              PrepAI
            </Link>
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
