import mongoose from "mongoose";

const ReminderTemplateSchema = new mongoose.Schema(
  {
    //Which user does this reminder belong to ?
    userId: {type: mongoose.Schema.Types.ObjectId,ref: "ReminderUser",required: true,index: true,},

    //Title of the reminder. Ex: WakeUp Early
    title: {type: String,required: true,trim: true,},

    //Descripton. Ex: Workout - focus on shoulders and chest.
    description: {type: String,default: "",}, 

    //Is the reminder set daily or one-time?
    type: {type: String,enum: ["one-time", "daily"],required: true,}, 
    
    //Parent Reminder's ID, if the current Reminder is a sub-reminder/ child-reminder
    parentId: {type: mongoose.Schema.Types.ObjectId,ref: "ReminderTemplate",default: null,}, 
    
    //Should the sub-reminders be done in sequence or parallel or are they optional ?
    subType: {type: String,enum: ["sequential", "parallel", "optional"],default: "sequential",},

    // "7:00"/"Evening"/"After Lunch" ?
    preferredTime: {type: String,default: null,},

    // +30 or +40 mins from 7:00 am ?
    flexibilityMinutes: {type: Number,default: 0,min: 0,},

    // How long the task takes?
    durationMinutes: {type: Number,default: 10,min: 1,},

    // How tough the task is ?
    toughness: {type: Number, default: 2, min: 1, max: 5,},

    // Priority of the task in order.
    priority: {type: Number, default: 3, min: 1, max: 5,},

    // Is the task mandatory ?
    mandatory: {
      type: Boolean,
      default: false,
    },

    // Manual hint for ordering inside a parent (AI may override)
    orderHint: {
      type: Number,
      default: null,
    },

    // Is the reminder active or archived ?
    active: {
      type: Boolean,
      default: true,
    },

    //Is the Remider archived ?
    archived: {
      type: Boolean,
      default: false,
    },

    //When was the reminder permanently created ?
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

//
// 🔒 Indexes (important for scale & AI queries)
//
ReminderTemplateSchema.index({ userId: 1, active: 1 });
ReminderTemplateSchema.index({ parentId: 1 });
ReminderTemplateSchema.index({ type: 1 });

export default mongoose.model(
  "ReminderTemplate",
  ReminderTemplateSchema
);
