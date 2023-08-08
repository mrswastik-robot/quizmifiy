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


import { BookOpen, CopyCheck } from 'lucide-react';

type Props = {}

type Input = z.infer<typeof quizFormSchema>

const QuizCreation = (props: Props) => {

    const form = useForm<Input>({
        resolver: zodResolver(quizFormSchema),
        defaultValues: {
            topic: '',
            amount: 3,
            type: "open_ended",
        }
    })

    function onSubmit(input: Input) {
        alert(JSON.stringify(input ,null ,2))           //isse mast json format me print ho kr aa rha object with all inputs in the middle of the screen
    }

    form.watch();


  return (
    <div className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
        <Card>

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

                            <Button className=' w-1/2 rounded-none rounded-l-lg'
                            variant={
                                form.getValues("type") === "mcq" ? "default" : "secondary"        //1:37
                              }
                              onClick={() => {
                                form.setValue("type", "mcq");
                              }}
                              type="button"
                            >
                                <CopyCheck className=' w-4 h-4 mr-2'/> Mutiple Choice Questions
                            </Button>

                            <Separator orientation='vertical'/>

                            <Button className=' w-1/2 rounded-none rounded-r-lg'
                            variant={
                                form.getValues("type") === "open_ended" ? "default" : "secondary"
                              }
                              onClick={() => {
                                form.setValue("type", "open_ended");
                              }}
                              type="button"
                            >
                                <BookOpen className=' w-4 h-4 mr-2'/> Open Ended Questions
                            </Button>
                        </div>


                        <Button type="submit">Submit</Button>
                    </form>
                </Form>

            </CardContent>
        </Card>
    </div>
  )
}

export default QuizCreation