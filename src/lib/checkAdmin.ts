import { Document } from 'mongoose';

interface UserDoc extends Document {
  isAdmin?: boolean;
}

export async function checkAdmin(user: UserDoc): Promise<boolean> {
  return user?.isAdmin === true;
}
