"use client";

import { useSearchParams } from "next/navigation";
import ExamPage from "@/components/Exam/ExamPage";

const ExamRoutePage = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const classLevel = searchParams.get("classLevel");
  const name = searchParams.get("name");
  const uid = searchParams.get("uid");

  return <ExamPage subject={subject} classLevel={classLevel} name={name} uid={uid} />;
};

export default ExamRoutePage;
