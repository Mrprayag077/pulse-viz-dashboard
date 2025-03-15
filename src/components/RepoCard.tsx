import { Star, GitCommit, Users } from "lucide-react";

interface RepoCardProps {
  repo: any;
}

const RepoCard = ({ repo }: RepoCardProps) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-bold">{repo.name}</h2>
      <p className="text-gray-400">{repo.description}</p>
      <div className="flex justify-between text-sm">
        <span className="flex items-center gap-2">
          <Star size={16} /> {repo.stargazers_count} Stars
        </span>
        <span className="flex items-center gap-2">
          <GitCommit size={16} /> {repo.forks_count} Forks
        </span>
        <span className="flex items-center gap-2">
          <Users size={16} /> {repo.watchers_count} Watchers
        </span>
      </div>
      <a
        href={repo.html_url}
        target="_blank"
        className="text-blue-500 hover:underline"
      >
        View Repository →
      </a>
    </div>
  );
};

export default RepoCard;
