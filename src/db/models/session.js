import { Schema, model } from 'mongoose';

const sessinSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessTokenValidUntil: {
    type: Date,
    required: true,
  },
  refreshTokenValidUntil: {
    type: Date,
    required: true,
  },
});

export const SessionCollection = model('session', sessinSchema);
