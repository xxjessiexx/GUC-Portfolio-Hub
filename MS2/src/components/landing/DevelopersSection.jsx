    import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
    import { motion } from "framer-motion";

export default function DevelopersSection({developers}) {
return (
    <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-widest text-[#355872]">
            Meet the Developers
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#102630]">
            Built by GUC students, for GUC students
            </h2>

            <p className="mt-4 leading-7 text-[#7B8794]">
            The team behind the platform — designing, building, and refining a
            student-first experience.
            </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
            {developers.map((dev, index) => (
            <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                y: -10,
                rotateX: 4,
                rotateY: index % 2 === 0 ? -4 : 4,
                scale: 1.015,
                }}
                transition={{ duration: 0.35 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-[32px] border border-white/80 bg-white/60 p-7 shadow-[0_24px_70px_rgba(53,88,114,0.13)] backdrop-blur-2xl"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(156,213,255,0.32),transparent_55%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#E6C77B]/20 blur-2xl" />

                <div className="relative z-10">
                <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full border border-white/80 bg-[linear-gradient(135deg,#355872,#7AAACE)] text-2xl font-black text-white shadow-[0_18px_45px_rgba(53,88,114,0.25)]">
                    {dev.initials}
                </div>

                <div className="text-center">
                    <h3 className="text-xl font-black text-[#102630]">
                    {dev.name}
                    </h3>

                    <p className="mt-1 text-sm font-extrabold text-[#355872]">
                    {dev.role}
                    </p>

                    <p className="mx-auto mt-4 max-w-[260px] text-sm leading-6 text-[#7B8794]">
                    {dev.desc}
                    </p>
                </div>

                <div className="mt-7 flex justify-center gap-3">
                    {[FaGithub, FaLinkedin, FaEnvelope].map((Icon, i) => (
                    <a
                        key={i}
                        href="#"
                        className="grid h-10 w-10 place-items-center rounded-2xl border border-[#355872]/10 bg-white/65 text-[#355872] shadow-sm transition hover:-translate-y-1 hover:bg-[#9CD5FF]/25"
                    >
                        <Icon className="h-5 w-5" />
                    </a>
                    ))}
                </div>
                </div>
            </motion.div>
            ))}
        </div>
        </div>
    </section>
);
}