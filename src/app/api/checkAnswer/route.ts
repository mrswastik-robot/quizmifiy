
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";

export async function POST(req: Request, res: Response) {

    try {

        const body = await req.json();
        const { questionId , userAnswer } = checkAnswerSchema.parse(body);

        const quesiton = await prisma.question.findUnique({
            where: {
                id: questionId,
            }
        });

        if(!quesiton)
        {
            return NextResponse.json(
                {error: "Question not found"},
                {
                    status: 404,
                }
            );
        }

        await prisma.question.update({
            where: {
                id: questionId,
            },
            data: {
                userAnswer: userAnswer,
            }
        });


        if(quesiton.questionType ==='mcq')
        {
            const isCorrect = quesiton.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim();

            await prisma.question.update({
                where: {
                    id: questionId,
                },
                data: {
                    isCorrect: isCorrect,
                }
            });

            return NextResponse.json(
                {isCorrect},
                { status: 200 }
            );

        }

        
    } catch (error) {

        if(error instanceof ZodError)
        {
            return NextResponse.json(
                {error: error.issues},
                {
                    status: 400,
                }
            );
        }
        
    }
    
}