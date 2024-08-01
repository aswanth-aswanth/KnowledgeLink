import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

interface JitsiMeetComponentProps {
  roomName: string;
}

export default function JitsiMeetComponent({
  roomName,
}: JitsiMeetComponentProps) {
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
          displayName: "YOUR_USERNAME", // Replace with actual user name
          email: "user@example.com", // Replace with actual user email
        }}
        onApiReady={(externalApi) => {
          // here you can attach custom event listeners to the Jitsi Meet External API
          // you can also store it locally to execute commands
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "91.9vh";
        }}
      />
    </div>
  );
}
