// src/models/User.ts
import { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  region: string;
  date?: Date;
  status?: string;
  isAdmin?: boolean;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'Registered',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Prevent model overwrite upon hot reload
const User = models.User || model<IUser>('User', UserSchema);
export default User;
