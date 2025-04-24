'use client';

import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Loader2 } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchTrendingArticles } from '@/redux/home/home.slice';
import {
  selectTrendingArticles,
  selectIsLoadingTrendingArticles,
} from '@/redux/home/home.selectors';
import Button from '@/components/shared/Button';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SkeletonCard = () => (
  <Card className="flex min-h-[305px] flex-col bg-lightGray border dark:border-gray-700">
    <CardHeader className="pb-2">
      <Skeleton className="h-6 w-3/4 mb-2 rounded-xl bg-slate-300" />
    </CardHeader>
    <CardContent className="flex-grow p-3">
      {[5 / 6, 1, 4 / 5, 3 / 4].map((width, i) => (
        <Skeleton
          key={i}
          className={`h-4 mb-2 rounded-xl bg-slate-300`}
          style={{ width: `${width * 100}%` }}
        />
      ))}
    </CardContent>
    <CardFooter className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between w-full">
        <Skeleton className="h-4 w-1/3 rounded-xl bg-slate-300" />
        <Skeleton className="h-4 w-1/4 rounded-xl bg-slate-300" />
      </div>
    </CardFooter>
  </Card>
);

const ArticleCard = ({ article }: { article: any }) => {
  const sanitizedContent = { __html: DOMPurify.sanitize(article.content) };

  return (
    <Card className="flex min-h-[305px] flex-col bg-white dark:bg-gray-800 dark:text-white border-none hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardHeader className="pb-2">
        <h3 className="text-xl font-semibold text-text mb-2 line-clamp-2">
          {article.name}
        </h3>
      </CardHeader>
      <CardContent className="flex-grow p-3 overflow-auto max-h-[380px]">
        <h4 className="text-lg font-medium text-text3 mb-2">
          {article.question}
        </h4>
        <div
          className="text-text3"
          dangerouslySetInnerHTML={sanitizedContent}
        />
      </CardContent>
      <CardFooter className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm text-text3 w-full">
          <span className="truncate max-w-[50%]">{article.author}</span>
          <span>{article.date}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

const TrendingArticles = () => {
  const dispatch = useAppDispatch();
  const articles = useAppSelector(selectTrendingArticles);
  const isLoading = useAppSelector(selectIsLoadingTrendingArticles);
  const [count, setCount] = useState(6);

  useEffect(() => {
    dispatch(fetchTrendingArticles(count));
  }, [dispatch, count]);

  const handleLoadMore = () => setCount((prev) => prev + 6);

  const renderCards = () => {
    if (isLoading) {
      return Array.from({ length: count }, (_, i) => <SkeletonCard key={i} />);
    }

    return articles.map((article, i) => (
      <ArticleCard key={i} article={article} />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto sm:p-8 md:bg-gray-100">
      <h2 className="text-2xl font-bold mb-8 text-text3">Trending Articles</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderCards()}
      </div>

      <div className="flex justify-center mt-16">
        <Button
          isLoading={isLoading}
          onClick={handleLoadMore}
          disabled={isLoading}
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300"
        >
          Load More
        </Button>
      </div>
    </div>
  );
};

export default TrendingArticles;
