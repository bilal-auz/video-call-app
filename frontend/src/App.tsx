import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import "./App.css";
const Peer = require("simple-peer");

const socket = io("http://localhost:8080");
function App() {
  const [userName, setUserName] = useState("");
  const [myId, setMyId] = useState("");
  const [userNameSubmitted, setUserNameSubmitted] = useState(false);
  const [state, setState] = useState("offline");
  const [guestConnected, setGuestConnected] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestId, setGuestId] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [call, setCall] = useState({
    isReceivingCall: false,
    callerID: "",
    callerName: "",
    signalData: {},
  });
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const guestRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<any>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideoRef.current) {
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

    socket.on("callEnd", () => {
      console.log("callEnd");
      setState("offline");
      setGuestConnected(false);
      setCallAccepted(false);
      setCallEnded(true);
      // setCall({
      //   isReceivingCall: false,
      //   callerID: "",
      //   callerName: "",
      //   signalData: {},
      // });

      // Destroy the peer connection
      // peerRef.current.destroy();
      // Set the peerRef.current to null after destruction
      // peerRef.current = null;

      window.location.reload();
    });
  }, []);

  const submitUserName = () => {
    console.log("submitUserName:", userName);
    setUserNameSubmitted(true);
  };

  const makeCall = () => {
    if (userName == "") return alert("Please enter your name first");
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
    socket.on("callAccepted", ({ signal, callerName }) => {
      console.log("callAccepted: ", signal);
      setCallAccepted(true);
      setGuestName(callerName);
      peer.signal(signal);
    });

    peerRef.current = peer;
  };

  const answerCall = () => {
    //when user accept the call
    if (userName == "") return alert("Please enter your name first");
    setState("calling");
    setCallAccepted(true);

    //init the peer with data->stream
    const peer = new Peer({ initiator: false, trickle: false, stream });

    //triger the signal event and emit the answerCall event to the server to trigger the callAccepted event
    peer.on("signal", (data: any) => {
      socket.emit("answerCall", {
        signal: data,
        to: call.callerID,
        callerName: call.callerName,
      });
    });

    //when the caller recive the answerCall event the data passed to peer init is passed here
    peer.on("stream", (stream: any) => {
      console.log("stream: ", stream);
      if (peerRef.current && guestRef.current)
        guestRef.current.srcObject = stream;
    });

    //pass the signal data to the peer and accept the peering
    peer.signal(call.signalData);

    peerRef.current = peer;
  };

  const hangUp = () => {
    socket.emit("forceDisconnect");
    window.location.reload();
  };

  const handleMic = () => {
    // setMicOn(!micOn);
    if (stream == undefined) return;
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks[0].enabled = !audioTracks[0].enabled;
      setMicOn(audioTracks[0].enabled);
    }
  };

  const handleSpeaker = () => {
    setSpeakerOn(!speakerOn);
  };

  return (
    <div className="App">
      <main className="h-screen w-screen flex flex-col justify-center items-center ">
        <div className="flex flex-col w-[70%]">
          <div className="flex flex-row justify-center items-center">
            <div className="flex justify-center items-center mr-5 w-80 h-60 relative rounded-lg">
              <video
                playsInline
                autoPlay
                ref={myVideoRef}
                muted
                className="rounded-lg w-80 [transform:rotateY(180deg)]"
              ></video>
              <p className="absolute bottom-0 left-0 bg-black px-1 text-xs rounded-bl">
                {userNameSubmitted && userName}
              </p>
              {!userNameSubmitted && (
                <input
                  type="text"
                  placeholder="Your name..."
                  className="input input-ghost w-full max-w-xs absolute bottom-0 focus:border-0 focus:border-t-none focus:outline-none rounded-t-none bg-[#00000070] text-gray-100 focus:text-gray-100 placeholder:text-gray-100"
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && submitUserName()}
                />
              )}
            </div>

            <div className="flex flex-row justify-center items-center relative w-80 h-60 bg-gray-900 rounded-lg">
              {guestConnected && (
                <>
                  <video
                    playsInline
                    autoPlay
                    ref={guestRef}
                    className="rounded-lg [transform:rotateY(180deg)]"
                  ></video>
                  <p className="absolute bottom-0 left-0 bg-black px-1 text-xs rounded-bl">
                    {guestName}
                  </p>
                </>
              )}

              {(!callAccepted && call.isReceivingCall && (
                <div className="absolute">
                  <p>{call.callerName} is Calling</p>
                  <button onClick={answerCall} className="btn btn-xs">
                    Answer
                  </button>
                </div>
              )) ||
                (!guestConnected && <p className="absolute">Offline</p>)}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center w-full mt-5">
            {(state == "calling" && (
              <div className="flex flex-row">
                <button onClick={handleMic}>
                  {(micOn && (
                    <img className="w-12" src="assets/icons/micOn.svg" alt="" />
                  )) || (
                    <img
                      className="w-12"
                      src="assets/icons/micOff.svg"
                      alt=""
                    />
                  )}
                </button>
                <button onClick={hangUp}>
                  <img className="w-16" src="assets/icons/hangUp.svg" alt="" />
                </button>
                {/* <button onClick={handleSpeaker}>
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
                </button> */}
              </div>
            )) || (
              <div className="join">
                <input
                  className="input input-bordered join-item"
                  placeholder="id to call"
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
