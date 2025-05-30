'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';

export default function Sidebar() {
  const pathname = usePathname();
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const fetchMessageCounts = async () => {
      try {
        const studentSnapshot = await getDocs(collection(db, 'messages'));
        const parentSnapshot = await getDocs(collection(db, 'parentMessages'));

        const totalMessages = studentSnapshot.size + parentSnapshot.size;
        setMessageCount(totalMessages);
      } catch (error) {
        console.error('Failed to fetch message count:', error);
      }
    };

    fetchMessageCounts();
  }, []);

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/overview' },
    { name: 'Student Management', path: '/admin/students' },
    { name: 'Question Management', path: '/admin/questions' },
    { name: 'Parent Management', path: '/admin/parents' },
    { name: 'Exam Results', path: '/admin/results' },
    {
      name: `Inbox Messages${messageCount > 0 ? ` (${messageCount})` : ''}`,
      path: '/admin/messages',
    },
    { name: 'Account Settings', path: '/admin/settings' },
    { name: 'Sign Out', path: '/admin/signout' },
  ];

  return (
    <nav className="sidebar-nav">
      <ul>
        {navItems.map(({ name, path }) => (
          <li key={path} className={pathname === path ? 'active' : ''}>
            <Link href={path}>{name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
