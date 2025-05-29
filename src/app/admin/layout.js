"use client";
import Sidebar from "@/components/Admin/Dashboard/Sidebar";
import Letterhead from "@/components/UI/Letterhead/Letterhead";
import "../../components/Admin/Dashboard/adminDashboard.css";
import "@/app/results/results.css"

export default function AdminLayout({ children }) {
  return (
    <>
      <Letterhead currentTerm={"3RD TERM"} currentSession={"2024/2025"} />
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <Sidebar />
        </aside>
        <main className="admin-main">
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </>
  );
}
