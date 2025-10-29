// graphql/schema.js
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLBoolean,
} = require("graphql")

const Task = require("../models/Task")

// Task GraphQL Type
const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    dueDate: { type: GraphQLString }, // ISO date string
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
})

// Input type for creating/updating
const TaskInput = new GraphQLInputObjectType({
  name: "TaskInput",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    dueDate: { type: GraphQLString },
  },
})

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, { id }) => {
        return await Task.findById(id)
      },
    },
    tasks: {
      type: new GraphQLList(TaskType),
      args: {
        status: { type: GraphQLString }, // optional filter
        search: { type: GraphQLString }, // search in title/description
      },
      resolve: async (_, { status, search }) => {
        const filter = {}
        if (status) filter.status = status
        if (search) {
          filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ]
        }
        return await Task.find(filter).sort({ createdAt: -1 })
      },
    },
  },
})

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createTask: {
      type: TaskType,
      args: {
        input: { type: new GraphQLNonNull(TaskInput) },
      },
      resolve: async (_, { input }) => {
        const task = new Task({
          title: input.title,
          description: input.description || "",
          status: input.status || "TODO",
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        })
        return await task.save()
      },
    },
    updateTask: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(TaskInput) },
      },
      resolve: async (_, { id, input }) => {
        const updated = await Task.findByIdAndUpdate(
          id,
          {
            $set: {
              title: input.title,
              description: input.description || "",
              status: input.status || "TODO",
              dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
            },
          },
          { new: true, runValidators: true },
        )
        return updated
      },
    },
    patchTaskStatus: {
      // small mutation to only change status
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { id, status }) => {
        const valid = ["TODO", "IN_PROGRESS", "DONE"]
        if (!valid.includes(status)) throw new Error("Invalid status")
        return await Task.findByIdAndUpdate(id, { status }, { new: true })
      },
    },
    deleteTask: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        const res = await Task.findByIdAndDelete(id)
        return !!res
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})
