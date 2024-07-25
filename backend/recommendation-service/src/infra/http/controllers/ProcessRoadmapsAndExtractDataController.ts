// src/infra/http/controllers/Roadmap/ProcessRoadmapsAndExtractDataController.ts

import { Request, Response } from "express";
import ProcessRoadmapsAndExtractData from "../../../app/useCases/Roadmap/ProcessRoadmapsAndExtractData";
import RoadmapRepository from "../../../app/repositories/RoadmapRepository";

export default class ProcessRoadmapsAndExtractDataController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const processRoadmapsAndExtractData = new ProcessRoadmapsAndExtractData(
            new RoadmapRepository()
        );

        try {
            await processRoadmapsAndExtractData.execute();
            return res.status(200).json({ message: "Roadmaps processed and data extracted successfully" });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Unknown error' });
        }
    }
}