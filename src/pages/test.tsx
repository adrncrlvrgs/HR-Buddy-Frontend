import React, { useState } from 'react';
import Script from 'next/script';

const Test: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  
  const blobToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      if (!(blob instanceof Blob)) {
        reject(new Error('Provided data is not a Blob'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String || '');
        } else {
          reject(new Error('Failed to read Blob as data URL'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  };

  // Function to start recording audio
  const startRecording = () => {

    const socket = new WebSocket('ws://localhost:3001/transcription');
    
    
    socket.onopen = () => {
      console.log('WebSocket connection opened');

      if (typeof (window as any).RecordRTC !== 'undefined') {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            const recorder = new (window as any).RecordRTC(stream, {
              type: 'audio',
              recorderType: (window as any).StereoAudioRecorder,
              mimeType: 'audio/wav',
              timeSlice: 500,
              desiredSampRate: 16000,
              numberOfAudioChannels: 1,
              ondataavailable: handleDataAvailable
            });

            recorder.startRecording();
            setMediaRecorder(recorder);
            setWs(socket);
            setIsRecording(true);
          })
          .catch(error => console.error('Error accessing media devices.', error));
      } else {
        console.error('RecordRTC is not available');
      }

      const handleDataAvailable = (event: any) => {
        if (event && event instanceof Blob) {
          console.log('Received blob:', event);
          if (event.size > 0) {
            blobToBase64(event)
              .then(base64 => {
                // const socket = new WebSocket('ws://localhost:3001');
    
                // socket.onopen =()=>{
                  if (socket?.readyState == WebSocket.OPEN) {
                    console.log('has value')
                    socket.send(base64);
                  } else {
                    console.error('WebSocket not open. ReadyState:', socket?.readyState);
                  }
                // } 
    
                
              })
              .catch(error => console.error('Error converting blob to base64:', error));
          } else {
            console.log('No data available in the Blob');
          }
        } else {
          console.error('Expected a Blob, but received:', event);
        }
      };

    };

    socket.onmessage = (event: MessageEvent) => {
      console.log('Transcription:', event);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  };

  // Function to stop recording audio
  const stopRecording = () => {

    
    if (mediaRecorder) {
      mediaRecorder.stopRecording();
      mediaRecorder.stream?.getTracks().forEach((track: { stop: () => any; }) => track.stop());
      setIsRecording(false);
    }
    if (ws) {
      console.log('mayvalue', ws.readyState)
      ws.close();
      console.log('mayvalue', ws.readyState)
    }
  };

  return (
    <div>
      <Script src="https://cdn.webrtc-experiment.com/RecordRTC.js" strategy="beforeInteractive" />
      <Script src="https://webrtc.github.io/adapter/adapter-latest.js" strategy="beforeInteractive" />
      <h1>Audio Recorder</h1>
      <h1>Live Audio Capture</h1>
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
    </div>
  );
};

export default Test;
