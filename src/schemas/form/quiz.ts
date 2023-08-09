import {z} from 'zod';

export const quizFormSchema = z.object({

    topic: z.string().min(4, {message: "Topic must be atleast 4 characters long.",}).max(50, {message: "Topic must be atmost 50 characters long.",}),
    //ye to topic k liye ho gaya
    //ab question kis type ka hoga

    type : z.enum(['mcq', 'open_ended']),

    //ab question honge kitne

    amount: z.number().min(1).max(10),
    
});

export const checkAnswerSchema = z.object({
    questionId: z.string(),
    userAnswer: z.string(),
});
