import apiClient from '../apiClient';

export const fetchRoadmapData = async (id: string) => {
    const response = await apiClient(`/roadmap/${id}`);
    return response.data;
};

export const fetchDiagramData = async (roadmapData: any) => {
    const response = await apiClient(`/roadmap/diagram/${roadmapData.uniqueId}`);
    return response.data;
};

export const submitRoadmapContribution = async (roadmapId: string, contributionData: any) => {
    const response = await apiClient.post(`/roadmap/${roadmapId}/contribute`,
        contributionData);
    return response.data;
};