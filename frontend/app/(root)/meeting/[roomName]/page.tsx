'use client';

import React from 'react';
import JitsiMeetComponent from './JitsiMeetComponent';
import { useParams } from 'next/navigation';

export default function MeetingRoom() {
  const params = useParams();
  const roomName = params.roomName as string;

  return <JitsiMeetComponent roomName={roomName} />;
}