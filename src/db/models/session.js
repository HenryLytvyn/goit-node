import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenExpires: {
      type: Date,
      required: true,
    },
    refreshTokenExpires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const SessionsCollection = model('sessions', sessionSchema);

export default SessionsCollection;
