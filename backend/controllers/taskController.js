const Task = require("../models/Task");

// Get all tasks with sorting, search, pagination, and status filters
const getTasks = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 5, sort = "created_at", order = "desc" } = req.query;

    const query = { user: req.userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (status && status !== "All") {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const sortCriteria = {};
    sortCriteria[sort] = order === "asc" ? 1 : -1;

    const tasks = await Task.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limitNum);

    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limitNum);

    return res.json({
      tasks,
      pagination: {
        totalTasks,
        totalPages,
        currentPage: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Create a new task (associated with the logged-in user)
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newTask = new Task({
      title,
      description,
      status: status || "Pending",
      user: req.userId
    });

    const savedTask = await newTask.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a task (restricted to user's own tasks)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a task (restricted to user's own tasks)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
    
    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    return res.json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get task statistics for the dashboard
const getStats = async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.userId });
    const pending = await Task.countDocuments({ user: req.userId, status: "Pending" });
    const inProgress = await Task.countDocuments({ user: req.userId, status: "In Progress" });
    const completed = await Task.countDocuments({ user: req.userId, status: "Completed" });

    return res.json({
      total,
      pending,
      inProgress,
      completed
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getStats };