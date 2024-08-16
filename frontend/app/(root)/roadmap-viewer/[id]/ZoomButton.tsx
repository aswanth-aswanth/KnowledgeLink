import { ZoomButtonProps } from '@/types/roadmap';
import React from 'react';

export default function ZoomButton({ icon, onClick, label }: ZoomButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
      aria-label={label}
    >
      {icon}
    </button>
  );
}
