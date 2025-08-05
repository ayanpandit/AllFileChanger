import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - AllFileChanger</title>
        <meta name="description" content="The page you're looking for doesn't exist. Explore our free online file conversion tools." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-lg mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800 select-none">
              404
            </h1>
          </div>
          
          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link 
              to="/"
              className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300"
            >
              Go Home
            </Link>
            <Link 
              to="/image-to-pdf"
              className="inline-block px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-lg font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
            >
              Image to PDF
            </Link>
          </div>
          
          {/* Popular Tools */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Popular Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                to="/image-to-pdf"
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              >
                <h4 className="font-semibold text-black dark:text-white">Image to PDF</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Convert images to PDF</p>
              </Link>
              <Link 
                to="/image-compressor"
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              >
                <h4 className="font-semibold text-black dark:text-white">Image Compressor</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reduce image file sizes</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
