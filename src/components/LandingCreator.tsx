import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils';

import { Poppins } from "next/font/google";
const poppins = Poppins({ weight: "600", subsets: ["latin"] });

import { Github, InstagramIcon , Linkedin } from 'lucide-react'

export const CreatorSection = () => {
  return (
    <div className='flex items-center justify-center mt-9 pb-7 lg:pb-0'>
        <div className=' h-[17.3rem] w-[19rem] md:h-[19rem] md:w-[25rem] rounded-lg p-2 space-y-5'>
            <p className={cn('  font-semibold text-center text-3xl' , poppins.className)}>An app by - </p>
            <div className=' justify-center items-center flex'>
                <Image src='/githubDP.jpeg' alt='logo' width={100} height={100} className=' border-4  border-yellow-400 rounded-full shadow-2xl'/>
            </div>
            <p className=' text-center text-zinc-500 text-muted-foreground text-xl'>mrswastik-robot</p>

            <div className='flex justify-center items-center gap-x-8'>

                <Link href="https://www.instagram.com/t.e_.n._e.t/" target='_blank'>
                    <InstagramIcon className=' h-8 w-8 text-yellow-500/60'/>
                </Link>

                <Link href="https://github.com/mrswastik-robot" target='_blank'>
                    <Github className=' h-8 w-8 text-yellow-500/60'/>
                </Link>

                <Link href="https://www.linkedin.com/in/swastik-patel-9b1254232/" target='_blank'>
                    <Linkedin className=' h-8 w-8 text-yellow-500/60'/>
                </Link>
            </div>
            
        </div>

    </div>
  )
}

