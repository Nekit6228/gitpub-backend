import { getUserDiaries } from '../services/diary.js';

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