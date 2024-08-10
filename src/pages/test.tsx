import React, { useState, useEffect } from 'react';

const Test: React.FC = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  useEffect(() => {
    // Cleanup function to stop media recorder and close WebSocket on unmount
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
      if (ws) {
        ws.close();
      }
    };
  }, [mediaRecorder, ws]);

  const startRecording = async () => {

    const socket = new WebSocket('ws://localhost:3001');

    socket.onopen = () => {
      console.log('WebSocket connection opened');
      try {
        socket.send("test send");
        console.log('Sent test message successfully');
      } catch (error) {
        console.error('Failed to send test message:', error); //so dito pala dapat
      }
    };

    socket.onmessage = (event: MessageEvent) => {
      console.log('Received from server:', event.data);
    };

    socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);
    


    // Get microphone access
    // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // const recorder = new MediaRecorder(stream);

    // recorder.ondataavailable = (event: BlobEvent) => {
    //   console.log('Audio data available:', event.data);

    //   if (socket.readyState === WebSocket.OPEN) {
    //   console.log('true');
    
    // } else {
    //   console.log('false');
    // }

    //   if (event.data.size > 0) {
       
    //       console.log('Sending audio data:', event.data);
    //       socket.send("test send");
        
    //   } else {
    //     console.log('No data available');
    //   }
    // };

    // recorder.start(1000); // Send audio data every 1 second
    // setMediaRecorder(recorder);
    // setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    if (ws) {
      ws.close();
    }
    setIsRecording(false);
  };

  return (
    <div>
      <h1>Live Audio Capture</h1>
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
    </div>
  );
};

export default Test;
