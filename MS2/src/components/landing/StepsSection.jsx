export default function StepsSection({steps}) {
return (
    <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-white/70 bg-white/55 p-10 shadow-[0_24px_80px_rgba(53,88,114,0.14)] backdrop-blur-2xl">
        <div className="mb-12 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-[#355872]">
            How it works
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#102630]">
            From project idea to public portfolio
            </h2>
        </div>

        <div className="relative grid gap-8 md:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-transparent via-[#7AAACE]/50 to-transparent md:block" />

            {steps.map(({ number, title, text, icon: Icon }) => (
            <div key={title} className="relative text-center">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-white/80 bg-[#9CD5FF]/30 shadow-[0_14px_35px_rgba(53,88,114,0.14)]">
                <Icon className="h-8 w-8 text-[#355872]" />
                </div>

                <span className="mb-3 inline-flex rounded-full bg-[#E6C77B]/25 px-3 py-1 text-xs font-black text-[#355872]">
                {number}
                </span>

                <h3 className="text-lg font-black text-[#102630]">{title}</h3>

                <p className="mx-auto mt-3 max-w-[230px] text-sm leading-6 text-[#7B8794]">
                {text}
                </p>
            </div>
            ))}
        </div>
        </div>
    </section>
);
}