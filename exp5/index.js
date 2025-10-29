// index.js
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./graphql/schema")

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000

// Optional MongoDB connection
// To enable MongoDB, set USE_MONGO=true and provide MONGODB_URI in env
if (process.env.USE_MONGO === "true" && process.env.MONGODB_URI) {
  const mongoose = require("mongoose")
  const MONGODB_URI = process.env.MONGODB_URI
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err)
      process.exit(1)
    })
} else {
  console.log("ℹ️  Running without MongoDB — using in-memory store for tasks. To enable MongoDB set USE_MONGO=true and MONGODB_URI.")
}

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // enable GraphiQL in dev
  }),
)

app.get("/", (_, res) => res.send("Task Manager GraphQL API is running. Visit /graphql"))

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
})
