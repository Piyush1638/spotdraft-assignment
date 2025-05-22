import mongoose, { Document, Schema } from "mongoose";


// TypeScript interface for type safety
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  sharedFiles: mongoose.Types.ObjectId[]; // PDFs shared by the user
  verifyOtp: string;
  verifyOtpExpireAt: number;
  isAccountVerified: boolean;
  resetOtp: string;
  resetOtpExpireAt: number;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    sharedFiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PDF",
      },
    ],
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User =
  mongoose.models.users || mongoose.model<IUser>("users", userSchema);

export default User;
