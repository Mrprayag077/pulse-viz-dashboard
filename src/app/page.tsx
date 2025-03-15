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
    <div className="min-h-full overflow-auto p-10 bg-gray-900 rounded-2xl text-white">
      <h1 className="text-3xl font-bold">GitHub Repo Analytics</h1>

      <RepoCard repo={repo} />

      {/* Commit History */}
      <h2 className="mt-10 text-2xl font-semibold">Recent Commits</h2>
      <ul className="space-y-4 mt-4">
        {commits.slice(0, 5).map((commit: any, index) => (
          <li key={index} className="p-4 bg-gray-800 rounded-lg">
            <p>{commit.commit.message}</p>
            <span className="text-sm text-gray-400">
              By {commit.commit.author.name}
            </span>
          </li>
        ))}
      </ul>

      {/* Contributors */}
      <h2 className="mt-10 text-2xl font-semibold">Contributors</h2>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {contributors.map((contributor: any, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800 rounded-lg flex items-center gap-4"
          >
            <img
              src={contributor.avatar_url}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <a
              href={contributor.html_url}
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              {contributor.login}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
