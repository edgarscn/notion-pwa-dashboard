import React from 'react';
import { Link } from 'gatsby';

export default function NotFoundPage() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white text-notion-text p-4">
      <h1 className="text-4xl font-extrabold mb-2">404</h1>
      <p className="text-base text-gray-600 mb-6">Página não encontrada no workspace.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
      >
        Voltar ao Workspace Principal
      </Link>
    </div>
  );
}
