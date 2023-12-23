import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import "./App.css";
import { set } from "mongoose";
const Peer = require("simple-peer");

const socket = io("http://localhost:8080");
function App() {
  const [userName, setUserName] = useState("");
  const [myId, setMyId] = useState("");
  const [userNameSubmitted, setUserNameSubmitted] = useState(false);
  const [state, setState] = useState("offline");
  const [guestConnected, setGuestConnected] = useState(true);
  const [guestName, setGuestName] = useState("John Doe");
  const [guestId, setGuestId] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [call, setCall] = useState({
    isReceivingCall: false,
    callerID: "",
    callerName: "",
    signalData: {},
  });
  const [stream, setStream] = useState<MediaStream>();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const guestRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setStream(stream);
        if (myVideoRef.current && guestRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      });

    //get socket id
    socket.on("me", (id) => {
      console.log("new Socket: ", id);
      setMyId(id);
    });

    //handle incoming call and set call state
    socket.on("callUser", ({ callerID, callerName, signalData }) => {
      setGuestConnected(true);
      setGuestName(callerName);
      setCall({ isReceivingCall: true, callerID, callerName, signalData });
    });
  }, []);

  const submitUserName = () => {
    console.log("submitUserName:", userName);
    setUserNameSubmitted(true);
  };

  const makeCall = () => {
    if (userName == "") return;
    setState("calling");
    setGuestConnected(true);
    setGuestName("Calling: " + guestId);

    console.log("brefore call", stream);

    //init the peer with data->stream
    const peer = new Peer({ initiator: true, trickle: false, stream });

    //triger the signal event and send the data to the server
    // data here is the data requiered to connect the peers
    peer.on("signal", (data: any) => {
      socket.emit("callUser", {
        userToCall: guestId,
        signalData: data,
        from: myId,
        callerName: userName,
      });
    });

    //when the guest accept the call share the passed stream in guest peer init
    peer.on("stream", (stream: any) => {
      if (guestRef.current) {
        guestRef.current.srcObject = stream;
      }
    });

    //wait until the guest accept the call trigger the answer signal and start sharing
    socket.on("callAccepted", (signal) => {
      console.log("callAccepted: ", signal);
      peer.signal(signal);
    });
  };

  const answerCall = () => {
    //when user accept the call

    //init the peer with data->stream
    const peer = new Peer({ initiator: false, trickle: false, stream });

    //triger the signal event and emit the answerCall event to the server to trigger the callAccepted event
    peer.on("signal", (data: any) => {
      socket.emit("answerCall", { signal: data, to: call.callerID });
    });

    //when the caller recive the answerCall event the data passed to peer init is passed here
    peer.on("stream", (stream: any) => {
      if (guestRef.current) guestRef.current.srcObject = stream;
    });

    //pass the signal data to the peer and accept the peering
    peer.signal(call.signalData);
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

              {call.isReceivingCall && (
                <div>
                  {call.callerName} is Calling
                  <button onClick={answerCall}>Answer</button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-full mt-5">
            {(state == "calling" && (
              <div className="flex flex-row">
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
              </div>
            )) || (
              <div className="join">
                <input
                  className="input input-bordered join-item"
                  placeholder="Call ID"
                  onChange={(e) => {
                    setGuestId(e.target.value);
                  }}
                />
                <button className="btn join-item" onClick={makeCall}>
                  Call
                </button>
              </div>
            )}
            <div className="join mt-5">
              <input
                className="input input-bordered join-item"
                disabled
                placeholder="Your ID"
                value={myId}
              />
              <button
                className="btn join-item"
                onClick={() => navigator.clipboard.writeText(myId)}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
