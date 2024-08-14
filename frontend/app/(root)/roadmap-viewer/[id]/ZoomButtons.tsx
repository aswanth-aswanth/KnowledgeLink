import { ZoomButtonsProps } from '@/types/roadmap';
import React from 'react';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import ZoomButton from './ZoomButton';

export default function ZoomButtons({ handleZoom }: ZoomButtonsProps) {
  return (
    <div className="absolute top-0 right-0 flex z-50 space-x-2 p-2">
      <ZoomButton
        icon={<FiZoomIn />}
        onClick={() => handleZoom('in')}
        label="Zoom in"
      />
      <ZoomButton
        icon={<FiZoomOut />}
        onClick={() => handleZoom('out')}
        label="Zoom out"
      />
    </div>
  );
}
