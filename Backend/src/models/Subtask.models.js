import mongoose,{Schema} from "mongoose";

const subtaskSchema = new Schema({
    title:{
        type:String,
        trim:true,
        required:true 
    },
    task:{
        type:Schema.Types.ObjectId,
        ref:"Task",
        required:true 
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true 
    }
},{timestamps:true})

export const Subtask = mongoose.model("Subtask",subtaskSchema)