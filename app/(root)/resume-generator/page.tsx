// app/(root)/resume-generator/page.tsx
import ResumeGenerator from "@/components/ResumeGenerator";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-transparent">
      <ResumeGenerator userId={user?.id || null} />
    </div>
  );
};

export default Page;
