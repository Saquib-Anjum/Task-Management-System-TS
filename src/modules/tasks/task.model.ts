import mongoose, { type InferSchemaType } from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    date: {
      type: Date,
      default: Date.now(),
    },

    status: {
      type: String,
      enum: ["Completed", "Pending"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

export type Task = InferSchemaType<typeof taskSchema>;

const taskModel =
  (mongoose.models.Task as mongoose.Model<Task> | undefined) ??
  mongoose.model<Task>("Task", taskSchema);

export default taskModel;
