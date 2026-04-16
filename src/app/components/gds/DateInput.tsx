import React, { useState } from 'react';

interface DateInputProps {
  label: string;
  hint?: string;
  error?: string;
  value?: { day: string; month: string; year: string };
  onChange?: (value: { day: string; month: string; year: string }) => void;
  id?: string;
}

export function DateInput({ 
  label, 
  hint, 
  error, 
  value = { day: '', month: '', year: '' },
  onChange,
  id,
}: DateInputProps) {
  const dateId = id || `date-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hintId = `${dateId}-hint`;
  const errorId = `${dateId}-error`;
  
  const handleChange = (field: 'day' | 'month' | 'year', val: string) => {
    onChange?.({ ...value, [field]: val });
  };
  
  return (
    <div className="mb-6">
      <fieldset 
        className={`border-0 p-0 m-0 ${error ? 'border-l-4 border-[#d4351c] pl-4' : ''}`}
        aria-describedby={`${hint ? hintId : ''} ${error ? errorId : ''}`.trim() || undefined}
      >
        <legend className="block mb-1 font-bold">
          {label}
        </legend>
        {hint && (
          <div id={hintId} className="text-[#505a5f] mb-1">
            {hint}
          </div>
        )}
        {error && (
          <p id={errorId} className="text-[#d4351c] font-bold mb-1 flex items-start">
            <span className="mr-1 font-bold text-lg">!</span>
            <span>Error: {error}</span>
          </p>
        )}
        <div className="flex gap-4 flex-wrap">
          <div>
            <label htmlFor={`${dateId}-day`} className="block mb-1">
              Day
            </label>
            <input
              type="text"
              id={`${dateId}-day`}
              name="day"
              value={value.day}
              onChange={(e) => handleChange('day', e.target.value)}
              className={`
                w-[4.425rem] px-2 py-1 border-2 border-[#0b0c0c]
                ${error ? 'border-[#d4351c] border-4' : ''}
                focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-[#0b0c0c]
              `}
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
          <div>
            <label htmlFor={`${dateId}-month`} className="block mb-1">
              Month
            </label>
            <input
              type="text"
              id={`${dateId}-month`}
              name="month"
              value={value.month}
              onChange={(e) => handleChange('month', e.target.value)}
              className={`
                w-[4.425rem] px-2 py-1 border-2 border-[#0b0c0c]
                ${error ? 'border-[#d4351c] border-4' : ''}
                focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-[#0b0c0c]
              `}
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
          <div>
            <label htmlFor={`${dateId}-year`} className="block mb-1">
              Year
            </label>
            <input
              type="text"
              id={`${dateId}-year`}
              name="year"
              value={value.year}
              onChange={(e) => handleChange('year', e.target.value)}
              className={`
                w-[5.9rem] px-2 py-1 border-2 border-[#0b0c0c]
                ${error ? 'border-[#d4351c] border-4' : ''}
                focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-[#0b0c0c]
              `}
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
