import fs from 'node:fs/promises';

const DEFAULT_USER = process.env.GITHUB_USER || 'AsianTaquito';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

if (!token) {
  console.error('Missing GITHUB_TOKEN (or GH_TOKEN) env var.');
  process.exit(1);
}

const login = process.argv[2] || DEFAULT_USER;

const query = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `bearer ${token}`
  },
  body: JSON.stringify({ query, variables: { login } })
});

if (!response.ok) {
  const text = await response.text();
  throw new Error(`GitHub GraphQL error ${response.status}: ${text}`);
}

const json = await response.json();
if (json.errors?.length) {
  throw new Error(`GitHub GraphQL errors: ${JSON.stringify(json.errors)}`);
}

const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
if (!calendar) {
  throw new Error('No contributionCalendar returned (check username/token).');
}

const payload = {
  user: login,
  generatedAt: new Date().toISOString(),
  calendar
};

await fs.writeFile('contributions.json', JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log(`Wrote contributions.json for ${login}`);
