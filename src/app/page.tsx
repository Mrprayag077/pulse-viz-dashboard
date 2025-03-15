"use client";

import { RepoCard } from "@/components";
import { fetchCommits, fetchContributors, fetchRepoData } from "@/utils";
import { Award, Code, ExternalLink, Folder } from "lucide-react";
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
    <div className="min-h-screen p-10 bg-gradient-to-br from-gray-900 rounded-xl to-gray-800 text-white">
      {/*  */}
      <section className="mb-10">
        <div className="animate-fadeIn">
          {/* About Me */}
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
              <AchievementsGrid  />
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
      {/*  */}

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          GitHub Repo Analytics
        </h1>
        <p className="mt-2 text-gray-300">
          Insights into your repository activity
        </p>
      </header>

      {/* Repo Card */}
      <div className="mb-10">
        <RepoCard repo={repo} />
      </div>

      {/* Recent Commits */}
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

      {/* Contributors */}
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

const projects = [
  {
    name: "E-Commerce Platform",
    description:
      "Built a full-stack e-commerce solution with React, Node.js and MongoDB",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Redux"],
    link: "https://github.com/username/ecommerce",
  },
  {
    name: "AI Content Generator",
    description:
      "A machine learning-powered tool for generating marketing content",
    technologies: ["Python", "TensorFlow", "Flask", "AWS"],
    link: "https://github.com/username/ai-content-generator",
  },
  {
    name: "Finance Dashboard",
    description: "Interactive financial data visualization dashboard",
    technologies: ["Next.js", "TypeScript", "D3.js", "Tailwind CSS"],
    link: "https://github.com/username/finance-dashboard",
  },
];

const achievements = [
  {
    title: "Open Source Contributor",
    description: "Top 10 contributor to React-Query with 12+ merged PRs",
  },
  {
    title: "Hackathon Winner",
    description:
      "First place at DevFest 2023 - Built an AI-powered accessibility tool",
  },
  {
    title: "AWS Certified Developer",
    description:
      "Associate level certification with specialization in serverless architecture",
  },
];

// Project card component
const ProjectCard = ({ project }: any) => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg hover:shadow-blue-900/20 transition-all duration-300 border border-gray-800 hover:border-blue-500/30 group">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Folder className="text-blue-400" size={20} />
        </div>
        <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
          {project.name}
        </h3>
      </div>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-blue-400 transition-colors"
      >
        <ExternalLink size={18} />
      </a>
    </div>
    <p className="text-gray-400 text-sm mb-4">{project.description}</p>
    <div className="flex flex-wrap gap-2">
      {project.technologies.map((tech: any, i: any) => (
        <span
          key={i}
          className="text-xs py-1 px-2 bg-gray-700/70 rounded-full text-gray-300"
        >
          {tech}
        </span>
      ))}
    </div>
  </div>
);

const AchievementCard = ({ achievement }: any) => (
  <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
    <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
      <Award className="text-purple-400" size={20} />
    </div>
    <div>
      <h3 className="font-medium text-white">{achievement.title}</h3>
      <p className="text-gray-400 text-sm mt-1">{achievement.description}</p>
    </div>
  </div>
);

const AchievementsGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {achievements.map((achievement: any, index: number) => (
      <AchievementCard key={index} achievement={achievement} />
    ))}
  </div>
);
