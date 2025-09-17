
import { model, Schema } from "mongoose";


const userSchema = new Schema({
    name: {type: String,required:true,maxlength: [32, 'Name cannot exceed 32 characters'],},
    email: {type:String,required:true,unique:true,  maxlength: [64, 'Email cannot exceed 64 characters'], match: [/\S+@\S+\.\S+/, 'Email is invalid'],},
    password: {type:String,required:true, minlength: [8, 'Password must be at least 8 characters'], maxlength: [128, 'Password cannot exceed 128 characters'],},
},
{timestamps:true,versionKey:false},
);


userSchema.methods.toJSON = function (){
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const UserCollections = model('users',userSchema);
