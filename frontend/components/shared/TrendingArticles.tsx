import React from "react";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/useDarkMode";

const trendingArticles = [
  {
    title: "The Future of Artificial Intelligence",
    hashtags: ["#AI", "#Future", "#Technology"],
    question: "What are the latest advancements in AI?",
    answer:
      "The field of artificial intelligence is rapidly evolving with new developments in machine learning, natural language processing, and robotics. These advancements are poised to transform various industries, from healthcare to finance.",
    author: "John Doe",
    date: "March 12, 2023",
  },
  {
    title: "The Rise of Sustainable Energy",
    hashtags: ["#Sustainability", "#Energy", "#Environment"],
    question: "How is renewable energy benefiting the environment?",
    answer:
      "Renewable energy sources like solar, wind, and hydroelectric power are reducing our dependence on fossil fuels, lowering greenhouse gas emissions, and providing a cleaner and more sustainable energy future.",
    author: "Jane Smith",
    date: "February 20, 2023",
  },
  {
    title: "The Impact of Social Media on Mental Health",
    hashtags: ["#SocialMedia", "#MentalHealth", "#Wellbeing"],
    question: "What are the effects of social media on mental health?",
    answer:
      "Social media can have both positive and negative effects on mental health. While it allows for connection and support, it can also lead to issues like anxiety, depression, and low self-esteem. It's important to use social media mindfully.",
    author: "Bob Johnson",
    date: "January 15, 2023",
  },
  {
    title: "The Future of Artificial Intelligence",
    hashtags: ["#AI", "#Future", "#Technology"],
    question: "What are the latest advancements in AI?",
    answer:
      "The field of artificial intelligence is rapidly evolving with new developments in machine learning, natural language processing, and robotics. These advancements are poised to transform various industries, from healthcare to finance.",
    author: "John Doe",
    date: "March 12, 2023",
  },
];

export default function TrendingArticles() {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {trendingArticles.map((article, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {article.title}
              </h3>
              {article.hashtags && (
                <div className="mb-2 flex flex-wrap">
                  {article.hashtags.map((hashtag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium text-blue-600 mr-2"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              )}
              <h4 className="text-lg font-medium text-gray-800 mb-1">
                {article.question}
              </h4>
              <p className="text-gray-700 mb-4">{article.answer}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t">
              <span>{article.author}</span>
              <span>{article.date}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-16">
        <Button
          variant="outline"
          className={`${isDarkMode ? "text-white" : "text-gray-800"}`}
        >
          Load more
        </Button>
      </div>
    </div>
  );
}
