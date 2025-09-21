import { model, Schema, Types } from 'mongoose';

const diarySchema = new Schema ({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now,
    },

    emotions: [{
        type: Types.ObjectId,
        ref: 'Emotions',
        required: true
    }],

    userId: {
        type: Types.ObjectId,
        ref: 'users',
        required: true,
    },
},

{
    timestamps: true,
    versionKey: false
});

export const DiaryCollection = model('diary', diarySchema);
