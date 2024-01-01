import React, { useContext, useEffect } from "react";
import { SocketContext } from "../context/VideoCallContext";

function ControlPanel() {
  const {
    myName,
    setMyName,
    myId,
    makeCall,
    answerCall,
    leaveCall,
    guestConnected,
  } = useContext(SocketContext);
  const [guestId, setGuestId] = React.useState<string>("");
  const [state, setState] = React.useState<string>("idle");
  const [micOn, setMicOn] = React.useState<boolean>(true);
  const handleMic = () => {};
  useEffect(() => {}, []);
  return (
    <div className="flex flex-col md:flex-row  justify-around items-center w-full mt-5 bg-[#1f272f] rounded-lg p-5">
      <div className="flex flex-col ">
        <label className="form-control w-full max-w-xs mb-2">
          <div className="label">
            <span className="label-text">What is your name?</span>
          </div>
          <input
            type="text"
            placeholder="Your name..."
            className="input focus:border-0 focus:outline-[#15E8D8]"
            onChange={(e) => {
              setMyName(e.target.value);
            }}
            value={myName}
          />
        </label>

        <button
          className="btn text-[#15E8D8]"
          onClick={() => navigator?.clipboard?.writeText(myId)}
        >
          Copy your ID
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4"
          >
            <path
              d="m6 18v3c0 .621.52 1 1 1h14c.478 0 1-.379 1-1v-14c0-.478-.379-1-1-1h-3v-3c0-.478-.379-1-1-1h-14c-.62 0-1 .519-1 1v14c0 .621.52 1 1 1zm10.5-12h-9.5c-.62 0-1 .519-1 1v9.5h-2.5v-13h13z"
              fill="#15E8D8"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col">
        <label className="form-control w-full max-w-xs mb-2">
          <div className="label">
            <span className="label-text">Guest ID to call</span>
          </div>
          <input
            type="text"
            placeholder="Guest ID..."
            className="input focus:border-0 focus:outline-[#15E8D8]"
            onChange={(e) => {
              setGuestId(e.target.value);
            }}
            value={guestId}
          />
        </label>
        {(guestConnected && (
          <div className="flex flex-row justify-center">
            <button onClick={handleMic}>
              {(micOn && (
                <img className="w-12" src="assets/icons/micOn.svg" alt="" />
              )) || (
                <img className="w-12" src="assets/icons/micOff.svg" alt="" />
              )}
            </button>
            <button onClick={leaveCall}>
              <img className="w-16" src="assets/icons/hangUp.svg" alt="" />
            </button>
          </div>
        )) || (
          <button
            className="btn text-[#15E8D8]"
            onClick={(e) => makeCall(guestId)}
          >
            Call
          </button>
        )}
        <button className="btn" onClick={(e) => answerCall()}>
          answer call
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;
