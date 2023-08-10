"use client"

import { Game, Question } from '@prisma/client'
import { Timer } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import React, { use, useCallback } from 'react'
import Link from 'next/link'
import { Card , CardHeader ,CardTitle, CardDescription, CardContent } from './ui/card'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { buttonVariants } from './ui/button'
import { Loader2 } from 'lucide-react'
import { BarChart } from 'lucide-react'
import { useMemo, useState , useEffect } from 'react'
import MCQCounter from './MCQCounter'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { checkAnswerSchema } from '@/schemas/form/quiz'
import axios from 'axios'
import { useToast } from './ui/use-toast'

import {differenceInSeconds} from 'date-fns';
import { formatTimeDelta } from '@/lib/utils'

type Props = {
    game: Game & {questions: Pick<Question, "id" | "options" | "question">[]}           //2:35:25   // in the [gameId]page , we were getting the questions using the 'include' but here using the 'game' sent from the [gameId]page , we are not getting the questions
                                                                                        //didn't want answer so had to use Pick to select the fields we want to show
}       

const MCQ = ({game}: Props) => {

    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number>(0);       //all the options bg are black , we need to know which option has been selected inorder to differentiate it from the rest , just like we did in mcq and open_ended button in the quiz form , changing the bg on the button which is clicked

    const [correctAnswers , setCorrectAnswers] = useState<number>(0);
    const [wrongAnswers , setWrongAnswers] = useState<number>(0);
    const [hasEnded , setHasEnded] = useState<boolean>(false);

    //for timecounter to update every second
    const [now , setNow] = useState<Date>(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            if(!hasEnded)
            {
                setNow(new Date());
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [hasEnded]);

    const {toast} = useToast();

    const currentQuestion = useMemo(() => {
        return game.questions[questionIndex];
    }, [questionIndex, game.questions]);

    const options = useMemo(() => {           //getting the options of currentQuestions 2:42
        if(!currentQuestion) return[];
        if(!currentQuestion.options) return[];

        return JSON.parse(currentQuestion.options as string) as string[];
    },[currentQuestion]);


    const {mutate: checkAnswer , isLoading: isChecking} = useMutation({          //similarly done in quizCreationForm.tsx
        mutationFn: async () => {                                                //2:55:00
            const payload: z.infer<typeof checkAnswerSchema> = {
                questionId: currentQuestion.id,
                userAnswer: options[selectedOption],
            }

            const response = await axios.post("/api/checkAnswer" , payload);
            return response.data;
        }
    })


    const handleNext = useCallback(() => {
        if(isChecking) return;  

        checkAnswer(undefined , {
            onSuccess: ({isCorrect}) => {                             //isCorrect is coming from the checkAnswer api...
                if(isCorrect) {

                    toast({
                        title: "Correct!",
                        description: "You got it right",
                        variant: "success"
                    })
                    setCorrectAnswers((prev) => prev + 1);

                } else {
                    toast({
                        title: "Wrong!",
                        description: "You got it wrong",
                        variant: "destructive"
                    })
                    setWrongAnswers((prev) => prev + 1);
                }

                if(questionIndex === game.questions.length - 1) {       //agar last question hai to end the game
                    setHasEnded(true);
                    return;
                }

                //ab jab select kr liye ho to ab agle question pr bhi to jana hoga
                setQuestionIndex((prev) => prev + 1);
            }
        });
    }, [checkAnswer , toast, isChecking, questionIndex, game.questions.length]);


    //keyboard keys for selecting the options
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          const key = event.key;
    
          if (key === "1") {
            setSelectedOption(0);
          } else if (key === "2") {
            setSelectedOption(1);
          } else if (key === "3") {
            setSelectedOption(2);
          } else if (key === "4") {
            setSelectedOption(3);
          } else if (key === "Enter") {
            handleNext();
          }
        };
    
        document.addEventListener("keydown", handleKeyDown);
    
        return () => {
          document.removeEventListener("keydown", handleKeyDown);
        };
      }, [handleNext]);


      if (hasEnded) {
        return (
          <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
              You Completed in{""}
              {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
            </div>
            <Link
              href={`/statistics/${game.id}`}
              className={cn(buttonVariants({ size: "lg" }), "mt-2")}
            >
              View Statistics
              <BarChart className="w-4 h-4 ml-2" />
            </Link>
          </div>
        );
      }



  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">

        <div className=' flex flex-row justify-between'>
            <div className=' flex flex-col'>

                <p>
                    <span className=' text-slate-400 mr-2'>Topic</span>
                    <span className=' px-2 py-1 text-white rounded-lg bg-slate-800 '>{game.topic}</span>
                </p>

                <div className=' flex self-start mt-3 text-slate-400'>
                    <Timer className=' mr-2'/>
                    {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
                </div>
            </div>
            
            <MCQCounter correct_answers={correctAnswers} wrong_answers={wrongAnswers}/>
        </div>

        <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
             {currentQuestion?.question} 
          </CardDescription>
        </CardHeader>
      </Card>

        {/* Showing options */}

      <div className="flex flex-col items-center justify-center w-full mt-4">
        {options.map((option, index) => {
          return (
            <Button
              key={option}
              variant={selectedOption === index ? "default" : "outline"}
              className="justify-start w-full py-8 mb-4"
              onClick={() => setSelectedOption(index)}
            >
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })}
        <Button
          variant="default"
          className="mt-2"
          size="lg"
          disabled={isChecking}
          onClick={() => {
            handleNext();
          }}
        >
          {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Next <ChevronRight className="w-4 h-4 ml-2" />  
        </Button>
      </div>


    </div>
  )
}

export default MCQ