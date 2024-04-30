import { z } from 'zod';

export type ListEventSchema = z.infer<typeof listEventsSchema>;
export type ReserveTicketSchema = z.infer<typeof reserveTicketSchema>;
export type CreateEventSchema = z.infer<typeof createEventSchema>;

const eventCategories = ['concert', 'conference', 'game'] as const;
export const eventAttendeesMax: number = 1000;

export const listEventsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  endDate: z.string().date().optional(),
  startDate: z.string().date().optional(),
  category: z.enum(eventCategories).optional(),
}).superRefine((obj, ctx) => {
  if (obj.startDate && obj.endDate && obj.startDate >= obj.endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'start_date must be before end_date',
    });
    return;
  }
});

export const reserveTicketSchema = z.object({
  attendeesCount: z.number().int().min(1).max(eventAttendeesMax),
});

export const createEventSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.string().date(),
  availableAttendeesCount: z.number().int().min(1).max(eventAttendeesMax),
  description: z.string().max(500),
  category: z.enum(eventCategories),
});