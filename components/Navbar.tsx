'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors duration-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl">📝</div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Home</h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All Tasks
            </Link>
            <Link
              href="/create-task"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/create-task'
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
              }`}
            >
              + Create Task
            </Link>
            <Link
              href="/create-user"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/user'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              >
                User
              </Link>
            
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;