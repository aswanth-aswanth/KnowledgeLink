import React from 'react';
import { TabButton } from './TabButton';
import { TabSelectorProps } from '@/types/roadmap';

const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex mb-4">
      <TabButton
        label="FAQs"
        isActive={activeTab === 'faq'}
        onClick={() => setActiveTab('faq')}
      />
      <TabButton
        label="AI Assistant"
        isActive={activeTab === 'ai'}
        onClick={() => setActiveTab('ai')}
      />
    </div>
  );
};

export default TabSelector;
