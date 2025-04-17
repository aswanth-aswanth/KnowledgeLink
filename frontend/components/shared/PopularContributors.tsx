import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  selectContributors,
  selectContributorsLoading,
} from '@/store/home/home.selectors';
import { fetchContributors } from '@/store/home/home.slice';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function PopularContributors() {
  const dispatch = useAppDispatch();
  const contributors = useAppSelector(selectContributors);
  const isLoading = useAppSelector(selectContributorsLoading);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchContributors());
  }, [dispatch]);

  const ContributorSkeleton = () => (
    <div className="flex flex-col items-center text-center w-max">
      <Skeleton className="bg-slate-300 h-20 w-20 rounded-full" />
      <Skeleton className="rounded-xl bg-slate-300 h-4 w-24 mt-2" />
      <Skeleton className="rounded-xl bg-slate-300 h-3 w-32 mt-2" />
    </div>
  );

  return (
    <>
      <p className="text-text font-medium text-lg mt-6 mb-8">Popular writers</p>
      <div
        className="flex gap-8 sm:gap-12 md:gap-28 max-w-[1224px] overflow-x-auto py-8 bg-background text-text2"
        style={{ scrollbarWidth: 'none' }}
      >
        {isLoading
          ? Array(5)
              .fill(0)
              .map((_, index) => <ContributorSkeleton key={index} />)
          : contributors?.map((contributor: any, index: number) => (
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
