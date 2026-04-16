import React from 'react';

interface CheckboxOption {
  label: string;
  value: string;
  hint?: string;
}

interface CheckboxProps {
  label?: string;
  hint?: string;
  error?: string;
  options: CheckboxOption[];
  name: string;
  values?: string[];
  onChange?: (values: string[]) => void;
}

export function Checkbox({ 
  label, 
  hint, 
  error, 
  options,
  name,
  values = [],
  onChange,
}: CheckboxProps) {
  const fieldsetId = `checkbox-${name}`;
  const hintId = `${fieldsetId}-hint`;
  const errorId = `${fieldsetId}-error`;
  
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange?.([...values, optionValue]);
    } else {
      onChange?.(values.filter(v => v !== optionValue));
    }
  };
  
  return (
    <div className="mb-6">
      <fieldset 
        className={`border-0 p-0 m-0 ${error ? 'border-l-4 border-[#d4351c] pl-4' : ''}`}
        aria-describedby={`${hint ? hintId : ''} ${error ? errorId : ''}`.trim() || undefined}
      >
        {label && (
          <legend className="block mb-2 font-bold">
            {label}
          </legend>
        )}
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
            const isChecked = values.includes(option.value);
            
            return (
              <div key={option.value} className="flex items-start">
                <input
                  type="checkbox"
                  id={optionId}
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  onChange={(e) => handleChange(option.value, e.target.checked)}
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
