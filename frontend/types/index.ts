// src/types/index.ts

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
  
  export interface Topic {
    id: string;
    name: string;
    content: string;
    no: string;
    children: string[];
    isExpanded: boolean;
  }
  
  export interface Rect {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
  }
  
  export interface ConnectionType {
    from: string;
    to: string;
    style: "straight" | "curved";
  }
  
  export interface TopicsState {
    topics: { [id: string]: Topic };
    rootId: string;
    rectangles: Rect[];
    connections: ConnectionType[];
  }