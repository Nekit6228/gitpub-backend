import { getUserDiaries, createDiaryService } from '../services/diary.js';

export const getUserDiaryController = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const diaries = await getUserDiaries(userId);

        res.status(200).json({
            status: 200,
            message: 'Successfully get diaries!',
            data: diaries,
        });
    } catch (err) {
        next(err)
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
        next(err)
    }
};