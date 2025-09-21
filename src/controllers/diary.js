import createHttpError from 'http-errors';
import { getUserDiaries,
         createDiaryService,
         updateDiaryService,
         deleteDiaryService
} from '../services/diary.js';

export const getUserDiaryController = async(req, res, next) => {
    try {
        const userId = req.user._id.toString();
        const diaries = await getUserDiaries(userId);

        res.status(200).json({
            status: 200,
            message: 'Successfully get diaries!',
            data: diaries,
        });
    } catch (err) {
        next(err);
    }
};

export const createDiaryController = async(req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const newDiary = await createDiaryService({ ...req.body, userId});

        res.status(201).json({
            status: 201,
            message: 'Successfully create a diary entry!',
            data: newDiary,
        });
    } catch (err) {
        next(err);
    }
};

export const updateDiaryController = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { _id: userId } = req.user;
      const updatedDiary = await updateDiaryService(id, userId, req.body);
      const updateData = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
    return next(createHttpError(400, "Missing fields for update"));
}

      if (!updatedDiary) {
        return res.status(404).json({
          status: 404,
          message: 'Diary not found',
          data: null,
        });
      }

      res.status(200).json({
        status: 200,
        message: 'Successfully updated diary!',
        data: updatedDiary,
      });
    } catch (err) {
      next(err);
    }
  };

  export const deleteDiaryController = async(req, res, next) => {
    try {
      const { id } = req.params;
      const { _id: userId } = req.user;
      const deletedDiary = await deleteDiaryService(id, userId);

      if (!deletedDiary) {
        return res.status(404).json({
          status: 404,
          message: 'Diary not found',
          data: null,
        });
      }

      res.status(200).json({
        status: 200,
        message: 'Successfully deleted diary entry!',
        data: deletedDiary,
      });
    } catch (err) {
      next(err);
    }
  };
