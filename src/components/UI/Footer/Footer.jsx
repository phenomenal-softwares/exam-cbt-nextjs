'use client';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={footerStyle}>
      <a
        href="https://abiodunojo.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        Phenomenal Productions © {year}
      </a>
    </footer>
  );
}

const footerStyle = {
  textAlign: 'center',
  padding: '1rem',
  fontSize: '0.9rem',
  marginTop: '2rem',
  backgroundColor: 'ivory'
};

const linkStyle = {
  color: '#555',
  textDecoration: 'none',
  fontWeight: 'bold',
};
