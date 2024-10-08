export interface Topic {
    name: string;
    content: string;
    children: Topic[];
    tags?: string[];
    uniqueId?: string;
}

export interface Roadmap {
    title: string;
    description: string;
    type: string;
    tags?: string[];
    members?: string[];
    creatorId?: string;
    topics: Topic;
    createdAt?: Date;
    updatedAt?: Date;
    id: string;
    uniqueId?: string;
}

export interface Rect {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    uniqueId: string;
}

export interface ConnectionType {
    from: string;
    to: string;
    style: "straight" | "curved";
}