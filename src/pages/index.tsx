import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';

export default function IndexPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white text-gray-400 text-sm">
        Carregando Workspace Notion PWA...
      </div>
    );
  }

  return <AppLayout />;
}

export function Head() {
  return (
    <>
      <title>Notion PWA Workspace - Local-first</title>
      <meta name="description" content="Aplicação web modular inspirada no Notion, rápida, local-first com Dexie.js e PWA." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}
