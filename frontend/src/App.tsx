import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { set } from "mongoose";

function App() {
  const [userName, setUserName] = useState("");
  const [userNameSubmitted, setUserNameSubmitted] = useState(false);
  const [state, setState] = useState("offline");
  const [guestConnected, setGuestConnected] = useState(true);
  const [guestName, setGuestName] = useState("John Doe");
  const [guestId, setGuestId] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

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
    if (userName == "") return;
    setState("calling");
    setGuestConnected(true);
    setGuestName(guestId);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (guestRef.current) {
          guestRef.current.srcObject = stream;
        }
      });
  };

  const hangUp = () => {
    setState("offline");
    setGuestConnected(false);
  };

  const handleMic = () => {
    setMicOn(!micOn);
  };

  const handleSpeaker = () => {
    setSpeakerOn(!speakerOn);
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
                className="rounded w-80 [transform:rotateY(180deg)]"
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
                <>
                  <video
                    playsInline
                    autoPlay
                    ref={guestRef}
                    className="rounded [transform:rotateY(180deg)]"
                  ></video>
                  <p className="absolute bottom-0 left-0 bg-black px-1 text-xs rounded-bl">
                    {guestName && guestConnected && guestName}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center w-full mt-5">
            {(state == "calling" && (
              <React.Fragment>
                <button onClick={handleMic}>
                  {(micOn && (
                    <img className="w-8" src="assets/icons/micOn.svg" alt="" />
                  )) || (
                    <img className="w-8" src="assets/icons/micOff.svg" alt="" />
                  )}
                </button>
                <button onClick={hangUp}>
                  <img className="w-12" src="assets/icons/hangUp.svg" alt="" />
                </button>
                <button onClick={handleSpeaker}>
                  {(speakerOn && (
                    <img
                      className="w-8"
                      src="assets/icons/speakerOn.svg"
                      alt=""
                    />
                  )) || (
                    <img
                      className="w-8"
                      src="assets/icons/speakerOff.svg"
                      alt=""
                    />
                  )}
                </button>
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
