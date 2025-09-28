import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
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
  },
  { timestamps: true, versionKey: false },
);

userSchema.method.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UsersCollection = model('users', userSchema);

export default UsersCollection;
