import {
  Star,
  GitCommit,
  Users,
  Award,
  ExternalLink,
  Folder,
} from "lucide-react";

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

export const projects = [
  {
    name: "Vacation Tracker: leaves planning and management",
    description:
      "Built a vacation tracking system from scratch with user and admin views, with easy leave management and analytics to streamline internal operations.",
    technologies: [
      "React",
      "Redux",
      "Typescript",
      "Vite",
      "MUI",
      "TailwindCSS",
      "AWS",
      "CDK",
      "AzurePipeline",
      "Ionic",
      "PostMan",
    ],
    link: "https://prayag-bhosale.web.app/?projectid=1",
  },
  {
    name: "Disaster Management & Climate Change",
    description:
      "Built a web & mobile app for real-time disaster alerts, data visualization & gov strategy, winning multiple hackathons.",
    technologies: [
      "Html",
      // "Ejs",
      // "Ajax",
      "Leaflet",
      "NodeJS",
      // "MVC",
      "ChartJS",
      "MongoDB",
    ],
    link: "https://prayag-bhosale.web.app/?projectid=2",
  },
  {
    name: "LinkedIn Automation Tool",
    description:
      "Automated LinkedIn networking with personalized requests, secure auth, and Dockerized deployment for scalability & privacy.",
    technologies: [
      "NodeJS",
      "Express",
      // "Express-Session",
      // "WebScrapping",
      "MongoDB",
      // "Crypto",
      // "Cors",
      "Docker",
    ],
    link: "https://prayag-bhosale.web.app/?projectid=3",
  },
];

const achievements = [
  {
    title: "SMART INDIA HACKATHON",
    description:
      "Developed a real-time disaster management app for alerts, climate risk assessments & community collaboration to enhance resilience.",
  },
  {
    title: "GOOGLE WOW HACKATHON",
    description:
      "Won Google WOW Hackathon 2023 with an AI-driven disaster management project, tackling climate action and making a strong impact in the competition.",
  },
  {
    title: "Girl Script Summer of Code",
    description:
      "GirlScript Summer of Code is a 3 - month long #OpenSource  program by GirlScript Foundation. 20th May - 10th August 2023.",
  },
];

export const ProjectCard = ({ project }: any) => (
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

export const AchievementsGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {achievements.map((achievement: any, index: number) => (
      <div
        key={index}
        className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700"
      >
        <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
          <Award className="text-purple-400" size={20} />
        </div>
        <div>
          <h3 className="font-medium text-white">{achievement.title}</h3>
          <p className="text-gray-400 text-sm mt-1">
            {achievement.description}
          </p>
        </div>
      </div>
    ))}
  </div>
);
