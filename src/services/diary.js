import { DiaryCollection } from '../db/models/diary.js';

export const getUserDiaries = async (userId) => {
   return await DiaryCollection.find( {userId} )
      .populate('emotions', 'title')
      .populate('userId');
};