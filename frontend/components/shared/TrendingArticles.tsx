import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/useDarkMode";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import apiClient from "@/api/apiClient";
import DOMPurify from "dompurify";

const TrendingArticles = () => {
  const { isDarkMode } = useDarkMode();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(6);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await apiClient(
        `/recommendation/random-topics?count=${count}`
      );
      console.log("response trending : ", response);
      setArticles((prevArticles) => [...response.data]);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [count]);

  const handleLoadMore = () => {
    setCount((prev) => prev + 6);
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  return (
    <div
      className={`max-w-6xl mx-auto  sm:p-8 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-8 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Trending Articles
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {articles.map((article, index) => (
          <Card
            key={index}
            className={`flex min-h-[305px] flex-col ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white"
            } hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
          >
            <CardHeader className="pb-2">
              <h3
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mb-2 line-clamp-2`}
              >
                {article.name}
              </h3>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto max-h-[180px]">
              <h4
                className={`text-lg font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                } mb-2`}
              >
                {article.question}
              </h4>
              <div
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } article-content`}
                dangerouslySetInnerHTML={createMarkup(article.content)}
              />
            </CardContent>
            <CardFooter className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <div
                className={`flex items-center justify-between text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } w-full`}
              >
                <span className="truncate max-w-[50%]">{article.author}</span>
                <span>{article.date}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-16">
        <Button
          onClick={handleLoadMore}
          disabled={loading}
          variant={isDarkMode ? "outline" : "default"}
          className={`${
            isDarkMode
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } transition-colors duration-300`}
        >
          {loading ? "Loading..." : "Load more"}
        </Button>
      </div>
    </div>
  );
};

export default TrendingArticles;
