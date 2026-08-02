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
        <h1 className="mb-2 flex items-center gap-3 text-[28px] font-bold tracking-tight text-white sm:text-[32px]">
          <Heart className="h-8 w-8 fill-red-500 text-red-500 sm:h-10 sm:w-10" />
          관심 목록
        </h1>
        <p className="text-text-secondary text-[15px] font-medium max-w-xl">
          내가 찜한 에셋과 창작물들을 모아볼 수 있습니다. 언제든 다시 찾아보고 구매하거나 레퍼런스로 활용해보세요.
        </p>
      </div>

      {favoriteAssets.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2200px]:grid-cols-6">
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
                      aria-label={`${asset.title} 즐겨찾기 해제`}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-red-500 backdrop-blur-md transition-all hover:bg-black/80 sm:h-8 sm:w-8"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                  </div>
                  <div className="np-dark-media absolute inset-x-0 bottom-0 z-10 flex h-[82%] translate-y-0 flex-col justify-end bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2.5 opacity-100 transition-all duration-[300ms] ease-out md:h-[75%] md:translate-y-2 md:p-4 md:pb-5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    <h3 className="mb-0.5 line-clamp-2 text-[12px] font-normal leading-[1.3] text-text-primary sm:text-[14px]">
                      {asset.title}
                    </h3>
                    <p className="truncate text-[11px] font-medium text-text-secondary sm:text-[13px]">
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
