// In-memory Task model that mimics enough of Mongoose Model API
// so the existing GraphQL schema/resolvers keep working without MongoDB.

const tasks = []
let idCounter = 1

function genId() {
  return `${Date.now()}_${idCounter++}`
}

class Task {
  constructor({ title, description = "", status = "TODO", dueDate } = {}) {
    this.id = genId()
    this.title = title
    this.description = description
    this.status = status
    this.dueDate = dueDate ? new Date(dueDate) : undefined
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  save() {
    tasks.push(this)
    return Promise.resolve(this)
  }

  static async findById(id) {
    return tasks.find((t) => t.id === id) || null
  }

  // Support Task.find(filter).sort({createdAt: -1}) used in schema
  static find(filter = {}) {
    let res = tasks.slice()
    if (filter.status) {
      res = res.filter((t) => t.status === filter.status)
    }
    if (filter.$or && Array.isArray(filter.$or)) {
      // attempt to extract the raw search string from the $or objects
      const maybeSearch = filter.$or
        .map((o) => {
          if (o.title && o.title.$regex) return o.title.$regex
          if (o.description && o.description.$regex) return o.description.$regex
          return null
        })
        .find(Boolean)
      if (maybeSearch) {
        const re = new RegExp(maybeSearch, "i")
        res = res.filter((t) => re.test(t.title) || re.test(t.description))
      }
    }

    // Return an object with .sort(...) to match Mongoose chaining used in schema
    return {
      sort: (sortObj) => {
        const arr = res.slice()
        if (sortObj && sortObj.createdAt === -1) {
          arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }
        return Promise.resolve(arr)
      },
      // In case callers await the returned value directly (rare here), resolve to array
      then: (resolve) => resolve(res),
    }
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    const task = tasks.find((t) => t.id === id)
    if (!task) return null
    const set = update.$set || update
    if (set.title !== undefined) task.title = set.title
    if (set.description !== undefined) task.description = set.description
    if (set.status !== undefined) task.status = set.status
    if (set.dueDate !== undefined) task.dueDate = set.dueDate ? new Date(set.dueDate) : undefined
    task.updatedAt = new Date().toISOString()
    return options.new ? task : task
  }

  static async findByIdAndDelete(id) {
    const idx = tasks.findIndex((t) => t.id === id)
    if (idx === -1) return null
    const [removed] = tasks.splice(idx, 1)
    return removed
  }
}

module.exports = Task
