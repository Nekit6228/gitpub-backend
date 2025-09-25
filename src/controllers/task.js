import createHttpError from 'http-errors';

import {
  getAllTasks,
  createTask,
  updateTaskIsActive,
} from '../services/task.js';

export const getTaskController = async (req, res) => {
  try {
    const sessionId = req.cookies?.sessionId;

    console.log('Session ID from cookies:', sessionId);

    const tasks = await getAllTasks({ userId: sessionId });

    res.status(200).json({
      status: 200,
      message: 'Successfully found tasks list!',
      result: tasks,
    });
  } catch (error) {
    console.error('getTaskController failed:', {
      message: error?.message,
      stack: error?.stack,
    });

    res.status(500).json({
      status: 500,
      message: 'Failed to fetch tasks',
    });
  }
};

export const createTaskController = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId;

    if (!sessionId) {
      return res
        .status(401)
        .json({ message: 'Session ID not found in cookies' });
    }

    const taskData = {
      userId: sessionId,
      ...req.body,
    };

    const task = await createTask(taskData);

    res.status(201).json({
      status: 'success',
      message: 'Завдання успішно створено',
      data: task,
    });
  } catch (error) {
    console.error('createTaskController failed:', {
      message: error?.message,
      stack: error?.stack,
    });
    next(error);
  }
};

export const patchTaskController = async (req, res, next) => {
  const { taskId } = req.params;
  const sessionId = req.cookies?.sessionId;
  if (!sessionId) {
    return next(createHttpError(401, 'Unauthorized'));
  }

  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    return next(createHttpError(400, 'Invalid isActive value'));
  }

  try {
    const task = await updateTaskIsActive(taskId, { isActive });

    if (!task) {
      return next(createHttpError(404, 'Task not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a task!',
      data: task,
    });
  } catch (error) {
    console.error('PATCH /task error:', error);
    next(createHttpError(500, 'Internal server error'));
  }
};
