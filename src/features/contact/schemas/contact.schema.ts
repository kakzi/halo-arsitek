import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(9, 'Nomor telepon minimal 9 digit').max(20),
  budget: z.string().optional(),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
