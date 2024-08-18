export type CardProps = {
    title: string;
    description: string;
    likes: number;
    id: string;
    onUnsubscribe?:(roadmapId:string)=>void;
};