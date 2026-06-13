import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'PRODUCT_OWNER', 'DEVELOPER']).default('DEVELOPER'),
  status: z.enum(['PENDING', 'ACTIVE', 'REJECTED']).default('PENDING'),
  team_id: z.number().int().positive().optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'PRODUCT_OWNER', 'DEVELOPER']).optional(),
  team_id: z.number().int().positive().nullable().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'REJECTED']).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
