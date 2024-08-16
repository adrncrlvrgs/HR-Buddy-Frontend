'use client'; // Ensure this file is only used on the client-side

import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder: React.FC = () => {
    const [recording, setRecording] = useState<boolean>(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Function to start recording
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            // Clear buffers after creating the audio URL
            chunksRef.current = [];
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setRecording(true);
    };

    // Function to stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
            // Clear buffers immediately after stopping the recording
            chunksRef.current = [];
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    return (
        <div>
            <h1>Audio Recorder</h1>
            <button onClick={() => startRecording()} disabled={recording}>
                Start Recording
            </button>
            <button onClick={() => stopRecording()} disabled={!recording}>
                Stop Recording
            </button>
            {audioUrl && (
                <div>
                    <a href={audioUrl} download="output.wav">Download Recording</a>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
