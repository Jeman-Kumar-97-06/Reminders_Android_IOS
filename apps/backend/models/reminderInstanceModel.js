import mongoose from "mongoose";

const ReminderInstanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReminderUser",
      required: true,
      index: true,
    },

    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReminderTemplate",
      required: true,
      index: true,
    },

    // Parent instance (for sub-reminders)
    parentInstanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReminderInstance",
      default: null,
    },

    // The date this instance belongs to (LOCAL date)
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },

    // Final scheduled time decided by AI / manual order
    scheduledTime: {
      type: String, // "06:20"
      required: true,
    },

    // Manual ordering (used when AI sorting is OFF)
    orderIndex: {
      type: Number,
      default: null,
    },

    // AI ranking score (used when AI sorting is ON)
    aiRank: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "done", "skipped", "missed"],
      default: "pending",
      index: true,
    },

    // Snooze tracking
    snoozeCount: {
      type: Number,
      default: 0,
    },

    lastActionAt: {
      type: Date,
      default: null,
    },

    // Helps analytics & AI (optional but powerful)
    durationActual: {
      type: Number, // minutes actually spent
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

//
// 🔒 Indexes (important)
//
ReminderInstanceSchema.index({ userId: 1, date: 1 });
ReminderInstanceSchema.index({ parentInstanceId: 1 });
ReminderInstanceSchema.index({ status: 1 });

export default mongoose.model(
  "ReminderInstance",
  ReminderInstanceSchema
);
