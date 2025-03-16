"use client"
import { useEffect, useState } from "react";
import axios from "axios";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("technology");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = [
    "technology",
    "sports",
    "business",
    "health",
    "entertainment",
  ];

  const fetchNews = async () => {
    try {
      const response = await axios.get(
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

  const openArticle = (article) => setSelectedArticle(article);
  const closeArticle = () => setSelectedArticle(null);

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2 rounded-full capitalize ${
              category === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-200"
            } transition-all`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div
            key={index}
            onClick={() => openArticle(article)}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          >
            <img
              src={article.urlToImage || "https://via.placeholder.com/400x200"}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.description}
              </p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{article.source.name}</span>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {!loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedArticle.title}</h2>
                <button
                  onClick={closeArticle}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              <img
                src={
                  selectedArticle.urlToImage ||
                  "https://via.placeholder.com/800x400"
                }
                alt={selectedArticle.title}
                className="w-full h-64 object-cover mb-4 rounded-lg"
              />
              <p className="text-gray-700 mb-4">{selectedArticle.content}</p>
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Read full article →
              </a>
              <div className="mt-4 text-sm text-gray-500">
                <p>Source: {selectedArticle.source.name}</p>
                <p>
                  Published:{" "}
                  {new Date(selectedArticle.publishedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;