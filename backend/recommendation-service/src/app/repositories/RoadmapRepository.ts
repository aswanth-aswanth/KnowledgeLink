import Roadmap from "../../infra/databases/mongoose/models/Roadmap";
import { IRoadmap, IRectanglesData, ITopic, IMedia, IConnectionsData } from "../../infra/databases/interfaces/IRoadmap";

export default class RoadmapRepository {

    public async create(
        roadmap: IRoadmap,
    ): Promise<IRoadmap> {
        try {

            const newRoadmap = new Roadmap(roadmap);
            const savedRoadmap = await newRoadmap.save();

            return savedRoadmap;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error creating roadmap: ${error.message}`);
                throw new Error('Failed to create roadmap');
            } else {
                console.error('Unknown error creating roadmap');
                throw new Error('Unknown error');
            }
        }
    }

    public async findRoadmapById(roadmapId: string): Promise<IRoadmap | null> {
        try {
            console.log("RoadmapId from repository : ", roadmapId);
            return await Roadmap.findById(roadmapId).exec();
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding roadmap by ID: ${error.message}`);
                throw new Error('Failed to find roadmap by ID');
            } else {
                console.error('Unknown error finding roadmap by ID');
                throw new Error('Unknown error');
            }
        }
    }

    public async findRoadmapsByIds(ids: string[]): Promise<IRoadmap[]> {
        try {
            return await Roadmap.find({ _id: { $in: ids } })
                .select('_id title description type')
                .exec();
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding roadmaps by IDs: ${error.message}`);
                throw new Error('Failed to find roadmaps by IDs');
            } else {
                console.error('Unknown error finding roadmaps by IDs');
                throw new Error('Unknown error');
            }
        }
    }

    public async findRoadmapsByType(type: string): Promise<IRoadmap[]> {
        try {
            return await Roadmap.find({ type: { $in: type } })
                .select('_id title description type')
                .exec();
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding roadmaps by type: ${error.message}`);
                throw new Error('Failed to find roadmaps by type');
            } else {
                console.error('Unknown error finding roadmaps by type');
                throw new Error('Unknown error');
            }
        }
    }

    public async findRoadmapsByAdmin(userId: string): Promise<IRoadmap[]> {
        try {
            return await Roadmap.find({ creatorId: userId })
                .select('_id title description type')
                .exec();
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding roadmaps by admin: ${error.message}`);
                throw new Error('Failed to find roadmaps by admin');
            } else {
                console.error('Unknown error finding roadmaps by admin');
                throw new Error('Unknown error');
            }
        }
    }

    public async findAllRoadmaps(): Promise<IRoadmap[]> {
        try {
            return await Roadmap.find().exec();
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding all roadmaps: ${error.message}`);
                throw new Error('Failed to find all roadmaps');
            } else {
                console.error('Unknown error finding all roadmaps');
                throw new Error('Unknown error');
            }
        }
    }

}
