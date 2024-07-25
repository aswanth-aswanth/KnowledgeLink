// src/app/useCases/Roadmap/SaveRoadmap.ts

import RoadmapRepository from "../../repositories/RoadmapRepository";
import { IRoadmap } from "../../../infra/databases/interfaces/IRoadmap";

export default class SaveRoadmap {
    private roadmapRepository: RoadmapRepository;

    constructor(roadmapRepository: RoadmapRepository) {
        this.roadmapRepository = roadmapRepository;
    }

    public async execute(roadmapData: IRoadmap): Promise<IRoadmap> {
        try {
            const savedRoadmap = await this.roadmapRepository.create(roadmapData);
            console.log(`Roadmap saved in recommendation service: ${savedRoadmap._id}`);
            return savedRoadmap;
        } catch (error) {
            console.error('Failed to save roadmap in recommendation service:', error);
            throw error;
        }
    }
}