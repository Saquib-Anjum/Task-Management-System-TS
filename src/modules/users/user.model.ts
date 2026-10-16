import mongoose, { type InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
export type User = InferSchemaType<typeof userSchema>;
const userModel =
  (mongoose.models.User as mongoose.Model<User> | undefined) ??
  mongoose.model<User>("User", userSchema);

export default userModel;
