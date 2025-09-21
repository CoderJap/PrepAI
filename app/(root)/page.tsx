import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import { dummyInterviews } from "@/constants";
import ResumeReviewer from "@/components/ResumeReviewer";
import { getCurrentUser } from "@/lib/actions/auth.action";
import ChatbotWrapper from "@/components/Chatbotwrapper";
import Navigation from "@/components/Navigation";

const Page = async () => {
  // Add async here
  const user = await getCurrentUser(); // Add await here

  return (
    <>
      <Navigation />

      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice on real interview questions & get instant feedback
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
      </section>

      {/* <section>
        <div>Resume Reviewer</div>
        <ResumeReviewer userId={user?.id || null} />
      </section> */}

      <section>
        <ChatbotWrapper />
      </section>
    </>
  );
};

export default Page;
