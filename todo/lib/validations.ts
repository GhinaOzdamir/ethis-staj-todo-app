import { z } from 'zod';

export const todoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z.string().optional().or(z.literal('')),
  status: z.enum(['todo', 'in_progress', 'done'], ),
  priority: z.enum(['low', 'medium', 'high'], ),
  dueDate: z.string().optional().or(z.literal('')),
});

export type TodoSchemaType = z.infer<typeof todoSchema>;