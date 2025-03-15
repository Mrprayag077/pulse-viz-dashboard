"use client";

import { RepoCard } from "@/components";
import { fetchCommits, fetchContributors, fetchRepoData } from "@/utils";
import { useEffect, useState } from "react";

export default function Home() {
  const [repo, setRepo] = useState<any>(null);
  const [commits, setCommits] = useState([]);
  const [contributors, setContributors] = useState([]);

  const repoName = "Mrprayag077/Mrprayag077";

  useEffect(() => {
    const fetchData = async () => {
      const repoData = await fetchRepoData(repoName);
      const commitData = await fetchCommits(repoName);
      const contributorData = await fetchContributors(repoName);

      setRepo(repoData);
      setCommits(commitData);
      setContributors(contributorData);
    };

    fetchData();
  }, []);

  if (!repo) return <p>Loading...</p>;

  return (
    <div className="flex-1 m-2 p-10 overflow-auto bg-gray-50 text-gray-800 rounded-2xl">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900">
        🚀 GitHub Repo Analytics
      </h1>

      {/* Repo Overview */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-2xl font-semibold">{repo.name}</h2>
        <p className="text-gray-600">{repo.description}</p>
      </div>

      {/* Recent Commits */}
      <h2 className="mt-10 text-2xl font-bold">Recent Commits</h2>
      <ul className="space-y-4 mt-4">
        {commits.slice(0, 5).map((commit: any, index) => (
          <li key={index} className="p-4 bg-white rounded-lg shadow-md">
            <p>{commit.commit.message}</p>
            <span className="text-sm text-gray-500">
              By {commit.commit.author.name}
            </span>
          </li>
        ))}
      </ul>

      {/* Contributors */}
      <h2 className="mt-10 text-2xl font-bold">Contributors</h2>
      <div className="grid grid-cols-3 gap-6 mt-4">
        {contributors.map((contributor: any, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg flex items-center gap-4 shadow-md hover:scale-105 transition-transform"
          >
            <img
              src={contributor.avatar_url}
              alt="avatar"
              className="w-12 h-12 rounded-full border-2 border-gray-200"
            />
            <a
              href={contributor.html_url}
              target="_blank"
              className="text-blue-600 hover:underline font-medium"
            >
              {contributor.login}
            </a>
          </div>
        ))}
      </div>

      {/* Portfolio Section */}
      <h2 className="mt-16 text-2xl font-bold">🔗 My Portfolio & Projects</h2>
      <div className="p-6 bg-white rounded-xl mt-6 shadow-md">
        <p className="text-gray-700">
          As I cannot share private repositories, explore my public work and
          achievements on my portfolio:
        </p>
        <a
          href="https://mrprayag-portfolio-2d915.web.app/"
          target="_blank"
          className="text-blue-500 underline mt-4 block"
        >
          Visit Portfolio 🚀
        </a>
      </div>
    </div>
  );
}
