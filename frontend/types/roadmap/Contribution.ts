export interface Contribution {
    _id: string;
    roadmapId: string;
    contributedDocumentIds: string[];
    contributorEmail: string;
    contributions: {
        id: string;
        content: {
            data: string;
        };
    }[];
}