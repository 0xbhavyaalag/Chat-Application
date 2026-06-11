const { z } = require('zod');

const registerSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(6).max(72),
  avatar: z.string().url().optional().or(z.literal('')),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const roomSchema = z.object({
  roomName: z.string().min(2).max(50),
  members: z.array(z.string().min(1)).optional(),
});

const messageSchema = z
  .object({
    receiver: z.string().optional(),
    roomId: z.string().optional(),
    content: z.string().min(1).max(4000),
  })
  .refine((value) => Boolean(value.receiver || value.roomId), {
    message: 'Either receiver or roomId is required',
    path: ['receiver'],
  });

module.exports = { registerSchema, loginSchema, roomSchema, messageSchema };
