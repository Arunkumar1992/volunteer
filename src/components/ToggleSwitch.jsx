import React from 'react';

/**
 * Reusable modern iOS/Mac style Toggle Switch Pill Component
 * Matches green (#155e4b) active state with smooth sliding white circle knob.
 */
export default function ToggleSwitch({
  checked = false,
  onChange,
  label,
  sublabel,
  disabled = false,
  size = 'md',
  className = ''
}) {
  const isSm = size === 'sm';

  const handleClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div 
      onClick={handleClick}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
      className={`inline-flex items-center gap-2 cursor-pointer select-none focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <span
        className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
          isSm ? 'w-9 h-5' : 'w-11 h-6'
        } ${
          checked ? 'bg-[#155e4b]' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow-md transform ring-0 transition-transform duration-200 ease-in-out ${
            isSm 
              ? `w-3.5 h-3.5 ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}` 
              : `w-5 h-5 ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`
          }`}
        />
      </span>

      {(label || sublabel) && (
        <div className="flex flex-col text-left">
          {label && (
            <span className={`font-extrabold ${isSm ? 'text-[11px]' : 'text-xs'} ${checked ? 'text-[#155e4b]' : 'text-slate-500'}`}>
              {label}
            </span>
          )}
          {sublabel && <span className="text-[10px] text-slate-400 font-medium">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
