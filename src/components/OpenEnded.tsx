"use client";

import { Game , Question } from '@prisma/client'
import React from 'react'
import { cn, formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
// import OpenEndedPercentage from "./OpenEndedPercentage";
// import BlankAnswerInput from "./BlankAnswerInput";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
// import { checkAnswerSchema, endGameSchema } from "@/schemas/questions";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { useState ,useEffect } from 'react';
import { useMemo , useCallback } from 'react';

import { checkAnswerSchema } from '@/schemas/form/quiz';


import BlankAnswerInput from './BlankAnswerInput';

type Props = {
    game: Game & {questions: Pick<Question, "id" | "question" | "answer">[]}
}

const OpenEnded = ({game}: Props) => {

  const [questionIndex, setQuestionIndex] = useState(0);
    // const [selectedOption, setSelectedOption] = useState<number>(0);       //all the options bg are black , we need to know which option has been selected inorder to differentiate it from the rest , just like we did in mcq and open_ended button in the quiz form , changing the bg on the button which is clicked

    // const [correctAnswers , setCorrectAnswers] = useState<number>(0);
    // const [wrongAnswers , setWrongAnswers] = useState<number>(0);
    const [hasEnded , setHasEnded] = useState<boolean>(false);

    const {toast} = useToast();


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


    const currentQuestion = useMemo(() => {
      return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const {mutate: checkAnswer , isLoading: isChecking} = useMutation({          //similarly done in quizCreationForm.tsx
    mutationFn: async () => {                                                //2:55:00
        const payload: z.infer<typeof checkAnswerSchema> = {
            questionId: currentQuestion.id,
            userAnswer: '',
        }

        const response = await axios.post("/api/checkAnswer" , payload);
        return response.data;
    }
});

const handleNext = useCallback(() => {
  if(isChecking) return;  

  checkAnswer(undefined , {
      onSuccess: ({percentageSimilar}) => {   
        
        toast({
            title: `Your answer is ${percentageSimilar}% similar to the correct answer`,
            description: "You can check the correct answer at the end of the quiz", 
        })
          
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

    if (key === "Enter") {
      handleNext();
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [handleNext]);




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
            
            {/* //MCQCounter */}
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
        {/* //deleted the options here when copying from MCQ.tsx */}

        <BlankAnswerInput answer={currentQuestion.answer}/>

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

export default OpenEnded