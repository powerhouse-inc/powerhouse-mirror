// cspell:ignore Gfug, Kzfq, pccg,

import { Octokit } from "@octokit/rest";
import * as dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is required");
}

const GITHUB_REPO_OWNER = "powerhouse-inc";
const GITHUB_REPO_NAME = "powerhouse-mirror";

const octokit = new Octokit({ auth: GITHUB_TOKEN });

const query = `
  query {
    document(id: "5KzfqVzVgZegGXxfY+pccgZGfug=") {
      id
      ... on RealWorldAssets {
        operations {
          type
          index
          timestamp
          hash
        }
        state {
          accounts {
            id
          }
        }
      }
    }
  }
`;

const GRAPHQL_ENDPOINT = "https://apps.powerhouse.io/alpha/powerhouse/switchboard/d/powerhouse";

async function fetchIssueData() {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(JSON.stringify(result.errors));
    }

    const data = result.data;
    const title = `Document ID: ${data.document.id}`;
    const description = "```json\n" + JSON.stringify(data.document, null, 2) + "\n```";
    return { title, description };
  } catch (error) {
    console.error("Error fetching issue data:", error);
    throw error;
  }
}

async function createGitHubIssue(title: string, body: string) {
  try {
    const response = await octokit.issues.create({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      title: title,
      body: body,
    });
    console.log("GitHub issue created:", response.data.html_url);
  } catch (error) {
    console.error("Error creating GitHub issue:", error);
    throw error;
  }
}

async function main() {
  try {
    const issueData = await fetchIssueData();
    await createGitHubIssue(issueData.title, issueData.description);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

void main();
