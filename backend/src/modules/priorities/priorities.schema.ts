import { z } from 'zod';

export const CreatePrioritySchema = z.object({
  title: z.string().min(2).max(255),
  team_id: z.number().int().positive(),
  jira_issue_key: z.string().min(1).max(50).optional(),
  jira_project_key: z.string().min(1).max(50).optional(),
  assignee_label: z.string().max(255).optional(),
});

export const UpdatePrioritySchema = z.object({
  title: z.string().min(2).max(255).optional(),
  team_id: z.number().int().positive().optional(),
});

export const UpdateStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
});

export type CreatePriorityInput = z.infer<typeof CreatePrioritySchema>;
export type UpdatePriorityInput = z.infer<typeof UpdatePrioritySchema>;
export type UpdateStatusInput   = z.infer<typeof UpdateStatusSchema>;
