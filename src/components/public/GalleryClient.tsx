'use client';

import { useState } from 'react';
import { Card } from '@/components/ui';
import { X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
}

export function GalleryClient({ items, categories }: { items: GalleryItem[]; categories: string[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = activeCategory === 'All' ? items : items.filter((item) => item.category === activeCategory);

  return (
    <>
      <section className="section-padding">
        <div className="container-max">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  activeCategory === cat
                    ? 'bg-navy-900 text-white'
                    : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <Card key={item.id} hover={false} className="overflow-hidden group cursor-pointer" >
                <div className="relative h-56 overflow-hidden" onClick={() => setLightbox(item)}>
                  <img
                    src={item.imageUrl}
                    alt={item.description || item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/30 transition-all flex items-end p-4">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                      <p className="text-white/70 text-xs">{item.category}</p>
                    </div>
                    <ZoomIn className="absolute top-4 right-4 h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-navy-400 py-12">No images in this category yet.</p>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightbox(null)}>
          <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" />
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} className="absolute -top-12 right-0 text-white hover:text-gold-400 transition-colors">
              <X className="h-8 w-8" />
            </button>
            <img src={lightbox.imageUrl} alt={lightbox.description || lightbox.title} className="w-full rounded-xl shadow-2xl max-h-[80vh] object-contain" />
            <div className="mt-4 text-center">
              <h3 className="text-white font-semibold">{lightbox.title}</h3>
              <p className="text-white/60 text-sm">{lightbox.category}</p>
              {lightbox.description && <p className="text-white/50 text-sm mt-1">{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
