import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [userName, setUserName] = useState("");
  const [userNameSubmitted, setUserNameSubmitted] = useState(false);
  const [state, setState] = useState("offline");
  const [guestConnected, setGuestConnected] = useState(true);
  const [guestName, setGuestName] = useState("John Doe");
  const [guestId, setGuestId] = useState("");

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const guestRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (myVideoRef.current && guestRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      });
  }, []);

  const submitUserName = () => {
    console.log("submitUserName:", userName);
    setUserNameSubmitted(true);
  };

  const call = () => {
    setState("calling");
    setGuestName("calling: " + guestId);
  };

  const hangUp = () => {
    setState("offline");
  };

  return (
    <div className="App">
      <main className="h-screen w-screen flex flex-col justify-center items-center ">
        <div className="flex flex-col w-[70%]">
          <div className="flex flex-row justify-center items-center">
            <div className="flex justify-center items-center mr-5 w-80 h-60 relative rounded">
              <video
                playsInline
                autoPlay
                ref={myVideoRef}
                className="rounded w-80"
              ></video>
              <p className="absolute bottom-0 left-0 bg-black px-1 text-xs rounded-bl">
                {userName && userNameSubmitted && userName}
              </p>
              {!userNameSubmitted && (
                <input
                  type="text"
                  placeholder="Your name..."
                  className="input input-ghost w-full max-w-xs absolute bottom-0 focus:bg-transparent focus:border-0 focus:border-t-none focus:outline-none"
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && submitUserName()}
                />
              )}
            </div>
            <div className="flex flex-row justify-center items-center relative w-80 h-60 bg-gray-900 rounded">
              {guestConnected && (
                <video
                  playsInline
                  autoPlay
                  ref={guestRef}
                  className="rounded"
                ></video>
              )}
              <p className="absolute">{guestName}</p>
            </div>
          </div>
          <div className="flex justify-center w-full mt-5">
            {(state == "calling" && (
              <React.Fragment>
                <button>mute</button>
                <button onClick={hangUp}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 22 22"
                    className="w-10"
                  >
                    <path
                      d="M11 3A8 8 0 0 0 3 11 8 8 0 0 0 11 19 8 8 0 0 0 19 11 8 8 0 0 0 11 3M10.941 8.867C14.411 8.859 15.682 10.385 15.736 10.451 15.852 10.598 15.947 10.754 16.03 10.932 16.11 11.123 16.17 11.325 16.191 11.523H16.201L16.209 12.05C16.209 12.428 15.911 12.739 15.543 12.74L13.693 12.744C13.326 12.744 13.03 12.436 13.03 12.05L13.02 11.123C12.978 11.11 12.929 11.1 12.879 11.08 12.421 10.952 11.795 10.775 10.947 10.777 10.1 10.779 9.473 10.96 9.02 11.09 8.967 11.11 8.92 11.12 8.875 11.131L8.877 11.756V12.06C8.878 12.446 8.579 12.757 8.211 12.758L6.363 12.762C5.996 12.763 5.694 12.454 5.693 12.07L5.695 11.549H5.709C5.733 11.35 5.787 11.148 5.871 10.955 5.953 10.773 6.05 10.615 6.158 10.475 7.05 9.338 8.431 8.873 10.941 8.867"
                      transform="translate(.0001-.002)"
                      fill="#da4453"
                      fill-rule="evenodd"
                    />
                  </svg>
                </button>
                <button>Speaker</button>
              </React.Fragment>
            )) || (
              <div className="join">
                <input
                  className="input input-bordered join-item"
                  placeholder="Call ID"
                  onChange={(e) => {
                    setGuestId(e.target.value);
                  }}
                />
                <button className="btn join-item" onClick={call}>
                  Call
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
