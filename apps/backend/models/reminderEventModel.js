import mongoose from 'mongoose';
//Every think the user does: 'Mark Completed', "Mark Skipped", "Snoozed" will be logged here. This is the 'History'/ 'Report' model:
const ReminderEventSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true, index:true},
    reminderInstanceId: {type:mongoose.Schema.Types.ObjectId, ref:"ReminderInstance",required:true,index:true},
    templateId:{type:mongoose.Schema.Types.ObjectId,ref:"ReminderTemplate",required:true,index:true},
    parentTemplateId:{type:mongoose.Schema.Types.ObjectId,ref:"ReminderTemplate",default:null},
    date:{type:String, required:true,index:true},
    eventType:{type:String,enum:['completed','snoozed','skipped','missed'],required:true,index:true},
    snoozeReason:{type:String,enum:['tired','busy','later','null'],default:null},
    scheduledTime:{type:String,default:null},
    durationActual:{type:Number,default:null},
    toughnessAtExecution:{type:Number,default:null},
    timestamp:{type:Date,default:Date.now,index:true,}
},{versionKey:false})