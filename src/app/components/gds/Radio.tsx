import React from 'react';

interface RadioOption {
  label: string;
  value: string;
  hint?: string;
}

interface RadioProps {
  label: string;
  hint?: string;
  error?: string;
  options: RadioOption[];
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function Radio({ 
  label, 
  hint, 
  error, 
  options,
  name,
  value,
  onChange,
}: RadioProps) {
  const fieldsetId = `radio-${name}`;
  const hintId = `${fieldsetId}-hint`;
  const errorId = `${fieldsetId}-error`;
  
  return (
    <div className="mb-6">
      <fieldset 
        className={`border-0 p-0 m-0 ${error ? 'border-l-4 border-[#d4351c] pl-4' : ''}`}
        aria-describedby={`${hint ? hintId : ''} ${error ? errorId : ''}`.trim() || undefined}
      >
        <legend className="block mb-2 font-bold">
          {label}
        </legend>
        {hint && (
          <div id={hintId} className="text-[#505a5f] mb-3">
            {hint}
          </div>
        )}
        {error && (
          <p id={errorId} className="text-[#d4351c] font-bold mb-3 flex items-start">
            <span className="mr-1 font-bold text-lg">!</span>
            <span>Error: {error}</span>
          </p>
        )}
        <div className="space-y-2">
          {options.map((option, index) => {
            const optionId = `${fieldsetId}-${index}`;
            const optionHintId = option.hint ? `${optionId}-hint` : undefined;
            
            return (
              <div key={option.value} className="flex items-start">
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange?.(e.target.value)}
                  className="mt-1 w-11 h-11 border-2 border-[#0b0c0c] cursor-pointer focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-0"
                  aria-describedby={optionHintId}
                />
                <label 
                  htmlFor={optionId} 
                  className="ml-3 cursor-pointer flex-1"
                >
                  <span className="block">{option.label}</span>
                  {option.hint && (
                    <span id={optionHintId} className="block text-[#505a5f] mt-1">
                      {option.hint}
                    </span>
                  )}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
