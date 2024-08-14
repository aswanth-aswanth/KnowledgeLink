export interface TabSelectorProps {
    activeTab: 'faq' | 'ai';
    setActiveTab: (tab: 'faq' | 'ai') => void;
}