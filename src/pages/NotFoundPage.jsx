import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center primary-content">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-lg max-w-lg w-full text-white text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-lg mt-2 text-gray-300">Oops! Page not found.</p>
        <p className="text-sm text-gray-400 mt-1">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
