'use client';

import { useState } from 'react';
import { Card } from '@/components/ui';
import { cn, formatTime } from '@/lib/utils';
import { Coffee, Utensils } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TimetableView({ timetables }: { timetables: any[] }) {
  const [selectedDay, setSelectedDay] = useState('Monday');

  const timetable = timetables.find(t => t.day === selectedDay);
  const periods = timetable?.periods || [];

  return (
    <div>
      {/* Day selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              selectedDay === day
                ? 'bg-navy-900 text-white'
                : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
            )}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Timetable */}
      <Card className="overflow-hidden">
        {periods.length === 0 ? (
          <div className="p-8 text-center text-navy-400 text-sm">No timetable set for {selectedDay}.</div>
        ) : (
          <div className="divide-y divide-navy-50">
            {periods.map(period => (
              <div
                key={period.id}
                className={cn(
                  'flex items-center gap-4 p-4 transition-colors',
                  period.isBreak ? 'bg-navy-50/50' : 'hover:bg-navy-50/30'
                )}
              >
                <div className="flex-shrink-0 w-20 text-center">
                  <p className="text-xs font-semibold text-navy-900">{formatTime(period.startTime)}</p>
                  <p className="text-xs text-navy-400">{formatTime(period.endTime)}</p>
                </div>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-navy-100 text-navy-600 text-xs font-bold">
                  {period.periodNumber}
                </div>
                <div className="flex-1 min-w-0">
                  {period.isBreak ? (
                    <div className="flex items-center gap-2">
                      {period.breakType === 'Lunch' ? (
                        <Utensils className="h-4 w-4 text-navy-400" />
                      ) : (
                        <Coffee className="h-4 w-4 text-navy-400" />
                      )}
                      <span className="text-sm font-medium text-navy-600">{period.breakType}</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-navy-900">{period.subject?.name || 'Free Period'}</p>
                      {period.staff && (
                        <p className="text-xs text-navy-500">{period.staff.user.name}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
