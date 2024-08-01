import Roadmap from "../../infra/databases/mongoose/models/Roadmap";
import { File as FormidableFile } from 'formidable';
import RectanglesData from "../../infra/databases/mongoose/models/Rectangles";
import ConnectionsData from "../../infra/databases/mongoose/models/Connections";
import { IRoadmap, IRectanglesData, ITopic, IMedia, IConnectionsData } from "../../infra/databases/interfaces/IRoadmap";
import S3Service from '../../infra/services/S3Service';

export default class RoadmapRepository {
    private s3Service: S3Service;

    constructor() {
        this.s3Service = new S3Service();
    }

    public async create(
        roadmap: IRoadmap,
        rectanglesData: IRectanglesData,
        connectionsData: IConnectionsData,
        files: FormidableFile[]
    ): Promise<IRoadmap> {
        try {
            const uploadPromises = files.map(file => {
                const folder = file.mimetype?.startsWith('image') ? 'images' : 'videos';
                return this.s3Service.uploadFile(file, folder);
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            // Update the content of the roadmap with the S3 URLs and collect media info
            const mediaInfo = this.updateContentWithS3Urls(roadmap.topics, uploadedUrls, files);

            // Add media information to the roadmap
            roadmap.media = mediaInfo;

            const newRoadmap = new Roadmap(roadmap);
            const savedRoadmap = await newRoadmap.save();

            const newRectanglesData = new RectanglesData(rectanglesData);
            await newRectanglesData.save();

            const newConnectionsData = new ConnectionsData(connectionsData);
            await newConnectionsData.save();

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

    private updateContentWithS3Urls(topics: ITopic, uploadedUrls: string[], files: FormidableFile[]): IMedia[] {
        const mediaInfo: IMedia[] = [];

        const replaceUrlsAndCollectMedia = (topic: ITopic) => {
            if (topic.content) {
                uploadedUrls.forEach((url, index) => {
                    const placeholder = `{{MEDIA_${topic.uniqueId}_${index}}}`;
                    if (topic.content.includes(placeholder)) {
                        topic.content = topic.content.replace(placeholder, url);
                        if (topic.uniqueId) {  // Check if uniqueId exists
                            mediaInfo.push({
                                type: files[index].mimetype || 'unknown',
                                url: url,
                                topicId: topic.uniqueId
                            });
                        }
                    }
                });
            }

            if (topic.children) {
                topic.children.forEach(replaceUrlsAndCollectMedia);
            }
        };

        replaceUrlsAndCollectMedia(topics);

        return mediaInfo;
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

    public async findRoadmaps(): Promise<IRoadmap[]> {
        try {
            return await Roadmap.find()
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

    public async findRoadmapMembers(roadmapId: string): Promise<string[]> {
        try {
            const roadmap = await Roadmap.findById(roadmapId).select('members').exec();
            return roadmap ? roadmap.members : [];
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding roadmap members: ${error.message}`);
                throw new Error('Failed to find roadmap members');
            } else {
                console.error('Unknown error finding roadmap members');
                throw new Error('Unknown error');
            }
        }
    }

    public async getRoadmapsByMember(userId: string): Promise<any[]> {
        try {
            const roadmaps = await Roadmap.find({
                type: { $in: ['expert_collaboration', 'moderator_submission'] },
                members: userId
            }).select('_id title description type members');
            return roadmaps;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error finding roadmaps by member: ${error.message}`);
                throw new Error('Failed to find roadmaps by member');
            } else {
                console.error('Unknown error finding roadmaps by member');
                throw new Error('Unknown error');
            }
        }
    }

    public async findRectanglesByRoadmapId(roadmapId: string): Promise<any> {
        try {
            return await RectanglesData.findOne({ roadmapUniqueId: roadmapId }).exec();
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
    public async findConnectionsByRoadmapId(roadmapId: string): Promise<any> {
        try {
            return await ConnectionsData.findOne({ roadmapUniqueId: roadmapId }).exec();
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
    /* public async findRoadmapWithDetails(roadmapId: string): Promise<IRoadmap | null> {
        const roadmap = await Roadmap.findById(roadmapId).exec();
        if (!roadmap) return null;

        const rectanglesData = await RectanglesData.findOne({ roadmapUniqueId: roadmap.uniqueId }).exec();
        const connectionsData = await ConnectionsData.findOne({ roadmapUniqueId: roadmap.uniqueId }).exec();

        return {
            ...roadmap.toObject(),
            rectanglesData,
            connectionsData
        };
    } */
}
