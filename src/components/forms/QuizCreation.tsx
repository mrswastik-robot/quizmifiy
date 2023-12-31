"use client";

import React from 'react'

import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


import { z } from 'zod'
import { quizFormSchema } from '@/schemas/form/quiz'
import { useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {useMutation} from '@tanstack/react-query'  
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { BookOpen, CopyCheck } from 'lucide-react';

import LoadingQuestions from '../LoadingQuestions';


type Props = {}

type Input = z.infer<typeof quizFormSchema>

const QuizCreation = (props: Props) => {

    const router = useRouter();

    const [showLoader , setShowLoader] = React.useState(false);
    const [finishedLoading, setFinishedLoading] = React.useState(false);


    const {mutate: getQuestions , isLoading}  = useMutation({                                             //2:18
        mutationFn: async ({topic, amount, type}: Input) => {
            const response = await axios.post('/api/game', {
                amount,
                topic,
                type
            })

            return response.data;
        }
    })


    const form = useForm<Input>({
        resolver: zodResolver(quizFormSchema),
        defaultValues: {
            topic: '',
            amount: 3,
            type: "open_ended",
        }
    })

    function onSubmit(input: Input) {
        // alert(JSON.stringify(input ,null ,2))           //isse mast json format me print ho kr aa rha object with all inputs in the middle of the screen

        setShowLoader(true);
        
        getQuestions({
            topic: input.topic,
            amount: input.amount,
            type: input.type
        },{
            onSuccess: ({gameId}) => {

                setFinishedLoading(true);          //ending the loading screen and then now I am moving this whole function inside timeout so that the loading screen stays for 1 sec and then the questions appear
                setTimeout(() => {
                if(form.getValues("type") == "open_ended") {
                    router.push(`/play/open-ended/${gameId}`)
                }else{
                    router.push(`/play/mcq/${gameId}`)
                }
            }, 1000);

            },
            onError: () => {
                setShowLoader(false);
            }
        })
    }

    form.watch();

    if(showLoader)
    {
        return <LoadingQuestions finished={finishedLoading}/>
    }


  return (
    // <div className=' flex items-center justify-center my-[9%] overflow-y-hidden mx-auto sm:w-4/5 md:w-3/5 lg:w-full'>
      <div className=' absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'> 
        <Card className=' shadow-lg w-[370px] lg:w-[600px]'>

            <CardHeader>
                <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
                <CardDescription>Choose a topic</CardDescription>
            </CardHeader>

            <CardContent>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Topic</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter a topic..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Please provide a topic.
                            </FormDescription>
                            <FormMessage />    {/*ye show krega wo formSchema wala error message ki topic should be atleast 4 characters long */}
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Number of Questions</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter an amount..." {...field}
                                type='number'
                                min={1}
                                max={10}
                                onChange={(e) => {
                                    form.setValue('amount', parseInt(e.target.value))
                                    {/*isse ho ye raha ki ek to sirf integers hi input me daal skte aur 1 se 10 k beech me nhi to error dega 
                                        aur ye form.setValue kr paa rahe kyunki form variable is coming from react-hook-form so it provides us with a lot of utility function       //1:34 */}
                                }}
                                />
                            </FormControl>
                            <FormDescription>
                                You can choose how many questions you would like to be
                                quizzed on here.
                            </FormDescription>
                            <FormMessage />    
                            </FormItem>
                        )}
                        />


                        <div className=' flex justify-between'>

                            <Button className=' w-1/2 rounded-none rounded-l-lg p-1'
                            variant={
                                form.getValues("type") === "mcq" ? "default" : "secondary"        //1:37
                              }
                              onClick={() => {
                                form.setValue("type", "mcq");
                              }}
                              type="button"
                            >
                                <CopyCheck className=' w-4 h-4 mr-2'/><span className=' text-xs md:text-sm'>MCQ</span> 
                            </Button>

                            <Separator orientation='vertical'/>

                            <Button className=' w-1/2 rounded-none rounded-r-lg p-1'
                            variant={
                                form.getValues("type") === "open_ended" ? "default" : "secondary"
                              }
                              onClick={() => {
                                form.setValue("type", "open_ended");
                              }}
                              type="button"
                            >
                                <BookOpen className=' w-4 h-4 mr-2'/> <span className=' text-xs md:text-sm'>Open-Ended</span>
                            </Button>
                        </div>


                        <Button disabled={isLoading} type="submit">Submit</Button>
                    </form>
                </Form>

            </CardContent>
        </Card>
    </div>
  )
}

export default QuizCreation