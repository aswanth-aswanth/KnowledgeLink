import { Request, Response } from 'express';
import DeleteComment from '../../../app/useCases/DeleteComment';
import PostRepository from '../../../app/repositories/PostRepository';

export default class DeleteCommentController {
    public async handle(req: any, res: Response) {
        try {
            const email = req.user.email;
            const commentId = req.body.commentId;
            console.log("CommentId : ", commentId);
            const deleteComment = new DeleteComment(
                new PostRepository()
            );
            const result = await deleteComment.execute(commentId, email);
            return res.status(201).json({ message: "Success" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Unknown error' });
        }
    }
};
