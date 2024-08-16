'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CiSquarePlus } from 'react-icons/ci';
import { Separator } from '@/components/ui/separator';
import RoadmapItems from './RoadmapItems';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/apiClient';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { PostCard } from '@/components/social/PostCard';

export default function page() {
  const router = useRouter();
  const [adminRoadmaps, setAdminRoadmaps] = useState([]);
  const [subscribedRoadmaps, setSubscribedRoadmaps] = useState([]);
  const [userMemberedRoadmaps, setUserMemberedRoadmaps] = useState([]);
  const { savedPosts, handleLike, handleComment } = useSavedPosts();

  const getAdminRoadmaps = async () => {
    try {
      const res = await apiClient('/roadmap/admin');
      console.log('Res : ', res.data);
      setAdminRoadmaps(res.data);
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const getUserSubscribedRoadmaps = async () => {
    try {
      const res = await apiClient('/roadmap/subscribed');
      console.log('Res : ', res.data);
      setSubscribedRoadmaps(res.data);
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const getUserMemberedRoadmaps = async () => {
    try {
      const res = await apiClient('/roadmap/member');
      console.log('Res user membered : ', res.data);
      setUserMemberedRoadmaps(res.data);
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  const handleUnsubscribe = (roadmapId: string) => {
    setSubscribedRoadmaps((prev: any) =>
      prev.filter((roadmap: any) => roadmap._id !== roadmapId)
    );
  };

  useEffect(() => {
    getAdminRoadmaps();
    getUserSubscribedRoadmaps();
    getUserMemberedRoadmaps();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-200">
      <h1 className="font-bold text-center text-2xl pt-20 mb-6 text-gray-800 dark:text-white">
        Created Roadmaps
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {adminRoadmaps.length > 0 ? (
          adminRoadmaps.map((roadmapItem: any) => (
            <div key={roadmapItem._id} className="w-full max-w-sm">
              <div className="p-6 bg-white dark:bg-gray-800  rounded-xl  shadow-lg transition-all duration-200 hover:shadow-xl">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                  {roadmapItem.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {roadmapItem.type}
                </p>
                <p className="mt-2 mb-4 text-sm text-gray-700 dark:text-gray-200">
                  {roadmapItem.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() =>
                      router.push(`/roadmap-viewer/${roadmapItem._id}`)
                    }
                    className="bg-lime-600 hover:bg-lime-700 text-white text-xs px-3 py-2 rounded-[4px] transition-colors duration-200"
                  >
                    View Roadmap
                  </Button>
                  <Button
                    onClick={() =>
                      router.push(`/contributions/${roadmapItem._id}`)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded-[4px] transition-colors duration-200"
                  >
                    Merge Contributions
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-800 dark:text-white">
            You haven't created any roadmaps yet.
          </p>
        )}
      </div>
      <div
        onClick={() => router.push('/create-roadmap')}
        className="flex justify-center flex-col items-center mt-10 cursor-pointer"
      >
        <CiSquarePlus className="text-5xl text-gray-400 dark:text-gray-500 transition-colors duration-200" />
        <p className="text-base font-bold text-gray-800 dark:text-white mt-4">
          Create Roadmap
        </p>
      </div>
      <Separator className="my-10 bg-gray-200 dark:bg-gray-700" />
      <h1 className="font-bold text-center text-2xl mt-20 mb-6 text-gray-800 dark:text-white">
        Subscribed Roadmaps
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {subscribedRoadmaps.length > 0 ? (
          subscribedRoadmaps.map((card: any) => (
            <div
              key={card._id}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <RoadmapItems
                title={card.title}
                description={card.description}
                likes={card.likes}
                id={card._id}
                onUnsubscribe={handleUnsubscribe}
              />
            </div>
          ))
        ) : (
          <p className="w-full text-center text-gray-800 dark:text-white">
            You haven't subscribed to any roadmaps yet.
          </p>
        )}
      </div>
      <Separator className="my-10 bg-gray-200 dark:bg-gray-700" />
      <h1 className="font-bold text-center text-2xl mt-20 pb-6 text-gray-800 dark:text-white">
        Membered roadmaps
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {userMemberedRoadmaps.length > 0 ? (
          userMemberedRoadmaps.map((roadmapItem: any) => (
            <div key={roadmapItem._id} className="w-full max-w-sm">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                  {roadmapItem.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {roadmapItem.type}
                </p>
                <p className="mt-2 mb-4 text-sm text-gray-700 dark:text-gray-200">
                  {roadmapItem.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() =>
                      router.push(`/roadmap-viewer/${roadmapItem._id}`)
                    }
                    className="bg-lime-600 hover:bg-lime-700 text-white text-xs px-3 py-2 rounded-[4px] transition-colors duration-200"
                  >
                    View Roadmap
                  </Button>
                  <Button
                    onClick={() =>
                      router.push(`/contribute-roadmap/${roadmapItem._id}`)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 rounded-[4px] py-2 transition-colors duration-200"
                  >
                    Contribute
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-800 dark:text-white">
            You've not been a member of any roadmap yet.
          </p>
        )}
      </div>
      <Separator className="my-10 bg-gray-200 dark:bg-gray-700" />
      <h1 className="font-bold text-center text-2xl mt-20 pb-6 text-gray-800 dark:text-white">
        Favourites
      </h1>
      <div className="space-y-6 flex flex-col items-center mx-auto">
        {savedPosts.length > 0 ? (
          savedPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        ) : (
          <p className="text-center text-gray-800 dark:text-white">
            You haven't saved any posts yet.
          </p>
        )}
      </div>
    </div>
  );
}
