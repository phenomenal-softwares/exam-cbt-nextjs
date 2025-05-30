"use client";
import Sidebar from "@/components/Admin/Dashboard/Sidebar";
import Letterhead from "@/components/UI/Letterhead/Letterhead";
import "../../components/Admin/Dashboard/adminDashboard.css";
import "@/app/results/results.css"

export default function AdminLayout({ children }) {
  return (
    <>
      <div className="admin-header">
        ADMIN SUITE | DOLAPO HIGH SCHOOL INTEGRATED EXAM PORTAL
      </div>
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
