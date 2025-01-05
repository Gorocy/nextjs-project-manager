import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Project Management System
        </h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link 
            href="/login" 
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Sign In</h2>
            <p className="text-gray-600">Access your projects</p>
          </Link>
          
          <Link 
            href="/register" 
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Create Account</h2>
            <p className="text-gray-600">Start managing your projects</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
