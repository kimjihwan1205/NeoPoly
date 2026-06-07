/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Search } from 'lucide-react';
import { Asset } from '../types';
import { ASSETS } from '../App';

interface FavoritesPageProps {
  favorites: number[];
  toggleFavorite: (id: number) => void;
}

export default function FavoritesPage({ favorites, toggleFavorite }: FavoritesPageProps) {
  const favoriteAssets = ASSETS.filter(a => favorites.includes(a.id));

  return (
    <main className="flex-1 bg-bg-dark font-sans text-text-primary px-4 py-6 sm:px-6 2xl:px-8 min-[2200px]:px-10 max-w-[2560px] mx-auto w-full">
      <div className="flex flex-col mb-10">
        <h1 className="text-[32px] md:text-[32px] font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 md:w-10 md:h-10 text-red-500 fill-red-500" />
          관심 목록
        </h1>
        <p className="text-text-secondary text-[15px] font-medium max-w-xl">
          내가 찜한 에셋과 창작물들을 모아볼 수 있습니다. 언제든 다시 찾아보고 구매하거나 레퍼런스로 활용해보세요.
        </p>
      </div>

      {favoriteAssets.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          <AnimatePresence>
            {favoriteAssets.map(asset => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={asset.id}
                className="group relative rounded-[6px] overflow-hidden bg-surface-primary border border-border-soft shadow-xl cursor-pointer flex flex-col aspect-[16/10]"
              >
                <div className="relative flex-1 overflow-hidden">
                  <img 
                    src={asset.image} 
                    alt={asset.title} 
                    className="w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-[1.007] group-hover:brightness-[0.82]" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 z-20">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(asset.id); }}
                      className="p-1.5 bg-black/40 hover:bg-black/80 rounded-full text-red-500 backdrop-blur-md transition-all"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end p-4 pb-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-[300ms] ease-out z-10">
                    <h3 className="text-[15px] font-normal text-text-primary line-clamp-2 leading-[1.3] mb-0.5">
                      {asset.title}
                    </h3>
                    <p className="text-[14px] text-text-secondary font-medium">
                      {asset.author}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-primary border border-border-soft flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-text-tertiary" />
          </div>
          <h3 className="text-[20px] font-bold text-white mb-2">아직 관심 등록한 에셋이 없습니다</h3>
          <p className="text-[15px] text-text-secondary">Discover 페이지에서 마음에 드는 창작물에 하트를 눌러보세요.</p>
        </div>
      )}
    </main>
  );
}
