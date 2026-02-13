import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>AnalyzetoX - New Design</title>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link href="https://fonts.cdnfonts.com/css/academy-engraved-let" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/big-caslon" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
        {/* Retro Grid Background */}
        <div className="grid-background">
          <div className="perspective-grid"></div>
        </div>

        {/* Content on top */}
        <div style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }}>
          <div style={{
            maxWidth: "80rem",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4rem"
          }}>
            {/* Top Stack (3 connected boxes) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Logo Box (Biggest) */}
              <div style={{ position: "relative", width: "1000px" }}>
                <div style={{
                  position: "absolute",
                  top: "0.5rem",
                  left: "0.5rem",
                  backgroundColor: "#fff",
                  borderRadius: "1rem",
                  width: "100%",
                  height: "100%"
                }}></div>
                <div style={{
                  position: "relative",
                  backgroundColor: "#000",
                  border: "4px solid #fff",
                  borderRadius: "1rem",
                  padding: "3rem",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <h1 className="caslon-font" style={{
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.25rem",
                    fontSize: "70px",
                    margin: 0
                  }}>
                    Analyzeto
                    <svg style={{
                      display: "inline-block",
                      marginLeft: "0.25rem",
                      width: "70px",
                      height: "70px"
                    }} viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </h1>
                </div>
              </div>
              
              {/* Tagline Box (Medium) */}
              <div style={{ position: "relative", width: "900px", marginTop: "-1rem" }}>
                <div style={{
                  position: "absolute",
                  top: "0.5rem",
                  left: "0.5rem",
                  backgroundColor: "#fff",
                  borderRadius: "1rem",
                  width: "100%",
                  height: "100%"
                }}></div>
                <div style={{
                  position: "relative",
                  backgroundColor: "#000",
                  border: "4px solid #fff",
                  borderRadius: "1rem",
                  padding: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%"
                  }}>
                    <span className="typewriter academy-font" id="typewriter1" style={{
                      color: "#fff",
                      fontSize: "35px"
                    }}>Turn any video into an X thread people actually read.</span>
                  </div>
                </div>
              </div>

              {/* Subheading Box (Smallest) */}
              <div style={{ position: "relative", width: "800px", marginTop: "-1rem" }}>
                <div style={{
                  position: "absolute",
                  top: "0.5rem",
                  left: "0.5rem",
                  backgroundColor: "#fff",
                  borderRadius: "1rem",
                  width: "100%",
                  height: "100%"
                }}></div>
                <div style={{
                  position: "relative",
                  backgroundColor: "#000",
                  border: "4px solid #fff",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "center"
                  }}>
                    <span className="typewriter-second academy-font" id="typewriter2" style={{
                      color: "#fff",
                      fontSize: "27px",
                      display: "inline-block"
                    }}>AI summary + real crowd reaction = threads that feel human.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stack (2 connected boxes) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Try Demo Button (Smaller) */}
              <div style={{ position: "relative", width: "650px" }}>
                <div style={{
                  position: "absolute",
                  top: "0.5rem",
                  left: "0.5rem",
                  backgroundColor: "#fff",
                  borderRadius: "1rem",
                  width: "100%",
                  height: "100%"
                }}></div>
                <button
                  onClick={() => router.push("/demo")}
                  style={{
                    position: "relative",
                    width: "100%",
                    backgroundColor: "#000",
                    border: "4px solid #fff",
                    borderRadius: "1rem",
                    padding: "1.5rem 2rem",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#111827";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#000";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <span className="caslon-font" style={{
                    color: "#fff",
                    position: "relative",
                    zIndex: 10,
                    fontSize: "32px"
                  }}>Try Demo</span>
                </button>
              </div>

              {/* Generate Thread Button (Bigger) */}
              <div style={{ position: "relative", width: "750px", marginTop: "-1rem" }}>
                <div style={{
                  position: "absolute",
                  top: "0.5rem",
                  left: "0.5rem",
                  backgroundColor: "#fff",
                  borderRadius: "1rem",
                  width: "100%",
                  height: "100%"
                }}></div>
                <button
                  onClick={() => router.push("/app")}
                  style={{
                    position: "relative",
                    width: "100%",
                    backgroundColor: "#000",
                    border: "4px solid #fff",
                    borderRadius: "1rem",
                    padding: "2rem 3rem",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#111827";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#000";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <span className="caslon-font" style={{
                    color: "#fff",
                    position: "relative",
                    zIndex: 10,
                    fontSize: "40px"
                  }}>Generate Thread</span>
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
          animation: typing 2s steps(70, end) 0.5s both, blink-caret 0.75s step-end infinite 0.5s;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: white; }
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
          background-image: 
            linear-gradient(0deg, transparent 49%, rgba(255, 255, 255, 0.4) 49%, rgba(255, 255, 255, 0.4) 51%, transparent 51%),
            linear-gradient(90deg, transparent 49%, rgba(255, 255, 255, 0.4) 49%, rgba(255, 255, 255, 0.4) 51%, transparent 51%);
          background-size: 100px 100px;
          background-position: 0 0;
          animation: gridMove 15s linear infinite;
          mask-image: linear-gradient(to bottom, 
            rgba(0, 0, 0, 0) 0%, 
            rgba(0, 0, 0, 0.5) 20%, 
            rgba(0, 0, 0, 1) 40%, 
            rgba(0, 0, 0, 1) 100%);
          -webkit-mask-image: linear-gradient(to bottom, 
            rgba(0, 0, 0, 0) 0%, 
            rgba(0, 0, 0, 0.5) 20%, 
            rgba(0, 0, 0, 1) 40%, 
            rgba(0, 0, 0, 1) 100%);
        }

        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100px;
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
