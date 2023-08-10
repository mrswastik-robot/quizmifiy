import React from 'react'

type Props = {
    answer: string;
}

const BlankAnswerInput = ({answer}: Props) => {
  return (
    <div className=' flex justify-start w-full mt-4'>
        <h1 className=' text-xl font-semibold'>{answer}</h1>
    </div>
  )
}

export default BlankAnswerInput