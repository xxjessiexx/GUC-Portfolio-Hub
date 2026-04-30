import { Link } from "react-router-dom";
export default function Footer() {
return (
<footer className="relative z-10 mt-10 border-t border-white/10 bg-[linear-gradient(135deg,#2C3947,#355872)] text-white backdrop-blur-2xl">
  <div className="mx-auto max-w-7xl px-6 py-20">

    <div className="grid gap-12 md:grid-cols-4">
      
      {/* BRAND */}
      <div>
        <h3 className="text-xl font-black text-white tracking-tight">
          GUC Portfolio Hub
        </h3>

        <p className="mt-4 text-sm leading-6 text-white/70">
          A platform for GUC students to showcase projects, collaborate with peers,
          and connect with instructors and employers.
        </p>
      </div>

      {/* PLATFORM */}
      <div>
        <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white/90">
          Platform
        </h4>

        <ul className="space-y-3 text-sm">
          {[
            ["Explore Projects", "/projects"],
            ["Portfolios", "/portfolios"],
            ["Internships", "/internships"],
          ].map(([label, link]) => (
            <li key={label}>
              <Link
                to={link}
                className="text-white/70 transition-all duration-200 hover:text-white hover:translate-x-1 inline-block"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* USERS */}
      <div>
        <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white/90">
          Users
        </h4>

        <ul className="space-y-3 text-sm text-white/70">
          <li className="hover:text-white transition">Students</li>
          <li className="hover:text-white transition">Instructors</li>
          <li className="hover:text-white transition">Employers</li>
        </ul>
      </div>

      {/* COMPANY */}
      <div>
        <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white/90">
          Company
        </h4>

        <ul className="space-y-3 text-sm text-white/70">
          <li className="hover:text-white transition">About</li>
          <li className="hover:text-white transition">Contact</li>
          <li className="hover:text-white transition">Privacy Policy</li>
        </ul>
      </div>

    </div>

    {/* DIVIDER */}
    <div className="mt-14 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

      <p className="text-sm text-white/50">
        © {new Date().getFullYear()} GUC Portfolio Hub. All rights reserved.
      </p>

      <div className="flex items-center gap-6 text-sm text-white/60">
        <span className="hover:text-white transition cursor-pointer">Terms</span>
        <span className="hover:text-white transition cursor-pointer">Privacy</span>

        {/* subtle gold accent */}
        <span className="h-1 w-1 rounded-full bg-[#E6C77B]" />
      </div>

    </div>

  </div>
</footer>
);}
