import { useRouter } from "next/router";
import Head from "next/head";

export default function Landing() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>AnalyzetoX - Turn Videos into X Threads</title>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link href="https://fonts.cdnfonts.com/css/academy-engraved-let" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/big-caslon" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-black">
        {/* Retro Grid Background */}
        <div className="grid-background">
          <div className="perspective-grid"></div>
        </div>

        {/* Content on top */}
        <div className="content-wrapper min-h-screen flex items-center justify-center p-8">
          <div className="max-w-7xl w-full space-y-16 flex flex-col items-center">
            {/* Top Stack (3 connected boxes) */}
            <div className="flex flex-col items-center">
              {/* Logo Box (Biggest) */}
              <div className="relative w-full max-w-[1000px]">
                <div className="absolute top-2 left-2 bg-white rounded-2xl w-full h-full"></div>
                <div className="relative bg-black border-4 border-white rounded-2xl p-12 text-center flex items-center justify-center">
                  <h1 className="caslon-font text-white flex items-center justify-center gap-1 text-5xl sm:text-6xl md:text-7xl">
                    Analyzeto
                    <svg
                      className="inline-block ml-1 w-12 h-12 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px]"
                      viewBox="0 0 24 24"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </h1>
                </div>
              </div>

              {/* Tagline Box (Medium) */}
              <div className="relative w-full max-w-[900px] -mt-4">
                <div className="absolute top-2 left-2 bg-white rounded-2xl w-full h-full"></div>
                <div className="relative bg-black border-4 border-white rounded-2xl p-8 flex items-center justify-center">
                  <div className="typewriter-container text-white academy-font text-2xl sm:text-3xl md:text-[35px]">
                    <span className="typewriter" id="typewriter1">
                      Turn any video into an X thread people actually read.
                    </span>
                  </div>
                </div>
              </div>

              {/* Subheading Box (Smallest) */}
              <div className="relative w-full max-w-[800px] -mt-4">
                <div className="absolute top-2 left-2 bg-white rounded-2xl w-full h-full"></div>
                <div className="relative bg-black border-4 border-white rounded-2xl p-6 flex items-center justify-center">
                  <div className="typewriter-container text-white academy-font text-xl sm:text-2xl md:text-[27px]">
                    <span className="typewriter-second" id="typewriter2">
                      AI summary + real crowd reaction = threads that feel human.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stack (2 connected boxes) */}
            <div className="flex flex-col items-center">
              {/* Try Demo Button (Smaller) */}
              <div className="relative w-full max-w-[650px]">
                <div className="absolute top-2 left-2 bg-white rounded-2xl w-full h-full"></div>
                <button
                  onClick={() => router.push("/demo")}
                  className="button-shimmer relative w-full bg-black border-4 border-white rounded-2xl px-8 py-6 text-center hover:bg-gray-900 hover:scale-105 transition-transform duration-200 flex items-center justify-center overflow-hidden"
                >
                  <span className="caslon-font text-white relative z-10 text-2xl sm:text-3xl md:text-[32px]">
                    Try Demo
                  </span>
                </button>
              </div>

              {/* Generate Thread Button (Bigger) */}
              <div className="relative w-full max-w-[750px] -mt-4">
                <div className="absolute top-2 left-2 bg-white rounded-2xl w-full h-full"></div>
                <button
                  onClick={() => router.push("/app")}
                  className="button-shimmer relative w-full bg-black border-4 border-white rounded-2xl px-12 py-8 text-center hover:bg-gray-900 hover:scale-105 transition-transform duration-200 flex items-center justify-center overflow-hidden"
                >
                  <span className="caslon-font text-white relative z-10 text-3xl sm:text-4xl md:text-[40px]">
                    Generate Thread
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .academy-font {
          font-family: 'Academy Engraved LET', serif;
        }

        .caslon-font {
          font-family: 'Big Caslon', serif;
          font-weight: bold;
        }

        .typewriter {
          overflow: hidden;
          border-right: 2px solid white;
          white-space: nowrap;
          animation: typing 2s steps(60, end), blink-caret 0.75s step-end infinite;
        }

        .typewriter-second {
          overflow: hidden;
          border-right: 2px solid white;
          white-space: nowrap;
          animation: typing 2s steps(70, end) 0.5s both,
            blink-caret 0.75s step-end infinite 0.5s;
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: white;
          }
        }

        .typewriter-done {
          border-right: none;
        }

        /* Retro grid background */
        .grid-background {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60vh;
          overflow: hidden;
          z-index: 0;
          perspective: 500px;
        }

        .perspective-grid {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 150%;
          transform-origin: bottom center;
          transform: rotateX(75deg);
          background-image: linear-gradient(
              0deg,
              transparent 49%,
              rgba(255, 255, 255, 0.4) 49%,
              rgba(255, 255, 255, 0.4) 51%,
              transparent 51%
            ),
            linear-gradient(
              90deg,
              transparent 49%,
              rgba(255, 255, 255, 0.4) 49%,
              rgba(255, 255, 255, 0.4) 51%,
              transparent 51%
            );
          background-size: 100px 100px;
          background-position: 0 0;
          animation: gridMove 15s linear infinite;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.5) 20%,
            rgba(0, 0, 0, 1) 40%,
            rgba(0, 0, 0, 1) 100%
          );
          -webkit-mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.5) 20%,
            rgba(0, 0, 0, 1) 40%,
            rgba(0, 0, 0, 1) 100%
          );
        }

        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100px;
          }
        }

        .content-wrapper {
          position: relative;
          z-index: 10;
        }

        .typewriter-container {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        /* Subtle shimmer effect on border */
        .button-shimmer {
          position: relative;
        }

        .button-shimmer::after {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border-radius: 1rem;
          background: conic-gradient(
            from var(--angle),
            transparent 70%,
            rgba(255, 255, 255, 0.4) 80%,
            rgba(255, 255, 255, 0.6) 85%,
            rgba(255, 255, 255, 0.4) 90%,
            transparent 100%
          );
          animation: rotate 6s linear infinite;
          pointer-events: none;
          opacity: 0.6;
        }

        @keyframes rotate {
          0% {
            --angle: 0deg;
            transform: rotate(0deg);
          }
          100% {
            --angle: 360deg;
            transform: rotate(360deg);
          }
        }

        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @media (max-width: 768px) {
          .typewriter,
          .typewriter-second {
            white-space: normal;
            border-right: none;
            animation: none;
          }
        }
      `}</style>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              const el1 = document.getElementById('typewriter1');
              if (el1) el1.classList.add('typewriter-done');
            }, 2750);
            
            setTimeout(() => {
              const el2 = document.getElementById('typewriter2');
              if (el2) el2.classList.add('typewriter-done');
            }, 3250);
          `,
        }}
      />
    </>
  );
}
