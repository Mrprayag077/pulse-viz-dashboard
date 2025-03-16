"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "@/components/news/Modal";
import { Calendar, ChevronDown, LoaderCircle, Newspaper } from "lucide-react";
import { Loading } from "@/components";

// Define TypeScript interfaces
interface Source {
  id: string | null;
  name: string;
}

export interface Article {
  source: Source;
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<string>("technology");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories: string[] = [
    "technology",
    "sports",
    "business",
    "health",
    "entertainment",
  ];

  const fetchNews = async (): Promise<void> => {
    try {
      const response = await axios.get<NewsApiResponse>(
        `https://newsapi.org/v2/everything?q=${category}&pageSize=10&page=${page}&sortBy=popularity&apiKey=7515284b44a1404a9a0ff5de260b0f02`
      );
      setArticles((prev) => [...prev, ...response.data.articles]);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch news. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    setArticles([]);
    setPage(1);
    fetchNews();
  }, [category]);

  useEffect(() => {
    if (page > 1) fetchNews();
  }, [page]);

  const openArticle = (article: Article): void => setSelectedArticle(article);
  const closeArticle = (): void => setSelectedArticle(null);

  if (loading) return <Loading />;

  if (error) return <div className="p-4 text-red-500 font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Latest News
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the most recent stories from around the world
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2.5 rounded-full capitalize font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${
                category === cat
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-300"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article, index) => (
            <div
              key={`${article.title}-${index}`}
              onClick={() => openArticle(article)}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
            >
              <div className="relative">
                <img
                  src={
                    article.urlToImage ||
                    "https://th.bing.com/th/id/OIP.qISjQuz0VsrKxe81_sA7twHaHa"
                  }
                  alt={article.title}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-3 left-3 bg-indigo-600 opacity-85 text-white text-xs px-2 py-1 rounded-full">
                  {article.source.name}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                  <span className="flex justify-center gap-1 items-center">
                    <Calendar className="text-gray-500 w-4 h-4" />
                    {new Date(article.publishedAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                  <span className="text-indigo-600 font-medium">Read more</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && articles.length > 0 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center font-medium"
            >
              <span>Load More</span>
              <ChevronDown className="ml-2 text-white w-5 h-5" />
            </button>
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="text-gray-500 w-5 h-6" />
            <p className="mt-4 text-gray-600">
              No articles found. Try another category.
            </p>
          </div>
        )}

        {selectedArticle && (
          <Modal
            selectedArticle={selectedArticle}
            closeArticle={closeArticle}
          />
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
