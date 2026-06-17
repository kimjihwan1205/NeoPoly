/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Check, Filter, LayoutGrid, ShoppingBag } from 'lucide-react';

type PurchasedAssetItem = {
  id: number;
  title: string;
  author: string;
  price: string;
  rawPrice: number;
  image: string;
  category: string;
  badge: 'M' | 'A';
  license: string;
  fileFormat: string;
  purchasedAt?: number;
};

const PURCHASED_ASSETS_KEY = 'neopoly_purchased_assets_v1';
const PROTOTYPE_PURCHASE_EVENT = 'neopoly:purchased';
const FILTER_ALL = '\uC804\uCCB4';
const FILTER_MARKET = '\uB9C8\uCF13 \uC5D0\uC14B';
const FILTER_ART = '\uC544\uD2B8 \uC791\uD488';

const readPurchasedItems = (): PurchasedAssetItem[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(PURCHASED_ASSETS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatPurchasedDate = (value?: number) => {
  if (!value) return '\uBC29\uAE08 \uC804';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
};

export default function PurchasedAssetsPage() {
  const [filter, setFilter] = useState(FILTER_ALL);
  const [purchasedAssets, setPurchasedAssets] = useState<PurchasedAssetItem[]>(() => readPurchasedItems());

  useEffect(() => {
    const syncPurchasedItems = () => setPurchasedAssets(readPurchasedItems());
    window.addEventListener(PROTOTYPE_PURCHASE_EVENT, syncPurchasedItems as EventListener);
    window.addEventListener('storage', syncPurchasedItems);
    return () => {
      window.removeEventListener(PROTOTYPE_PURCHASE_EVENT, syncPurchasedItems as EventListener);
      window.removeEventListener('storage', syncPurchasedItems);
    };
  }, []);

  const filteredAssets = filter === FILTER_ALL
    ? purchasedAssets
    : purchasedAssets.filter((asset) => asset.badge === (filter === FILTER_MARKET ? 'M' : 'A'));

  return (
    <main className="mx-auto w-full max-w-[2560px] flex-1 bg-bg-dark px-4 py-6 font-sans text-text-primary sm:px-6 2xl:px-8 min-[2200px]:px-10">
      <div className="mb-10 flex flex-col">
        <h1 className="mb-2 flex items-center gap-3 text-[32px] font-bold tracking-tight text-white md:text-[32px]">
          <LayoutGrid className="h-8 w-8 text-brand-primary md:h-10 md:w-10" />
          {'\uAD6C\uB9E4\uD55C \uC5D0\uC14B'}
        </h1>
        <p className="max-w-xl text-[15px] font-medium leading-[1.65] text-text-secondary">
          {'\uD504\uB85C\uD1A0\uD0C0\uC785 \uACB0\uC81C\uB85C \uAD6C\uB9E4\uD55C \uC791\uD488\uC744 \uD655\uC778\uD558\uACE0, \uB2E4\uC6B4\uB85C\uB4DC\uC640 \uB77C\uC774\uC120\uC2A4 \uC815\uBCF4\uB97C \uD55C\uACF3\uC5D0\uC11C \uBCF4\uC5EC\uC90D\uB2C8\uB2E4.'}
        </p>
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex gap-2">
          {[FILTER_ALL, FILTER_MARKET, FILTER_ART].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-[6px] border px-4 py-2 text-[14px] font-medium transition-all ${
                filter === item
                  ? 'border-brand-primary bg-brand-primary text-bg-dark'
                  : 'border-border-soft bg-surface-primary text-text-secondary hover:border-border-primary hover:text-text-primary'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="text-[14px] font-medium text-text-tertiary">
          {purchasedAssets.length}{'\uAC1C \uAD6C\uB9E4\uB428'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <AnimatePresence>
          {filteredAssets.map((asset) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={asset.id}
              className="group flex flex-col overflow-hidden rounded-[8px] border border-border-soft bg-surface-primary shadow-xl"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={asset.image}
                  alt={asset.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.007] group-hover:brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded border border-green-500/40 bg-green-500/20 px-2 py-0.5 text-[14px] font-medium uppercase tracking-wider text-green-400 backdrop-blur-md">
                  <Check className="h-3 w-3" /> Purchased
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="mb-1 text-[16px] font-medium leading-tight text-white transition-colors group-hover:text-brand-primary">{asset.title}</h3>
                    <p className="text-[14px] text-text-secondary">By <span className="font-medium text-white">{asset.author}</span></p>
                  </div>
                  <span className="shrink-0 rounded bg-brand-primary/15 px-2 py-1 text-[14px] font-medium text-brand-primary">{asset.price}</span>
                </div>

                <div className="mb-5 space-y-2 rounded-md border border-border-soft/70 bg-bg-dark/40 p-3 text-[14px]">
                  <div className="flex justify-between gap-3">
                    <span className="text-text-tertiary">{'\uB77C\uC774\uC120\uC2A4'}</span>
                    <span className="text-right text-text-secondary">{asset.license}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-text-tertiary">{'\uD30C\uC77C \uD615\uC2DD'}</span>
                    <span className="text-right text-text-secondary">{asset.fileFormat}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-text-tertiary">{'\uAD6C\uB9E4\uC77C'}</span>
                    <span className="text-right text-text-secondary">{formatPurchasedDate(asset.purchasedAt)}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <button className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-border-soft bg-surface-secondary py-2.5 text-[14px] font-medium text-text-primary transition-all hover:border-brand-primary/50 hover:bg-[#1A1814] hover:text-brand-primary">
                    <Download className="h-4 w-4" /> {'\uB2E4\uC6B4\uB85C\uB4DC \uBC1B\uAE30'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredAssets.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center text-text-tertiary">
            {purchasedAssets.length === 0 ? (
              <ShoppingBag className="mb-4 h-12 w-12 opacity-50" />
            ) : (
              <Filter className="mb-4 h-12 w-12 opacity-50" />
            )}
            <p className="text-[16px] font-medium text-text-secondary">
              {purchasedAssets.length === 0 ? '\uC544\uC9C1 \uAD6C\uB9E4\uD55C \uC791\uD488\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.' : '\uD574\uB2F9\uD558\uB294 \uC5D0\uC14B\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.'}
            </p>
            <p className="mt-2 text-[14px] text-text-tertiary">
              {purchasedAssets.length === 0 ? '\uC0C1\uC138 \uD398\uC774\uC9C0\uC5D0\uC11C \uAD6C\uB9E4\uD558\uAE30\uB97C \uB204\uB974\uBA74 \uC774\uACF3\uC5D0 \uCD94\uAC00\uB429\uB2C8\uB2E4.' : '\uB2E4\uB978 \uD544\uD130\uB97C \uC120\uD0DD\uD574 \uBCF4\uC138\uC694.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
