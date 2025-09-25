import { TaskCollection } from '../db/models/task.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllTasks = async ({
  userId,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const queryConditions = { userId };

  const contactsQuery = TaskCollection.find(queryConditions).sort({
    [sortBy]: sortOrder,
  });

  const [totalCount, tasks] = await Promise.all([
    TaskCollection.find(queryConditions).clone().countDocuments(),
    contactsQuery.exec(),
  ]);

  return {
    data: tasks,
    total: totalCount,
  };
};

export const createTask = async (payload) => {
  try {
    const task = await TaskCollection.create(payload);
    return task;
  } catch (error) {
    throw new Error('Не вдалося створити завдання: ' + error.message);
  }
};

export const updateTaskIsActive = async (taskId, payload, options = {}) => {
  const updatedTask = await TaskCollection.findByIdAndUpdate(
    taskId,
    { $set: payload },
    { new: true, ...options },
  );

  if (!updatedTask) return null;

  return {
    task: updatedTask,
    updatedField: 'isActive',
    isNew: false,
  };
};
