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

## Troubleshooting

If you encounter any issues, please ensure that:

- Your GitHub token is correctly set in the `.env` file.
- You have the necessary permissions to create issues in the specified GitHub repository.
- The GraphQL endpoint and query are correct and returning the expected data.

Feel free to reach out if you need further assistance!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
