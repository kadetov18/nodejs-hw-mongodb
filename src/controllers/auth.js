import createHttpError from 'http-errors';
import { THIRTY_DAYS_SESSION } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  resetPassword,
} from '../service/auth.js';

import { requestResetToken } from '../service/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS_SESSION),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS_SESSION),
  });
  res.json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const sessionId = req.cookies?.sessionId;
  if (sessionId) {
    await logoutUser(sessionId);
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.status(204).send();
  } else {
    res.status(400).json({
      status: 400,
      message: 'No active session found.',
    });
  }
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS_SESSION),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS_SESSION),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const sessionId = req.cookies?.sessionId;
  const refreshToken = req.cookies?.refreshToken;

  if (!sessionId || !refreshToken) {
    return res.status(400).json({
      status: 400,
      message: 'No active session found.',
    });
  }

  const session = await refreshUserSession({
    sessionId,
    refreshToken,
  });

  setupSession(res, session);
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  if (!req.body.email) {
    throw createHttpError(404, 'User not found!');
  }
  res.json({
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  if (!req.body) {
    throw createHttpError(404, 'User not found!');
  }
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};
