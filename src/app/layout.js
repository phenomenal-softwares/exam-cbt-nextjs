import './globals.css';
import Footer from '@/components/UI/Footer/Footer';

export const metadata = {
  title: 'Dolapo High School Integrated Exam E-Facility',
  description: 'Exam Management System with admin suite, student and parent dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
