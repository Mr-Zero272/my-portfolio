// Next.js 15 (App Router)
// File: app/api/github/stats/route.ts
// This endpoint aggregates GitHub stats for your portfolio.

import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.FINE_GRAINED_GITHUB_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME;

if (!GITHUB_TOKEN) {
  console.warn('Missing GITHUB_TOKEN in environment variables');
}

async function github(path: string) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
    },
    next: { revalidate: 3600 }, // Cache 1 giờ
  });
  return res.json();
}

export async function GET() {
  try {
    // 1. Lấy thông tin user
    const user = await github('/user');

    // 2. Lấy danh sách repo
    const repos = await github(`/users/${USERNAME}/repos?per_page=100`);

    // 3. Tính tổng stars + forks
    let totalStars = 0;
    let totalForks = 0;

    for (const repo of repos) {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
    }

    // 4. Lấy languages cho từng repo
    const languageTotals: Record<string, number> = {};

    await Promise.all(
      repos.map(async (repo: any) => {
        const langs = await github(`/repos/${USERNAME}/${repo.name}/languages`);
        for (const [lang, bytes] of Object.entries(langs)) {
          languageTotals[lang] = (languageTotals[lang] || 0) + Number(bytes);
        }
      }),
    );

    // Sort top languages
    const topLanguages = Object.entries(languageTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang);

    // 5. Lấy contributions (GraphQL)
    const gqlRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          viewer {
            contributionsCollection {
              contributionCalendar {
                totalContributions
              }
            }
          }
        }`,
      }),
    }).then((r) => r.json());

    const contributions = gqlRes?.data?.viewer?.contributionsCollection?.contributionCalendar?.totalContributions || 0;

    return NextResponse.json({
      username: user.login,
      avatar: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      totalStars,
      totalForks,
      topLanguages,
      contributionsThisYear: contributions,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch GitHub stats' }, { status: 500 });
  }
}
