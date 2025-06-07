"use client";

import { Suspense } from "react";
import ExamSuspenseWrapper from "@/components/Exam/ExamSuspenseWrapper";

export default function ExamPageWrapper() {
  return (
    <Suspense fallback={<div>Loading Exam...</div>}>
      <ExamSuspenseWrapper />
    </Suspense>
  );
}
