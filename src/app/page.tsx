
import SignInButton from "@/components/Signinbutton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import LandingHero from "@/components/LandingHero";
import { CreatorSection } from "@/components/LandingCreator";

export default async function Home() {

  const session = await getServerSession();
  if (session?.user) {
     return redirect("/dashboard");        //this is protecting, like if the user is logged in so can't go to "/"
  }

  return (
    <div className=" text-center items-center font-bold overflow-hidden space-y-7">

        <LandingHero/>



        <div className="flex items-center justify-center mx-auto sm:mt-5 md:mt-0">
          <Card className="w-[300px] shadow-2xl">
            <CardHeader>
              <CardTitle>Welcome to Quizmify 🔥!</CardTitle>
              <CardDescription>
                Quizmify is a platform for creating quizzes using AI!. Get started
                by loggin in below!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInButton text="Sign In with Google" />
            </CardContent>
          </Card>
        </div>

        <CreatorSection />

    </div>
      
    
  );
}