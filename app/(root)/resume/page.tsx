// app/(root)/resume/page.tsx
import ResumeReviewer from "@/components/ResumeReviewer";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <ResumeReviewer userId={user?.id || null} />
    </div>
  );
};

export default Page;
