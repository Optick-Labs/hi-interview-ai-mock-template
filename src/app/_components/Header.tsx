"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "font-semibold" : "text-gray-600";
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Interview AI
          </Link>
          <nav className="flex space-x-6">
            <Link href="/" className={`${isActive("/")} hover:text-black`}>
              Home
            </Link>
            <Link 
              href="/interviews"
              className={`${isActive("/interviews")} hover:text-black`}
            >
              Interviews
            </Link>
            <Link 
              href="/profile"
              className={`${isActive("/profile")} hover:text-black`}
            >
              Profile
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 