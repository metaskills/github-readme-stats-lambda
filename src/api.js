const axios = require("axios");
const { renderError, kFormatter } = require("./utils");
const env = require('./env');

async function fetchStats() {
  const res = await axios({
    url: "https://api.github.com/graphql",
    method: "post",
    headers: {
      Authorization: `bearer ${env.ghToken}`,
    },
    data: {
      query: `
        query userInfo($login: String!) {
          user(login: $login) {
            name
            repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
              totalCount
            }
            contributionsCollection {
              totalCommitContributions
            }
            pullRequests(first: 100) {
              totalCount
            }
            issues(first: 100) {
              totalCount
            }
            repositories(first: 100) {
              nodes {
                stargazers {
                  totalCount
                }
              }
            }
          }
        }
      `,
      variables: {
        login: env.ghUser,
      },
    },
  });

  const stats = {
    name: "",
    totalPRs: 0,
    totalCommits: 0,
    totalIssues: 0,
    totalStars: 0,
    contributedTo: 0,
  };

  if (res.data.errors) {
    console.log(res.data.errors);
    throw Error("Could not fetch user");
  }

  const user = res.data.data.user;

  stats.name = user.name;
  stats.totalIssues = user.issues.totalCount;
  stats.totalCommits = user.contributionsCollection.totalCommitContributions;
  stats.totalPRs = user.pullRequests.totalCount;
  stats.contributedTo = user.repositoriesContributedTo.totalCount;

  stats.totalStars = user.repositories.nodes.reduce((prev, curr) => {
    return prev + curr.stargazers.totalCount;
  }, 0);

  return stats;
}

const createTextNode = (icon, label, value, lheight) => {
  const classname = icon === "★" && "star-icon";
  return `
    <tspan x="25" dy="${lheight}" class="stat bold">
    <tspan class="icon ${classname}" fill="#4C71F2">${icon}</tspan> ${label}:</tspan>
    <tspan x="155" dy="0" class="stat">${kFormatter(value)}</tspan>
  `;
};

const renderSVG = (stats, options) => {
  const {
    name,
    totalStars,
    totalCommits,
    totalIssues,
    totalPRs,
    contributedTo,
  } = stats;
  const { hide, show_icons, hide_border, line_height } = options || {};

  const lheight = line_height || 25;

  const STAT_MAP = {
    stars: createTextNode("★", "Total Stars", totalStars, lheight),
    commits: createTextNode("🕗", "Total Commits", totalCommits, lheight),
    prs: createTextNode("🔀", "Total PRs", totalPRs, lheight),
    issues: createTextNode("ⓘ", "Total Issues", totalIssues, lheight),
    contribs: createTextNode("📕", "Contributed to", contributedTo, lheight),
  };

  const statItems = Object.keys(STAT_MAP)
    .filter((key) => !hide.includes(key))
    .map((key) => STAT_MAP[key]);

  const height = 45 + (statItems.length + 1) * lheight;

  return `
    <svg width="495" height="${height}" viewBox="0 0 495 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
      .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #2F80ED }
      .stat { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #333 }
      .star-icon { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; }
      .bold { font-weight: 700 }
      .icon {
        display: none;
        ${!!show_icons && "display: block"}
      }
      </style>
      ${
        !hide_border &&
        `<rect x="0.5" y="0.5" width="494" height="99%" rx="4.5" fill="#FFFEFE" stroke="#E4E2E2"/>`
      }

      <text x="25" y="35" class="header">${name}'s GitHub Stats</text>
      <text y="45">
        ${statItems}
      </text>
    </svg>
  `;
};

module.exports = async (event) => {
  const { hide, hide_border, show_icons, line_height } = event.queryStringParameters;
  const stats = await fetchStats();
  return renderSVG(stats, {
    hide: JSON.parse(hide || "[]"),
    show_icons,
    hide_border,
    line_height,
  });
};
