'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';

export function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/projects" 
              className="flex items-center px-2 py-2 text-gray-900 hover:text-gray-600"
            >
              Projects
            </Link>
          </div>
          <div className="flex items-center">
            <Button 
              variant="secondary" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 