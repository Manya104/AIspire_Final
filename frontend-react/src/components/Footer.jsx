import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 md:px-20 py-10">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary font-bold">blur_on</span>
          <Link to="/" className="text-lg font-bold hover:text-primary transition-colors">AISPIRE</Link>
        </div>
        <p className="text-slate-500 text-sm text-center md:text-right">
          &copy; 2025 AISPIRE | Built for the National Career Hackathon
        </p>
      </div>
    </footer>
  );
}
