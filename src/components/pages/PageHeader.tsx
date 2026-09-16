import React, { useState } from 'react';
import { Page } from '../../types';
import { updatePage } from '../../db/repository';

interface PageHeaderProps {
  page: Page;
}

const EMOJIS = ['📄', '📋', '📚', '🚀', '🏢', '📝', '🎯', '📊', '💡', '📌', '⭐', '⚡'];

export const PageHeader: React.FC<PageHeaderProps> = ({ page }) => {
  const [title, setTitle] = useState(page.title);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleTitleBlur = () => {
    if (title.trim() !== page.title) {
      updatePage(page.id, { title: title.trim() || 'Sem título' });
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    updatePage(page.id, { icon: emoji });
    setShowEmojiPicker(false);
  };

  return (
    <div className="mb-6 group">
      {/* Cover placeholder */}
      <div className="h-32 -mx-8 -mt-8 mb-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-b-xl opacity-95 relative">
        <div className="absolute -bottom-6 left-8">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-14 h-14 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center text-3xl hover:scale-105 transition-transform"
          >
            {page.icon || (page.isDatabase ? '📋' : '📄')}
          </button>
          {showEmojiPicker && (
            <div className="absolute top-16 left-0 z-30 bg-white border border-gray-200 rounded-xl shadow-xl p-2 grid grid-cols-4 gap-2 w-48">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="w-9 h-9 text-xl hover:bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Sem título"
          className="text-3xl font-extrabold text-notion-text w-full border-none focus:outline-none bg-transparent placeholder-gray-300"
        />
      </div>
    </div>
  );
};
