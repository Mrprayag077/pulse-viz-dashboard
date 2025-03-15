"use client";

import { RepoCard } from "@/components";
import { AchievementsGrid, ProjectCard, projects } from "@/components/RepoCard";
import { fetchCommits, fetchContributors, fetchRepoData } from "@/utils";
import {
  Activity,
  Award,
  Code,
  ExternalLink,
  Folder,
  GitBranch,
  Star,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [repo, setRepo] = useState<any>(null);
  const [commits, setCommits] = useState([]);
  const [contributors, setContributors] = useState([]);

  const repoName = "Mrprayag077/Mrprayag077";

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("https://api.github.com/users/Mrprayag077")
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error("Error fetching profile data:", error));
  }, []);

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
    <div className="min-h-screen p-10 bg-gradient-to-br from-gray-900 rounded-xl to-gray-800 text-white">
      <section className="mb-10">
        <div className="animate-fadeIn">
          <div className="mb-10 p-6 bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <p className="text-gray-300 mb-4">
              I'm a full-stack developer specializing in modern web technologies
              and cloud solutions. With 5+ years of experience building scalable
              applications, I focus on creating clean, efficient, and
              user-friendly solutions to complex problems.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm py-1 px-3 bg-blue-500/20 rounded-full text-blue-300">
                React
              </span>
              <span className="text-sm py-1 px-3 bg-blue-500/20 rounded-full text-blue-300">
                Next.js
              </span>
              <span className="text-sm py-1 px-3 bg-blue-500/20 rounded-full text-blue-300">
                Node.js
              </span>
              <span className="text-sm py-1 px-3 bg-blue-500/20 rounded-full text-blue-300">
                TypeScript
              </span>
              <span className="text-sm py-1 px-3 bg-blue-500/20 rounded-full text-blue-300">
                AWS
              </span>
              <span className="text-sm py-1 px-3 bg-blue-500/20 rounded-full text-blue-300">
                PostgreSQL
              </span>
            </div>
          </div>

          {profile && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4 mb-10">
                <div className="p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                  <h3 className="text-xl font-semibold text-gray-100">
                    Followers
                  </h3>
                  <p className="text-3xl text-blue-400">{profile.followers}</p>
                </div>
                <div className="p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                  <h3 className="text-xl font-semibold text-gray-100">
                    Following
                  </h3>
                  <p className="text-3xl text-blue-400">{profile.following}</p>
                </div>
                <div className="p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                  <h3 className="text-xl font-semibold text-gray-100">
                    Public Repos
                  </h3>
                  <p className="text-3xl text-blue-400">
                    {profile.public_repos}
                  </p>
                </div>
                <div className="p-6 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                  <h3 className="text-xl font-semibold text-gray-100">
                    Public Gists
                  </h3>
                  <p className="text-3xl text-blue-400">
                    {profile.public_gists}
                  </p>
                </div>
              </div>
          )}

          {/* Projects */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Code size={20} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Featured Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Award size={20} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold">Achievements</h2>
            </div>

            <div className="space-y-4">
              <AchievementsGrid />
            </div>
          </div>

          <div className="p-5">
            <p>
              View my complete portfolio on{" "}
              <a
                href="https://prayag-bhosale.web.app"
                className="text-blue-400 hover:underline"
              >
                https://prayag-bhosale.web.app
              </a>
            </p>
          </div>
        </div>
      </section>

      <header className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Example: GitHub Repo Analytics
        </h1>
        <p className="mt-2 text-gray-300">
          Insights into your repository activity
        </p>
      </header>

      <div className="mb-10">
        <RepoCard repo={repo} />
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-100">
          Recent Commits
        </h2>
        <ul className="space-y-3">
          {commits.slice(0, 5).map((commit: any, index) => (
            <li
              key={index}
              className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <p className="text-gray-100">{commit.commit.message}</p>
              <span className="text-sm text-gray-400">
                By {commit.commit.author.name}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-100">
          Contributors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contributors.map((contributor: any, index) => (
            <div
              key={index}
              className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-4"
            >
              <img
                src={contributor.avatar_url}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <a
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                {contributor.login}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const GitHubStats = () => (
  <section className="mb-10">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <StatCard icon={<User size={24} />} label="Followers" value="120" />
      <StatCard
        icon={<GitBranch size={24} />}
        label="Repositories"
        value="35"
      />
      <StatCard icon={<Activity size={24} />} label="Commits" value="1.2k" />
      <StatCard icon={<Star size={24} />} label="Stars" value="450" />
    </div>
  </section>
);

const StatCard = ({ icon, label, value }: any) => (
  <div className="p-6 bg-gray-800/50 rounded-xl flex items-center gap-4">
    <div className="text-blue-400">{icon}</div>
    <div>
      <h4 className="text-white text-lg font-semibold">{value}</h4>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  </div>
);
