export type Tab = {
  name: string;
  icon: string;
  dbName?: string;
};
export type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (tabName: string, dbName: string) => void;
  tabFor: string;
};


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
  chatId: string;
  content: string;
  sender: User;
  createdAt: string;
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

export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  imageUrl?: string;
  bio?: string;
  role?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
