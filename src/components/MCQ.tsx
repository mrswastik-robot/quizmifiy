"use client"

import { Game, Question } from '@prisma/client'
import { Timer } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import React from 'react'
import { Card , CardHeader ,CardTitle, CardDescription, CardContent } from './ui/card'
import { Button } from './ui/button'
import { useMemo, useState } from 'react'

type Props = {
    game: Game & {questions: Pick<Question, "id" | "options" | "question">[]}           //2:35:25   // in the [gameId]page , we were getting the questions using the 'include' but here using the 'game' sent from the [gameId]page , we are not getting the questions
                                                                                        //didn't want answer so had to use Pick to select the fields we want to show
}       

const MCQ = ({game}: Props) => {

    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number>(0);       //all the options bg are black , we need to know which option has been selected inorder to differentiate it from the rest , just like we did in mcq and open_ended button in the quiz form , changing the bg on the button which is clicked

    const currentQuestion = useMemo(() => {
        return game.questions[questionIndex];
    }, [questionIndex, game.questions]);

    const options = useMemo(() => {           //getting the options of currentQuestions 2:42
        if(!currentQuestion) return[];
        if(!currentQuestion.options) return[];

        return JSON.parse(currentQuestion.options as string) as string[];
    },[currentQuestion]);

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">

        <div className=' flex flex-row justify-between'>
            {/* <div className=' flex flex-col'> */}

                <p>
                    <span className=' text-slate-400 mr-2'>Topic</span>
                    <span className=' px-2 py-1 text-white rounded-lg bg-slate-800 '>{game.topic}</span>
                </p>

                <div className=' flex self-start mt-3 text-slate-400'>
                    <Timer className=' mr-2'/>
                    <span>11:11</span>
                </div>

                {/* MCQCounter */}

            {/* </div> */}
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
        //   disabled={isChecking || hasEnded}
        //   onClick={() => {
        //     handleNext();
        //   }}
        >
          {/* {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} */}
          Next <ChevronRight className="w-4 h-4 ml-2" />  
        </Button>
      </div>


    </div>
  )
}

export default MCQ