import { DiaryCollection } from '../db/models/diary.js';

export const getUserDiaries = async (userId) => {
   return await DiaryCollection.find( {userId} )
      .populate('emotions', 'title')
      .populate('userId', 'name title');
};

export const createDiaryService = async(payload) => {
   const createDiary = await DiaryCollection.create(payload)
   return createDiary;
};