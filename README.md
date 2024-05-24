# Powerhouse Mirror

This project fetches data from a GraphQL endpoint and creates GitHub issues based on the fetched data. The body of the created issues contains the JSON data formatted nicely for readability.

## Prerequisites

- Node.js (v12 or later)
- Yarn (v1.22.21 or later)

## Setup

1. **Clone the Repository**:
   ```sh
   git clone <repository-url>
   cd powerhouse-mirror
   ```
````

2. **Install Dependencies**:

   ```sh
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory of the project and add your GitHub token:
   ```env
   GITHUB_TOKEN=your-github-token
   ```

## Configuration

The script uses the following configuration parameters:

- `GITHUB_REPO_OWNER`: The owner of the GitHub repository where issues will be created.
- `GITHUB_REPO_NAME`: The name of the GitHub repository where issues will be created.
- `GRAPHQL_ENDPOINT`: The GraphQL endpoint to fetch data from.
- `query`: The GraphQL query to fetch the required data.

These parameters are already set in the script but can be modified as needed.

## Running the Script

To run the script and create GitHub issues:

```sh
yarn tsx build/mirror.ts
```

## Script Overview

The script performs the following steps:

1. **Fetch Issue Data**:
   - Sends a GraphQL query to the specified endpoint.
   - Parses the response and constructs a title and description for the GitHub issue.
2. **Create GitHub Issue**:
   - Uses the GitHub API to create an issue with the fetched data.
   - The JSON data is formatted in a code block for readability.

## Code

Here's the main script (`build/mirror.ts`):

````typescript
import fetch from "node-fetch";
import { Octokit } from "@octokit/rest";
import * as dotenv from "dotenv";
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is required");
}

const GITHUB_REPO_OWNER = "0x4007";
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
````

## Troubleshooting

If you encounter any issues, please ensure that:

- Your GitHub token is correctly set in the `.env` file.
- You have the necessary permissions to create issues in the specified GitHub repository.
- The GraphQL endpoint and query are correct and returning the expected data.

Feel free to reach out if you need further assistance!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
