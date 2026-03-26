import React, { useMemo } from 'react';
import { useStudentContext } from '../../contexts/StudentContext';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const WEEKS = 10;

function generateHeatmap(students) {
  // Derive a pseudo-heatmap from student attendance averages
  const avg = students.length
    ? students.reduce((s, st) => s + (st.attendance || 0), 0) / students.length
    : 85;

  const cells = [];
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < 5; d++) {
      // Simulate slight variance around the average
      const seed = (w * 7 + d * 3 + 17) % 23;
      const variance = (seed - 11) * 0.6;
      const val = Math.min(100, Math.max(0, avg + variance));
      cells.push({ week: w, day: d, val });
    }
  }
  return cells;
}

function getColor(val) {
  if (val >= 90) return 'bg-green-500';
  if (val >= 80) return 'bg-green-300';
  if (val >= 70) return 'bg-yellow-300';
  if (val >= 60) return 'bg-orange-400';
  return 'bg-red-500';
}

export const AttendanceHeatmap = () => {
  const { students } = useStudentContext();
  const cells = useMemo(() => generateHeatmap(students), [students]);

  const today = new Date();
  const weekLabels = Array.from({ length: WEEKS }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (WEEKS - 1 - i) * 7);
    return `W${i + 1}`;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Class Attendance Heatmap
        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">(last 10 weeks)</span>
      </h3>

      <div className="overflow-x-auto">
        <div className="flex gap-1 mb-1 ml-10">
          {weekLabels.map(w => (
            <div key={w} className="w-6 text-center text-xs text-gray-400">{w}</div>
          ))}
        </div>

        {DAYS.map((day, di) => (
          <div key={day} className="flex items-center gap-1 mb-1">
            <span className="w-8 text-xs text-gray-500 dark:text-gray-400 text-right pr-1">{day}</span>
            {Array.from({ length: WEEKS }, (_, wi) => {
              const cell = cells.find(c => c.week === wi && c.day === di);
              return (
                <div
                  key={wi}
                  title={`${day} W${wi + 1}: ${cell ? cell.val.toFixed(1) : 0}%`}
                  className={`w-6 h-6 rounded-sm ${getColor(cell?.val ?? 0)} opacity-80 hover:opacity-100 cursor-pointer transition-opacity`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Low</span>
        {['bg-red-500', 'bg-orange-400', 'bg-yellow-300', 'bg-green-300', 'bg-green-500'].map(c => (
          <div key={c} className={`w-4 h-4 rounded-sm ${c}`} />
        ))}
        <span>High</span>
      </div>
    </div>
  );
};
