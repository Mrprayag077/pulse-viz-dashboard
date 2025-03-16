"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

        {/* News Grid */}
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
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
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
              className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center font-medium"
            >
              <span>Load More</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center mt-12">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Loading...</span>
            </div>
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p className="mt-4 text-gray-600">
              No articles found. Try another category.
            </p>
          </div>
        )}

        {selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div
              className="bg-white rounded-2xl max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={
                    selectedArticle.urlToImage ||
                    "https://th.bing.com/th/id/OIP.qISjQuz0VsrKxe81_sA7twHaHa"
                  }
                  alt={selectedArticle.title}
                  className="w-full h-72 object-cover"
                />
                <button
                  onClick={closeArticle}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <div className="inline-block bg-indigo-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                    {selectedArticle.source.name}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {selectedArticle.title}
                  </h2>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span className="flex items-center mr-4">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {new Date(selectedArticle.publishedAt).toLocaleString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                  {selectedArticle.author && (
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {selectedArticle.author}
                    </span>
                  )}
                </div>
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {selectedArticle.description}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedArticle.content?.split("[+")[0] ||
                      "No content available."}
                  </p>
                </div>
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg font-medium"
                >
                  <span>Read full article</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
