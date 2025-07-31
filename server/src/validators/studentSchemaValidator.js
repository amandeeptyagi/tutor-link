import { z } from "zod";

export const studentRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  profilePhoto: z.string().url().optional(),
  address: z.string().min(1, "Address is required"),
});
