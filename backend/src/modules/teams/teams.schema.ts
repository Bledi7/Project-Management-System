import { z } from 'zod';

export const CreateTeamSchema = z.object({
  name: z.string().min(2).max(255),
});

export const UpdateTeamSchema = z.object({
  name: z.string().min(2).max(255),
});

export const AddMemberSchema = z.object({
  user_id: z.number().int().positive(),
});

export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;
export type AddMemberInput  = z.infer<typeof AddMemberSchema>;
