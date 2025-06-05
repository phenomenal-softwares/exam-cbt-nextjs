"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
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
    return;
  }

  const { parentId } = JSON.parse(session);

  const verifyParent = async () => {
    try {
      const docRef = doc(db, "parents", parentId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        localStorage.removeItem("parentSession");
        router.push("/parent-login");
      } else {
        setParentId(parentId);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error verifying parent:", error);
      localStorage.removeItem("parentSession");
      router.push("/parent-login");
    }
  };

  verifyParent();
}, [router]);

  if (loading) return <LoadingOverlay />;

  return (
    <>
      <Letterhead />
      <ParentDashboard parentId={parentId} />
    </>
  );
}
