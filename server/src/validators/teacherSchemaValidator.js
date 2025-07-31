import { z } from "zod";

export const teacherRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  profilePhoto: z.string().url().optional(),
  gender: z.enum(["male", "female", "other"]),
  mode: z.array(z.enum(["online", "offline"])),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    location: z.object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
    }),
  }),
  subjects: z.array(z.string()),
  classRange: z.object({
    from: z.number(),
    to: z.number(),
  }),
  timing: z.string(),
  instituteName: z.string(),
});
