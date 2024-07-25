import RoadmapRepository from '../../repositories/RoadmapRepository';
import UserInteractionRepository from '../../repositories/UserInteractionRepository';
import { ITopic } from '../../../infra/databases/interfaces/IRoadmap';
import { Types } from 'mongoose';

export default class GetPersonalizedTopics {
  private roadmapRepository: RoadmapRepository;
  private userInteractionRepository: UserInteractionRepository;

  constructor(
    roadmapRepository: RoadmapRepository,
    userInteractionRepository: UserInteractionRepository
  ) {
    this.roadmapRepository = roadmapRepository;
    this.userInteractionRepository = userInteractionRepository;
  }

  public async execute(userId: string, count: number): Promise<any[]> {
    try {
      const userInteractions = await this.userInteractionRepository.findByUserId(userId);
      const roadmaps = await this.roadmapRepository.findAllRoadmaps();
      const allTopics: any[] = [];

      roadmaps.forEach(roadmap => {
        const flattenedTopics = this.flattenTopics(roadmap.topics, roadmap._id, roadmap.title);
        allTopics.push(...flattenedTopics);
      });

      const scoredTopics = this.scoreTopics(allTopics, userInteractions);
      return this.getTopScoredTopics(scoredTopics, count);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to get personalized topics: " + error.message);
      }
      throw new Error("Unknown error");
    }
  }

  private flattenTopics(topic: ITopic, roadmapId: Types.ObjectId, roadmapTitle: string): any[] {
    let flattened: any[] = [this.addRoadmapIdToTopic(topic, roadmapId, roadmapTitle)];

    if (topic.children && topic.children.length > 0) {
      for (let child of topic.children) {
        flattened = flattened.concat(this.flattenTopics(child, roadmapId, roadmapTitle));
      }
    }

    return flattened;
  }

  private addRoadmapIdToTopic(topic: ITopic, roadmapId: Types.ObjectId, roadmapTitle: string): any {
    return {
      _id: topic._id,
      name: topic.name,
      content: topic.content,
      uniqueId: topic.uniqueId,
      contributorId: topic.contributorId,
      tags: topic.tags,
      likes: topic.likes,
      roadmapId: roadmapId,
      roadmapTitle: roadmapTitle
    };
  }

  private scoreTopics(topics: any[], userInteractions: any[]): any[] {
    const interactionScores: {[key: string]: number} = {
      view: 1,
      like: 2,
      comment: 3
    };

    return topics.map(topic => {
      const score = userInteractions
        .filter(interaction => interaction.topicId.equals(topic._id))
        .reduce((sum, interaction) => sum + interactionScores[interaction.interactionType], 0);

      return { ...topic, score };
    });
  }

  private getTopScoredTopics(scoredTopics: any[], count: number): any[] {
    return scoredTopics
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }
}