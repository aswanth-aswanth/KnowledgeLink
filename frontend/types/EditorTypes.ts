export interface Topic {
    name: string;
    content: string;
    children: Topic[];
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