import React, { useContext } from "react";
import { SocketContext } from "../context/VideoCallContext";

function VideoPlayer() {
  const {
    myName,
    myId,
    guestId,
    isCameraAvailable,
    myVideoRef,
    guestRef,
    callRoom,
    guestConnected,
    isCalling,
  } = useContext(SocketContext);
  return (
    <div className="flex flex-col md:flex-row justify-center items-center bg-[#1f272f] rounded-lg p-5">
      {(isCameraAvailable && (
        <>
          <div className="flex justify-center items-center mb-5 md:mr-5 md:mb-0 w-80 h-60 relative rounded-lg border-2 border-[#15E8D8] ">
            <video
              playsInline
              autoPlay
              ref={myVideoRef}
              muted
              className="rounded-lg w-80 h-60 [transform:rotateY(180deg)]"
            ></video>
            <p className="glass text-[0.80rem] capitalize text-white absolute bottom-2 left-2 px-3">
              {myName}
            </p>
          </div>

          <div className="flex flex-row justify-center items-center relative w-80 h-60 bg-gray-900 rounded-lg">
            {(guestConnected && (
              <>
                <video
                  playsInline
                  autoPlay
                  ref={guestRef}
                  className="rounded-lg [transform:rotateY(180deg)] "
                ></video>
                <p className="glass text-[0.80rem] capitalize text-white absolute bottom-2 left-2 px-3">
                  {callRoom.callerID === myId
                    ? callRoom.guestName
                    : callRoom.callerName}
                </p>
              </>
            )) || (
              <p className="glass text-[0.80rem] capitalize text-white absolute bottom-2 left-2 px-3">
                {isCalling && "Calling " + guestId}
                {callRoom.isReceivingCall &&
                  callRoom.callerName + " is calling"}
              </p>
            )}
          </div>
        </>
      )) || (
        <p className="text-[#15E8D8] bg-[#1f272f]">
          Camera is not available mobile.
          <br /> Please use your nearest PC
        </p>
      )}
    </div>
  );
}

export default VideoPlayer;
