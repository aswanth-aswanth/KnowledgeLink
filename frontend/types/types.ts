// types.ts
export interface Topic {
    name: string;
    content: string;
    children: Topic[];
    progress?: number;
  }
  
  export interface Rect {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    progress: number;
  }
  
  export interface ConnectionType {
    from: string;
    to: string;
    style: "straight" | "curved";
  }