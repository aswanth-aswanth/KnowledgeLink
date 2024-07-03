import { Request, Response } from "express";
import GetDiagram from "../../../../app/useCases/Roadmap/GetDiagram";
import RoadmapRepository from "../../../../app/repositories/RoadmapRepository";

export default class GetDiagramController {
    public async handle(req: any, res: Response) {
        const { id } = req.params;

        const getDiagram = new GetDiagram(
            new RoadmapRepository()
        );

        try {
            const diagram = await getDiagram.execute(id);
            return res.json(diagram);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}