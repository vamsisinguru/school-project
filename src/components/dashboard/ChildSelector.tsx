'use client';

import { cn, getAvatarUrl } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Child {
  id: string;
  name: string;
  className: string;
  sectionName: string;
}

export function ChildSelector({ studentChildren, selectedId, onSelect }: { studentChildren: Child[]; selectedId: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = studentChildren.find(c => c.id === selectedId);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm hover:bg-navy-50 transition-colors"
      >
        <img src={getAvatarUrl(selected?.name || '')} alt="" className="h-6 w-6 rounded-full" />
        <div className="text-left hidden sm:block">
          <p className="font-semibold text-navy-900 text-xs">{selected?.name}</p>
          <p className="text-navy-500 text-[10px]">{selected?.className} - {selected?.sectionName}</p>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-navy-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 rounded-lg border border-navy-100 bg-white shadow-lg animate-fade-in z-50">
          <div className="border-b border-navy-50 px-3 py-2">
            <p className="text-xs font-semibold text-navy-700">My Children</p>
          </div>
          <div className="p-2 space-y-1">
            {studentChildren.map(child => (
              <button
                key={child.id}
                onClick={() => { onSelect(child.id); setOpen(false); }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors',
                  child.id === selectedId ? 'bg-navy-50' : 'hover:bg-navy-50'
                )}
              >
                <img src={getAvatarUrl(child.name)} alt="" className="h-7 w-7 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-navy-900">{child.name}</p>
                  <p className="text-xs text-navy-500">{child.className} - {child.sectionName}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
