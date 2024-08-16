'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Tabs from '@/components/shared/Tabs';
import { Tab } from '@/types';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { CreatePostButton } from './CreatePostButton';
import { CreatePostModal } from '../../../components/forms/CreatePostModal';
import { PostFeed } from '../../../components/social/PostFeed';
import { ShortVideoUploadForm } from './ShortVideoUploadForm';
import { CreateShortButton } from './CreateShortButton';

const Following: React.FC = () => {
  const [activeTab] = useState<string>('Following');
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [isShortVideoModalOpen, setIsShortVideoModalOpen] =
    useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      router.push('/');
    }
  }, [token, router]);

  const tabs: Tab[] = [
    { name: 'Explore', icon: '🌎' },
    { name: 'Following', icon: '👥' },
  ];

  return (
    <Provider store={store}>
      <div className="-mt-14 md:-mt-2 pt-6 pb-8">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={(value: string) => {
            if (value === 'Explore') router.push('/');
          }}
          tabFor="explore"
        />
      </div>
      <div className="flex flex-col mb-6 items-center font-semibold gap-4 text-xs text-gray-700 dark:text-white mt-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2 items-center">
            <CreatePostButton onClick={() => setIsPostModalOpen(true)} />
            <p>Create a post</p>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <CreateShortButton onClick={() => setIsShortVideoModalOpen(true)} />
            <p>Add Short</p>
          </div>
        </div>
        <CreatePostModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
        />
        {isShortVideoModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Upload Short Video</h2>
              <ShortVideoUploadForm
                onClose={() => setIsShortVideoModalOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
      <PostFeed />
    </Provider>
  );
};

export default Following;
