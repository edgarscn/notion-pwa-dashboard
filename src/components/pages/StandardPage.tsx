import React, { useState, useEffect } from 'react';
import { Page } from '../../types';
import { updatePage } from '../../db/repository';

interface StandardPageProps {
  page: Page;
}

export const StandardPage: React.FC<StandardPageProps> = ({ page }) => {
  const [content, setContent] = useState(page.content || '');

  useEffect(() => {
    setContent(page.content || '');
  }, [page.id, page.content]);

  const handleBlur = () => {
    if (content !== page.content) {
      updatePage(page.id, { content });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        placeholder="Escreva seu texto ou anotação em Markdown aqui..."
        rows={20}
        className="w-full p-4 border border-notion-border rounded-xl text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/30 text-notion-text resize-y shadow-inner"
      />
    </div>
  );
};
