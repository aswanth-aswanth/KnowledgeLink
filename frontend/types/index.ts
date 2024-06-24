export type Tab = {
    name: string;
    icon: string;
}
export type TabsProps = {
    tabs: Tab[];
    activeTab: string;
    onTabClick: (tabName: string) => void;
    tabFor: string;
}
// src/types/index.ts


export interface Topic {
    id: string;
    name: string;
    content: string;
    no: string;
    children: string[];
    isExpanded: boolean;
  }

export interface TopicsState {
    topics: { [id: string]: Topic };
    rootId: string;
}