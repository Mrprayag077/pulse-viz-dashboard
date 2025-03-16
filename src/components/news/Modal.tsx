import { Article } from "@/app/news/page";
import React from "react";

interface ModalProps {
  selectedArticle: Article;
  closeArticle: () => void;
}

const Modal = ({ selectedArticle, closeArticle }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-gray-800/70 bg-opacity-70 flex items-center justify-center p-4 z-50">
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
              {new Date(selectedArticle.publishedAt).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
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
  );
};

export default Modal;
