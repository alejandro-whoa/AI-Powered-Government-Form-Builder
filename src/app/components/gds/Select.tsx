import React from 'react';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
}

export function Select({ 
  label, 
  hint, 
  error, 
  options,
  id,
  className = '',
  ...props 
}: SelectProps) {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const hintId = `${selectId}-hint`;
  const errorId = `${selectId}-error`;
  
  return (
    <div className={`mb-6 ${className}`}>
      <label 
        htmlFor={selectId} 
        className="block mb-1 font-bold"
      >
        {label}
      </label>
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
      <select
        id={selectId}
        className={`
          w-full max-w-[29.5rem] px-2 py-1 border-2 border-[#0b0c0c]
          ${error ? 'border-[#d4351c] border-4' : ''}
          focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-[#0b0c0c]
          bg-white cursor-pointer
        `}
        aria-describedby={`${hint ? hintId : ''} ${error ? errorId : ''}`.trim() || undefined}
        {...props}
      >
        <option value="">Please select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
