import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="text-xl font-semibold text-primary">StaticPress</span>
            <p className="mt-4 text-gray-700">
              A simple, robust, static content publishing site with markdown support, collections, and powerful curation tools.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/collections/docs">
                  <a className="text-gray-700 hover:text-primary">Documentation</a>
                </Link>
              </li>
              <li>
                <Link href="/collections/tutorials">
                  <a className="text-gray-700 hover:text-primary">Tutorials</a>
                </Link>
              </li>
              <li>
                <Link href="/collections">
                  <a className="text-gray-700 hover:text-primary">Examples</a>
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-primary"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-gray-700 hover:text-primary">About</a>
                </Link>
              </li>
              <li>
                <Link href="/collections/blog">
                  <a className="text-gray-700 hover:text-primary">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-700 hover:text-primary">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} StaticPress. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
