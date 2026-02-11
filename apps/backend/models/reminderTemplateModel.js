import mongoose from "mongoose";

const ReminderTemplateSchema = new mongoose.Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId,ref: "ReminderUser",required: true,index: true,}, //userId which user the reminder belongs to
    title: {type: String,required: true,trim: true,}, //Title of the reminder
    description: {type: String,default: "",}, //Description
    type: {type: String,enum: ["one-time", "daily"],required: true,}, //Daily? or One-Time ?
    parentId: {type: mongoose.Schema.Types.ObjectId,ref: "ReminderTemplate",default: null,}, //If it's a child, what is it's parentId.
    subType: {type: String,enum: ["sequential", "parallel", "optional"],default: "sequential",},
    // Scheduling intent (AI can shift within flexibility)
    preferredTime: {type: String,default: null,},
    flexibilityMinutes: {type: Number,default: 0,min: 0,},
    // AI reasoning inputs
    durationMinutes: {type: Number,default: 10,min: 1,},
    toughness: {type: Number, default: 2, min: 1, max: 5,},
    priority: {type: Number, default: 3, min: 1, max: 5,},
    mandatory: {
      type: Boolean,
      default: false,
    },
    // Manual hint for ordering inside a parent (AI may override)
    orderHint: {
      type: Number,
      default: null,
    },
    // Control flags
    active: {
      type: Boolean,
      default: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
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
