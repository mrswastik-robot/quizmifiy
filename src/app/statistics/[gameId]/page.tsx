
import { getAuthSession } from '@/lib/next-auth'

import Link from 'next/link'
import { redirect } from 'next/navigation'

import {prisma} from '@/lib/db'

import { LucideLayoutDashboard } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

type Props = {
    params:{
        gameId: string
    }
}

const StatisticsPage = async({params: {gameId}}: Props) => {

    const session = await getAuthSession();
    if(!session?.user) {
        redirect("/")
    }

    const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { questions: true },
      });
      if (!game) {
        return redirect("/");
      }

  return (

    <>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-7">
          {/* <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard
            timeEnded={new Date(game.timeEnded ?? 0)}
            timeStarted={new Date(game.timeStarted ?? 0)} */}
          {/* /> */}
        </div>
        {/* <QuestionsList questions={game.questions} /> */}
      </div>
    </>
  );
}

export default StatisticsPage   