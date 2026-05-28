/// <reference types="vite/client" />
import { useState, useEffect } from 'react';

const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;

// Global queue to prevent hitting Pexels too fast on initial load
let isFetching = false;
const fetchQueue: (() => Promise<void>)[] = [];

const processQueue = async () => {
  if (isFetching || fetchQueue.length === 0) return;
  isFetching = true;
  while (fetchQueue.length > 0) {
    const nextFetch = fetchQueue.shift();
    if (nextFetch) {
      await nextFetch();
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  isFetching = false;
};

// Map categories to better Pexels search terms (Pexels is stock photography, so specific game names usually return 0 results)
const getStockQueryOptions = (title: string, category: string): string[] => {
  const baseTitle = title.split(':')[0].split(' ')[0]; // e.g. "Super Mario World" -> "Super", "Zelda" -> "Zelda"
  
  const categoryMap: Record<string, string> = {
    'Aventura': 'adventure landscape',
    'RPG': 'fantasy magic landscape',
    'Ação-Aventura': 'hero epic action',
    'Plataforma': 'pixel art jump',
    'Luta': 'martial arts neon',
    'Ação': 'cyberpunk action',
    'Corrida': 'neon racing car',
    'Shooter': 'spaceship galaxy',
    'Simulação': 'farm nature aesthetic',
    'Esportes': 'retro sports stadium'
  };

  const genericAesthetic = categoryMap[category] || 'retro gaming neon';

  return [
    `${baseTitle} retro game`, // Try the specific word first
    `${genericAesthetic}`,     // Fallback to the genre aesthetic
    `retro arcade neon`        // Ultimate fallback
  ];
};

export const getPexelsImage = async (queryName: string, category: string, orientation: 'landscape' | 'portrait', fallbackUrl: string): Promise<string> => {
  if (!PEXELS_KEY) {
    return fallbackUrl;
  }

  const queriesToTry = getStockQueryOptions(queryName, category);
  const cacheKey = `pexels-v2-${queryName}-${orientation}`; // Updated cache key to bypass old 0-result cache

  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return cached;
  }

  return new Promise((resolve) => {
    fetchQueue.push(async () => {
      try {
        let finalUrl = fallbackUrl;

        // Try sequentially until we get a result from Pexels
        for (const query of queriesToTry) {
          const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=1`, {
            headers: {
              Authorization: PEXELS_KEY
            }
          });
          
          if (!res.ok) continue;

          const data = await res.json();
          if (data.photos && data.photos.length > 0) {
            finalUrl = orientation === 'landscape' ? data.photos[0].src.landscape : data.photos[0].src.portrait;
            break; // Found a good image!
          }
        }

        // Cache whatever we found (even if it's the fallback)
        localStorage.setItem(cacheKey, finalUrl);
        resolve(finalUrl);
        
      } catch (error) {
        console.error("Pexels error:", error);
        resolve(fallbackUrl);
      }
    });

    processQueue();
  });
};
