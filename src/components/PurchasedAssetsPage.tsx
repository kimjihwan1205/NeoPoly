/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Check, Sparkles, Filter, LayoutGrid } from 'lucide-react';
import { Asset } from '../types';
import { ASSETS } from '../App';

export default function PurchasedAssetsPage() {
  const [filter, setFilter] = useState('전체');

  // For demonstration, let's just pick some random items from ASSETS to act as "Purchased".
  // Let's use indices 0, 3, 5, 10
  const purchasedIndices = [0, 3, 5, 10];
  const purchasedAssets = ASSETS.filter((_, i) => purchasedIndices.includes(i));
  const filteredAssets = filter === '전체' 
    ? purchasedAssets 
    : purchasedAssets.filter(asset => asset.badge === (filter === '마켓 에셋' ? 'M' : 'A'));

  return (
    <main className="flex-1 bg-bg-dark font-sans text-text-primary px-6 py-6 max-w-[2006px] mx-auto w-full">
      <div className="flex flex-col mb-10">
        <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <LayoutGrid className="w-8 h-8 md:w-10 md:h-10 text-brand-primary" />
          구매한 에셋
        </h1>
        <p className="text-text-secondary text-[15px] font-medium max-w-xl">
          에셋 마켓에서 구매한 프로젝트와 소스들을 확인하고 다운로드할 수 있습니다. 상업적 이용 및 라이선스 범위를 지켜주세요.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex gap-2">
          {['전체', '마켓 에셋', '무료 에셋'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-[6px] text-[14px] font-bold transition-all border ${
                filter === f 
                  ? 'bg-brand-primary border-brand-primary text-bg-dark' 
                  : 'bg-surface-primary border-border-soft text-text-secondary hover:text-text-primary hover:border-border-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <AnimatePresence>
          {filteredAssets.map(asset => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={asset.id}
              className="bg-surface-primary border border-border-soft rounded-[8px] overflow-hidden group flex flex-col shadow-xl"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={asset.image} 
                  alt={asset.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.007] group-hover:brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-green-500/20 text-green-400 border border-green-500/40 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 backdrop-blur-md">
                  <Check className="w-3 h-3" /> Purchased
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-[16px] font-bold mb-1 leading-tight text-white group-hover:text-brand-primary transition-colors">{asset.title}</h3>
                <p className="text-[13px] text-text-secondary mb-5">By <span className="text-white font-medium">{asset.author}</span></p>
                <div className="mt-auto">
                  <button className="w-full py-2.5 bg-surface-secondary hover:bg-[#1A1814] text-text-primary hover:text-brand-primary border border-border-soft hover:border-brand-primary/50 text-[14px] font-bold rounded-[6px] transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> 다운로드 받기
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredAssets.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-text-tertiary">
            <Filter className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-[16px] font-medium">해당하는 에셋이 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}
