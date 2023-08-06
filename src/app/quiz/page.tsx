import React from 'react'

import { getAuthSession } from '@/lib/next-auth'
import { redirect } from 'next/navigation'

import QuizCreation from '@/components/forms/QuizCreation'

type Props = {}

export const metadata = {
    title: "Quiz | quizmify",
}

const QuizPage = async(props: Props) => {

    //protecting the quiz page , if the user is not logged in so can't go to quiz page
    const session = await getAuthSession();
    if(!session?.user) {
        redirect("/")
    }

  return (
    <div>
        <QuizCreation />
    </div>
  )
}

export default QuizPage