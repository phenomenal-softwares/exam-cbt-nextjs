'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/services/firebase';
import Sidebar from '@/components/Admin/Dashboard/Sidebar';
import LoadingOverlay from '@/components/UI/LoadingOverlay/LoadingOverlay';

import '../../components/Admin/Dashboard/adminDashboard.css';
import '@/app/results/results.css';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Rule 1: Block mobile access
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setLoading(false);
      return;
    }

    // Rule 2: Enforce admin-only login
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user || user.email !== "admin@dolapoexamportal.com") {
        router.replace('/admin-login');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <LoadingOverlay />;

  if (isMobile) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'crimson' }}>
        <h2>Access Denied</h2>
        <p>The admin suite is only accessible on laptops or desktop devices.</p>
      </div>
    );
  }

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
