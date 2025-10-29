# Experiment 4 - GraphQL Task Manager API

A GraphQL-based Task Manager API built with Node.js, Express, MongoDB, and GraphQL.

## Setup Instructions

1. **Set PowerShell Execution Policy** (Windows only):
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   \`\`\`

2. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**:
   - Make sure MongoDB is running locally on port 27017
   - Or update the `MONGODB_URI` in `.env` file

4. **Start the Server**:
   \`\`\`bash
   node index.js
   \`\`\`

5. **Access GraphQL Playground**:
   Open: http://localhost:4000/graphql

## GraphQL Operations

### Create Task
```graphql
mutation {
  createTask(input: {
    title: "Finish GraphQL API",
    description: "Write server, schema and resolvers",
    status: "IN_PROGRESS",
    dueDate: "2025-09-30T00:00:00.000Z"
  }) {
    id
    title
    status
    dueDate
    createdAt
  }
}



query {
tasks {
id
title
description
status
dueDate
createdAt
}
}


ansible-playbook -i ansible/inventory.ini ansible/deploy.yml --ask-become-pass

sudo systemctl status exrp5-ansible

curl http://localhost:4000
