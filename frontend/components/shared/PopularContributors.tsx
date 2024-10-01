import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import apiClient from '@/api/apiClient';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function PopularContributors() {
  const [contributors, setContributors] = useState<any | []>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isDarkMode } = useDarkMode();

  const getUsers = async () => {
    try {
      const res = await apiClient.get('/profile/users');
      setContributors(res.data);
    } catch (error) {
      console.log('Error fetching contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const ContributorSkeleton = () => (
    <div className="flex flex-col items-center text-center w-max">
      <Skeleton className="bg-slate-300 h-20 w-20 rounded-full" />
      <Skeleton className="bg-slate-300 h-4 w-24 mt-2" />
      <Skeleton className="bg-slate-300 h-3 w-32 mt-2" />
    </div>
  );

  return (
    <>
      <p className="dark:text-white font-medium text-lg mt-6 mb-8">
        Popular writers
      </p>
      <div
        className={`flex gap-8 sm:gap-12 md:gap-28 max-w-[1224px] overflow-x-auto py-8 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
        style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
      >
        {loading
          ? Array(5)
              .fill(0)
              .map((_, index) => <ContributorSkeleton key={index} />)
          : contributors.map((contributor: any, index: string) => (
              <div
                key={index}
                className="flex flex-col items-center text-center w-max"
              >
                <div
                  onClick={() => router.push(`/profile/${contributor._id}`)}
                  className="h-20 w-20 rounded-full flex justify-center items-center border-4 border-gray-300 overflow-hidden"
                >
                  <Avatar className="h-full w-full cursor-pointer">
                    <AvatarImage
                      src={contributor.image || `/defaultUserImage.png`}
                      alt={contributor.username}
                    />
                    <AvatarFallback>
                      {contributor.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-2">
                  <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-nowrap mt-2">
                    {contributor.username}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">
                    {contributor.email}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </>
  );
}
