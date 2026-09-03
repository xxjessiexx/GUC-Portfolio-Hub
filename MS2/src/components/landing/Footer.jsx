import { Link } from "react-router-dom";

const sectionLinks = [
  [
    "Student Work",
    "#student-work",
  ],
  [
    "How It Works",
    "#how-it-works",
  ],
  [
    "Developers",
    "#developers",
  ],
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[linear-gradient(135deg,#2C3947,#355872)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-black tracking-tight text-white">
              GUC Portfolio Hub
            </h3>

            <p className="mt-4 text-sm leading-6 text-white/70">
              A platform for GUC students to
              showcase projects, collaborate with
              peers, and present their academic
              work professionally.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white/90">
              Landing Page
            </h4>

            <ul className="space-y-3 text-sm">
              {sectionLinks.map(
                ([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="inline-block text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white/90">
              Account
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/login"
                  className="inline-block text-white/70 transition hover:text-white"
                >
                  Log in
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="inline-block text-white/70 transition hover:text-white"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-white/90">
              Built at GUC
            </h4>

            <p className="text-sm leading-6 text-white/70">
              Designed and developed by GUC students
              as a student-first portfolio and
              project showcase experience.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} GUC
            Portfolio Hub. All rights reserved.
          </p>

          <a
            href="#home"
            className="text-sm font-bold text-white/60 transition hover:text-white"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}