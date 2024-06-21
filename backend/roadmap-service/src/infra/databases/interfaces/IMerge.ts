import { Document, Types } from 'mongoose';

interface IMerge extends Document {
    contributedDocument: {
        id: Types.ObjectId;
        data: {
            content: string;
        };
    };
}

export { IMerge };
