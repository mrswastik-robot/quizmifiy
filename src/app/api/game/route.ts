import { getAuthSession } from "@/lib/next-auth";
import { NextResponse } from "next/server";
import { quizFormSchema } from "@/schemas/form/quiz";
import { prisma } from "@/lib/db";
import axios from "axios";
import { ZodError } from "zod";


export async function POST(req:Request, res:Response)
{
    try {

        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json(
              { error: "You must be logged in to create a game." },
              {
                status: 401,
              }
            );
          }

        const body = await req.json();
        const { amount, topic, type } = quizFormSchema.parse(body);

        const game = await prisma.game.create({
            data: {
                gameType: type,
                topic: topic,
                timeStarted: new Date(),
                userId: session.user.id,
            }
        })

        const {data} = await axios.post("http://localhost:3000/api/questions", {         //data here is an object which has an array consisting of many quesiton objects , output was seen in postman
            amount: amount,
            topic: topic,
            type: type,
            });

            if(type == 'mcq')
            {
                type mcqQuestion = {
                    question: string;
                    answer: string;
                    option1: string;
                    option2: string;
                    option3: string;
                  };            

                const manyData = data.questions.map((question:mcqQuestion) => {            //manyData here is the array of many questions , and "questions" is the name of the array which is inside the data object containing many question objects

                    const options = [question.answer, question.option1, question.option2, question.option3].sort(() => Math.random() - 0.5);

                    return {
                        question: question.question,
                        answer: question.answer,
                        // option1: question.option1,
                        // option2: question.option2,
                        // option3: question.option3,     pehle aise krne wale the pr options ko random order me rkhna hain na
                        options: JSON.stringify(options),
                        gameId: game.id,
                        questionType: "mcq",
                    }
                })

                await prisma.question.createMany({
                    data: manyData,
                })
            }

            else if(type === 'open_ended')
            {
                type openQuestion = {
                    question: string;
                    answer: string;
                }

    
                    let manyData = data.questions.map((question:openQuestion) => {
                        return {
                            question: question.question,
                            answer: question.answer,
                            gameId: game.id,
                            questionType: "open_ended",
                        }
                    })

                    await prisma.question.createMany({
                        data: manyData,
                    })


            }

            return NextResponse.json({ gameId: game.id }, { status: 200 });
        
    } catch (error) {

        if (error instanceof ZodError) {
            return NextResponse.json(
              { error: error.issues },
              {
                status: 400,
              }
            );
          }

          return NextResponse.json(
            {
                error: "Something went wrong."
            },
            {
                status: 500,
            }
            )
        
    }
}