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

export const updateDiaryService = async (diaryId, userId, payload) => {
   return await DiaryCollection.findOneAndUpdate(
     { _id: diaryId, userId }, 
     payload,
     { new: true, runValidators: true }
   );
 };
 
 export const deleteDiaryService = async(diaryId, userId) => {
   return await DiaryCollection.findOneAndDelete(
      { _id: diaryId, userId }, 
    );
 };