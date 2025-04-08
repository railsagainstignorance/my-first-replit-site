import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-xl font-semibold text-primary cursor-pointer">StaticPress</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`${isActive('/') ? 'border-primary text-gray-900 border-b-2' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'} px-1 pt-1 inline-flex items-center text-sm font-medium border-b-2`}>
                  Home
                </a>
              </Link>
              <Link href="/collections">
                <a className={`${isActive('/collections') ? 'border-primary text-gray-900 border-b-2' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'} px-1 pt-1 inline-flex items-center text-sm font-medium border-b-2`}>
                  Collections
                </a>
              </Link>
              <Link href="/tags">
                <a className={`${isActive('/tags') ? 'border-primary text-gray-900 border-b-2' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'} px-1 pt-1 inline-flex items-center text-sm font-medium border-b-2`}>
                  Tags
                </a>
              </Link>
              <Link href="/about">
                <a className={`${isActive('/about') ? 'border-primary text-gray-900 border-b-2' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900'} px-1 pt-1 inline-flex items-center text-sm font-medium border-b-2`}>
                  About
                </a>
              </Link>
            </nav>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/">
            <a className={`${isActive('/') ? 'bg-gray-50 border-primary text-primary-700' : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Home
            </a>
          </Link>
          <Link href="/collections">
            <a className={`${isActive('/collections') ? 'bg-gray-50 border-primary text-primary-700' : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Collections
            </a>
          </Link>
          <Link href="/tags">
            <a className={`${isActive('/tags') ? 'bg-gray-50 border-primary text-primary-700' : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Tags
            </a>
          </Link>
          <Link href="/about">
            <a className={`${isActive('/about') ? 'bg-gray-50 border-primary text-primary-700' : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              About
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
