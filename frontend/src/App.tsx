import "./App.css";
import ChatPanel from "./components/ChatPanel";
import ControlPanel from "./components/ControlPanel";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <div className="w-screen h-full overflow-y-scroll overflow-x-hidden absolute inset-0">
          <div className="flex flex-col justify-center items-center bg-[#161b21]">
            <h1 className="text-4xl font-bold mb-1 text-[#15E8D8]">
              Video Call App
              <a
                href="https://github.com/bilal-auz/video-call-app"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="inline-block w-4 ml-2 fill-current text-[#15E8D8]"
                >
                  <path d="M17.033 6.966c.584.583.584 1.529 0 2.112l-7.955 7.956c-.583.583-1.529.583-2.112 0-.583-.583-.583-1.529 0-2.112l7.956-7.956c.582-.583 1.528-.583 2.111 0zm-9.138 13.386c-1.171 1.171-3.076 1.171-4.248 0-1.171-1.171-1.171-3.077 0-4.248l5.639-5.632c-1.892-.459-3.971.05-5.449 1.528l-2.147 2.147c-2.254 2.254-2.254 5.909 0 8.163 2.254 2.254 5.909 2.254 8.163 0l2.147-2.148c1.477-1.477 1.986-3.556 1.527-5.448l-5.632 5.638zm6.251-18.662l-2.146 2.148c-1.478 1.478-1.99 3.553-1.53 5.445l5.634-5.635c1.172-1.171 3.077-1.171 4.248 0 1.172 1.171 1.172 3.077 0 4.248l-5.635 5.635c1.893.459 3.968-.053 5.445-1.53l2.146-2.147c2.254-2.254 2.254-5.908 0-8.163-2.253-2.254-5.908-2.254-8.162-.001z" />{" "}
                </svg>
              </a>
            </h1>
            <p className="text-xs">
              Implemented using{" "}
              <a
                href="https://github.com/feross/simple-peer"
                className="underline text-[#15E8D8]"
                target="_blank"
              >
                WebRTC/Simple-Peer
              </a>{" "}
              &{" "}
              <a
                href="https://socket.io/docs/v4/"
                className="underline text-[#15E8D8]"
                target="_blank"
              >
                Socket.io
              </a>{" "}
            </p>
            <div className="flex flex-col justify-start items-center mt-5">
              <div className="flex flex-col lg:flex-row justify-start items-center lg:items-start h-full lg:h-[520px] p-5">
                <div className="flex flex-col justify-start items-center mr-5 mb-5">
                  <VideoPlayer />

                  <ControlPanel />
                </div>
                <ChatPanel />
              </div>
              <div className="footer flex flex-row items-center justify-center text-base-content rounded pt-5 pb-5">
                <aside>
                  <p className="inline text-[#485c70]  ml-2 text-base">
                    Copyright © 2023 By{" "}
                    <span className="text-[#15E8D8]">@</span>
                    <a
                      href="https://www.linkedin.com/in/bilal-abouzid"
                      target="_blank"
                      className="underline text-[#15E8D8]"
                    >
                      bilal-auz
                    </a>
                  </p>
                </aside>

                <nav className="flex flex-row">
                  <div className="grid grid-flow-col gap-4">
                    <a href="https://github.com/bilal-auz" target="_blank">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-current text-[#485c70] hover:text-[#15E8D8] translate-all duration-300"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/bilal-abouzid"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-current text-[#485c70] hover:text-[#15E8D8] translate-all duration-300 rounded"
                      >
                        <path d="M0 0v24h24v-24h-24zm8 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.397-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
