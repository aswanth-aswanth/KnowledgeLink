import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface JitsiMeetComponentProps {
  roomName: string;
}

export default function JitsiMeetComponent({
  roomName,
}: JitsiMeetComponentProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const domain = "meet.jit.si";

  return (
    <div style={{ height: "100%", display: "grid", flexDirection: "column" }}>
      <JitsiMeeting
        domain={domain}
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName: user?.name || "Anonymous",
          email: user?.email || "",
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "91.9vh";
        }}
      />
    </div>
  );
}
