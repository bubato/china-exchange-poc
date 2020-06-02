import mongoose, { Schema, Document } from "mongoose";

/**
 * merchandiser  = user can use merchandiser's token to process to payment page
 * agency = consumer's admin, who has access to withdraw page
 * admin  = system admin, who can config payment accounts,
 *        / method and approve/reject transaction
 */
export type Role = "agency" | "admin" | "merchandiser";
export type UserDocument = Document & {
  _id: string;
  fullName: string;
  username: string;
  hashedPassword: string;
  appToken: string; // for merchandiser account, currently buyer can use consumer's token to access to payment page
  roles: Role[];
};

const userSchema = new Schema(
  {
    fullName: String,
    username: { type: String, unique: true },
    hashedPassword: String,
    appToken: String,
    roles: [String],
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", userSchema);
