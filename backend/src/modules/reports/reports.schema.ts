import { z } from 'zod';

export const CreateReportSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().min(1),
  team_id: z.number().int().positive(),
});

export const UpdateReportSchema = z.object({
  title: z.string().min(2).max(255).optional(),
  description: z.string().min(1).optional(),
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>;
export type UpdateReportInput = z.infer<typeof UpdateReportSchema>;
