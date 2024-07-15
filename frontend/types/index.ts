export type Tab = {
    name: string;
    icon: string;
    dbName?:string;
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
    editorData?: any | null;
}



export interface Message {
    id: string;
    text: string;
    sender: User;
    timestamp: string;
    isOwn: boolean;
  }
  
  export interface User {
    id: string;
    name: string;
    avatar: string;
    status?: string;
  }
  
  export interface Channel {
    id: string;
    name: string;
  }