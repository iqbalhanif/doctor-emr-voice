import { useState, useRef, useCallback } from 'react';

export const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorder = useRef(null);
    const timerInterval = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerInterval.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Gagal mengakses mikrofon. Pastikan izin telah diberikan.");
        }
    }, []);

    const stopRecording = useCallback(() => {
        return new Promise((resolve) => {
            if (mediaRecorder.current && isRecording) {
                mediaRecorder.current.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' }); // Chrome default
                    resolve(audioBlob);

                    // Stop all tracks
                    mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.current.stop();
                setIsRecording(false);
                clearInterval(timerInterval.current);
            } else {
                resolve(null);
            }
        });
    }, [isRecording]);

    return {
        isRecording,
        recordingTime,
        startRecording,
        stopRecording
    };
};
