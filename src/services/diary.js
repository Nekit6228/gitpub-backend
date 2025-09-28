import { DiaryCollection } from '../db/models/diary.js';
import { SORT_ORDER } from '../constants/index.js';

export const getUserDiaries = async ({
  userId,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const queryConditions = { userId };

  const contactsQuery = DiaryCollection.find(queryConditions).sort({
    [sortBy]: sortOrder,
  });

  const [totalCount, tasks] = await Promise.all([
    DiaryCollection.find(queryConditions).clone().countDocuments(),
    contactsQuery.exec(),
  ]);

  return {
    data: tasks,
    total: totalCount,
  };
};

export const createDiaryService = async (payload) => {
  try {
    const createDiary = await DiaryCollection.create(payload);
    return createDiary;
  } catch (error) {
    throw new Error('Не вдалося створити завдання: ' + error.message);
  }
};

export const updateDiaryService = async (diaryId, userId, payload) => {
  return await DiaryCollection.findOneAndUpdate(
    { _id: diaryId, userId },
    payload,
    { new: true, runValidators: true },
  );
};

export const deleteDiaryService = async (diaryId, userId) => {
  return await DiaryCollection.findOneAndDelete({ _id: diaryId, userId });
};
