"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ParentDashboard from "@/components/Parent/ParentDashboard";
import Letterhead from "@/components/UI/Letterhead/Letterhead";
import LoadingOverlay from "@/components/UI/LoadingOverlay/LoadingOverlay";

export default function ParentPage() {
  const [parentId, setParentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("parentSession");
    if (!session) {
      router.push("/parent-login");
    } else {
      const { parentId } = JSON.parse(session);
      setParentId(parentId);
      setLoading(false);
    }
  }, [router]);

  if (loading) return <LoadingOverlay />;

  return (
    <>
      <Letterhead />
      <ParentDashboard parentId={parentId} />
    </>
  );
}
