export const fetchRepoData = async (repoName: string) => {
  const response = await fetch(`https://api.github.com/repos/${repoName}`);
  return response.json();
};

export const fetchCommits = async (repoName: string) => {
  const response = await fetch(
    `https://api.github.com/repos/${repoName}/commits`
  );
  return response.json();
};

export const fetchContributors = async (repoName: string) => {
  const response = await fetch(
    `https://api.github.com/repos/${repoName}/contributors`
  );
  return response.json();
};
