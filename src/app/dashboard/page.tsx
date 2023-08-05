
import { getAuthSession } from '@/lib/next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

import QuizMeCard from '@/components/dashboard/QuizMeCard'
import HistoryCard from '@/components/dashboard/HistoryCard'
import HotTopicsCard from '@/components/dashboard/HotTopicsCard'
import RecentActivityCard from '@/components/dashboard/RecentActivities'

type Props = {}

export const metadata = {
    title: 'Dashboard | Quizmify',
}

const DashboardPage = async(props: Props) => {

    const session = await getAuthSession();
    if(!session?.user) {
        redirect('/')             //protecting the dashboard page , if the user is not logged in so can't go to dashboard
    }

  return (
    <main className=' p-8 mx-auto max-w-7xl'>

        <div className=' flex items-center'>
            <h2 className=' mr-2 text-3xl font-bold tracking-tight'>Dashboard</h2>
        </div>

        <div className=' grid md:grid-cols-2 gap-4 mt-4'>
            <QuizMeCard />
            <HistoryCard />
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
            <HotTopicsCard />
            <RecentActivityCard />
      </div>
        
    </main>
  )
}

export default DashboardPage;