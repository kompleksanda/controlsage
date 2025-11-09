import React from 'react';

export function ControlSageLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ControlSage Logo"
    >
      <path
        d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2Z"
        className="fill-primary"
      />
      <path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        className="fill-primary-foreground"
      />
      <path
        d="M12 15C10.5 15 9.875 16.5 9.5 17.5C10.25 18 11.125 18.25 12 18.25C12.875 18.25 13.75 18 14.5 17.5C14.125 16.5 13.5 15 12 15Z"
        className="fill-primary-foreground"
      />
    </svg>
  );
}
