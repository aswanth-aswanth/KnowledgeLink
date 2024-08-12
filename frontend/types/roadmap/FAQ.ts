export interface FAQSectionProps {
    roadmapId: string;
    topicUniqueId: string;
    topicId: string;
}

export interface FAQ {
    _id: string;
    roadmapId: string;
    topicId: string;
    topicUniqueId: string;
    question: string;
    authorId: string;
    upvotes: string[];
    createdAt: string;
    updatedAt: string;
    answers: {
        _id: string;
        content: string;
        authorId: string;
        upvotes: string[];
        createdAt: string;
        updatedAt: string;
    }[];
}