
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";

import stringSimilarity from "string-similarity";

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
        
        else if (quesiton.questionType === "open_ended") {
            let percentageSimilar = stringSimilarity.compareTwoStrings(
              quesiton.answer.toLowerCase().trim(),
              userAnswer.toLowerCase().trim()
            );
            percentageSimilar = Math.round(percentageSimilar * 100);
            await prisma.question.update({
              where: { id: questionId },
              data: { percentageCorrect: percentageSimilar },
            });
            return NextResponse.json(
              {percentageSimilar},
              {status: 200}
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