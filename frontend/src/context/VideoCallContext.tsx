import { set } from "mongoose";
import React, {
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { io } from "socket.io-client";
const Peer = require("simple-peer");

const socket = io("http://localhost:8080");

interface VideoCallContextProps {
  children: ReactNode;
}

interface VideoCallValues {
  myName: string;
  setMyName: (name: string) => void;
  myId: string;
  setMyId: (id: string) => void;
  callRoom: {
    isReceivingCall: false;
    callerID: "";
    callerName: "";
    signalData: {};
  };
  stream: MediaStream;
  myVideoRef: React.RefObject<HTMLVideoElement> | null;
  guestRef: React.RefObject<HTMLVideoElement> | null;
  peerRef: React.RefObject<any> | null;
  makeCall: (guestId: String) => void;
  answerCall: () => void;
  leaveCall: () => void;
  isCameraAvailable: boolean;
  guestConnected: boolean;
  isCalling: boolean;
}

const SocketContext = createContext<VideoCallValues>({
  myName: "",
  setMyName: () => {},
  myId: "",
  setMyId: () => {},
  callRoom: {
    isReceivingCall: false,
    callerID: "",
    callerName: "",
    signalData: {},
  },
  stream: {} as MediaStream,
  myVideoRef: null,
  guestRef: null,
  peerRef: null,
  makeCall: (guestId: String) => {},
  answerCall: () => {},
  leaveCall: () => {},
  isCameraAvailable: false,
  guestConnected: false,
  isCalling: false,
});

const VideoCallContext: React.FunctionComponent<VideoCallContextProps> = ({
  children,
}) => {
  // my data
  const [myName, setMyName] = useState<string>("");
  const [myId, setMyId] = useState<string>("sss");

  //call room data
  const [callRoom, setCallRoom] = useState<any>({
    isReceivingCall: false,
    callerID: "",
    callerName: "",
    signalData: {},
  });
  const [stream, setStream] = useState<any>();

  //streams refs
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const guestRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<any>(null);

  const [isCameraAvailable, setIsCameraAvailable] = useState<boolean>(false);
  const [guestConnected, setGuestConnected] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<boolean>(false);

  const makeCall = (guestId: String) => {
    console.log("Calling: ", guestId);

    if (!isCameraAvailable) return alert("Camera is not available");
    if (myName == "") return alert("Please enter your name first");

    // setState("calling");
    setIsCalling(true);
    // setGuestName("Calling: " + guestId);

    // console.log("brefore call", stream);

    //init the peer with data->stream
    const peer = new Peer({ initiator: true, trickle: false, stream });

    //triger the signal event and send the data to the server
    // data here is the data requiered to connect the peers
    peer.on("signal", (data: any) => {
      socket.emit("callUser", {
        userToCall: guestId,
        signalData: data,
        from: myId,
        callerName: myName,
      });
    });

    //when the guest accept the call share the passed stream in guest peer init
    peer.on("stream", (stream: any) => {
      if (guestRef.current) {
        console.log("streaming ", stream);
        guestRef.current.srcObject = stream;
      }
    });

    //wait until the guest accept the call trigger the answer signal and start sharing
    socket.on("callAccepted", ({ signal, newCallRoom }) => {
      console.log("callAccepted: ", signal);
      setIsCalling(false);
      setGuestConnected(true);
      setCallRoom(newCallRoom);
      peer.signal(signal);
    });

    peerRef.current = peer;
  };

  const answerCall = () => {
    setGuestConnected(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data: any) => {
      socket.emit("answerCall", { signal: data, callRoom: callRoom });
    });

    peer.on("stream", (stream: any) => {
      if (guestRef.current) guestRef.current.srcObject = stream;
    });

    peer.signal(callRoom.signalData);
    peerRef.current = peer;

    console.log("answer call");
  };

  const leaveCall = () => {
    console.log("leave call");
  };

  useEffect(() => {
    if (!navigator?.mediaDevices?.getUserMedia)
      return setIsCameraAvailable(false);

    //get camera
    setIsCameraAvailable(true);
    navigator?.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideoRef.current) {
          // myVideoRef.current.srcObject = stream;
        }
      });

    //get socket id
    socket.on("me", (id) => {
      console.log("new Socket: ", id);
      setMyId(id);
    });

    //handle incoming call and set call state
    socket.on("callUser", ({ callerID, callerName, signalData }) => {
      setCallRoom({ isReceivingCall: true, callerID, callerName, signalData });
    });
  }, []);

  return (
    <SocketContext.Provider
      value={{
        myName,
        setMyName,
        myId,
        setMyId,
        callRoom,
        stream,
        myVideoRef,
        guestRef,
        peerRef,
        makeCall,
        answerCall,
        leaveCall,
        isCameraAvailable,
        guestConnected,
        isCalling,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { VideoCallContext, SocketContext };
