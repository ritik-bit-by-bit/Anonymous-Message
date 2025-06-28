import {z} from 'zod';

export const signuUpSchema = z.object({
    email: z.string().email({message: 'invalid email'}),
    password: z.string({message:'password is required'}),
});
