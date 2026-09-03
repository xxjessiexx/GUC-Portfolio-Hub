export default function StepsSection({ steps }) {
  return (
    <section
      id="how-it-works"
      className="
        relative z-10
        scroll-mt-4
        overflow-hidden
        bg-[#F7FBFD]
        px-6
        py-20
      "
    >
      <div
        className="
          pointer-events-none
          absolute -left-36 top-1/2
          h-[420px] w-[420px]
          -translate-y-1/2
          rounded-full
          bg-[radial-gradient(circle,rgba(156,213,255,0.16),transparent_68%)]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute -right-40 top-1/3
          h-[420px] w-[420px]
          rounded-full
          bg-[radial-gradient(circle,rgba(53,88,114,0.08),transparent_70%)]
          blur-3xl
        "
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p
            className="
              text-xs font-black uppercase
              tracking-[0.18em]
              text-[#355872]
            "
          >
            How It Works
          </p>

          <h2
            className="
              mt-3
              max-w-3xl
              text-4xl font-black
              leading-tight
              tracking-tight
              text-[#102630]
              sm:text-5xl
            "
          >
            From project idea to polished portfolio
          </h2>

          <p
            className="
              mt-4
              max-w-2xl
              text-base leading-7
              text-[#5F6F7D]
            "
          >
            Build your academic identity once, then keep adding work as your
            projects and experience grow.
          </p>
        </div>

        <div
          className="
            relative
            rounded-[32px]
            border border-[#355872]/12
            bg-[#E7F2F8]
            px-8 py-11
            shadow-[0_22px_58px_rgba(44,57,71,0.10)]
          "
        >
          <div
            className="
              absolute
              left-[11%] right-[11%]
              top-[5rem]
              hidden h-[2px]
              bg-[linear-gradient(90deg,transparent,rgba(53,88,114,0.34),rgba(122,170,206,0.46),rgba(53,88,114,0.34),transparent)]
              md:block
            "
          />

          <div className="relative grid gap-10 md:grid-cols-4">
            {steps.map(({ number, title, text, icon: Icon }) => (
              <div
                key={title}
                className="relative text-center"
              >
                <div
                  className="
                    mx-auto mb-5
                    grid h-16 w-16
                    place-items-center
                    rounded-[20px]
                    border border-[#355872]/10
                    bg-[#F7FBFD]
                    shadow-[0_12px_26px_rgba(53,88,114,0.10)]
                  "
                >
                  <Icon className="h-8 w-8 text-[#355872]" />
                </div>

                <span
                  className="
                    mb-3 inline-flex
                    rounded-full
                    bg-[#355872]/10
                    px-3 py-1
                    text-[10px] font-black
                    text-[#355872]
                  "
                >
                  {number}
                </span>

                <h3
                  className="
                    text-lg font-black
                    text-[#102630]
                  "
                >
                  {title}
                </h3>

                <p
                  className="
                    mx-auto mt-3
                    max-w-[230px]
                    text-sm leading-6
                    text-[#5F6F7D]
                  "
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}