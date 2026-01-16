import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
          <AlertTriangle className="text-red-600" size={32} />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300 font-semibold"
          >
            <Home size={20} />
            Back to Home
          </Link>
          
          <div className="pt-4">
            <p className="text-gray-600 text-sm">
              Or visit our <Link to="/" className="text-black hover:underline font-medium">homepage</Link> to find what you're looking for.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;