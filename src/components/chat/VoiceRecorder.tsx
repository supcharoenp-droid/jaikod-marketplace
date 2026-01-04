'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Send, X, Play, Pause, Loader2 } from 'lucide-react'

interface VoiceRecorderProps {
    onRecordingComplete: (audioBlob: Blob, duration: number) => void
    onCancel: () => void
    isRecording: boolean
    onStartRecording: () => void
}

/**
 * VoiceRecorder - บันทึกข้อความเสียงใน Chat
 * V2 Feature จาก ChatSystemV2
 */
export default function VoiceRecorder({
    onRecordingComplete,
    onCancel,
    isRecording,
    onStartRecording
}: VoiceRecorderProps) {
    const [duration, setDuration] = useState(0)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                setAudioBlob(blob)
                setAudioUrl(URL.createObjectURL(blob))

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            onStartRecording()

            // Start timer
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1)
            }, 1000)
        } catch (error) {
            console.error('Failed to start recording:', error)
            alert('ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาอนุญาตการใช้งาน')
        }
    }

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
        }
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }

    // Cancel recording
    const cancelRecording = () => {
        stopRecording()
        setAudioBlob(null)
        setAudioUrl(null)
        setDuration(0)
        onCancel()
    }

    // Send recording
    const sendRecording = () => {
        if (audioBlob) {
            setIsProcessing(true)
            onRecordingComplete(audioBlob, duration)
            setAudioBlob(null)
            setAudioUrl(null)
            setDuration(0)
            setIsProcessing(false)
        }
    }

    // Play/Pause preview
    const togglePlayback = () => {
        if (!audioRef.current || !audioUrl) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    // Format duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            if (audioUrl) URL.revokeObjectURL(audioUrl)
        }
    }, [audioUrl])

    // If not recording and no audio, show mic button
    if (!isRecording && !audioBlob) {
        return (
            <button
                onClick={startRecording}
                className="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition"
                title="บันทึกเสียง"
            >
                <Mic className="w-6 h-6" />
            </button>
        )
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800"
            >
                {/* Cancel Button */}
                <button
                    onClick={cancelRecording}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Recording Indicator / Audio Preview */}
                {isRecording ? (
                    <div className="flex items-center gap-3 flex-1">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-3 h-3 bg-red-500 rounded-full"
                        />
                        <span className="text-sm font-bold text-red-600 min-w-[40px]">
                            {formatDuration(duration)}
                        </span>
                        <div className="flex-1 h-1 bg-red-100 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                className="w-1/3 h-full bg-red-500"
                            />
                        </div>
                    </div>
                ) : audioBlob ? (
                    <div className="flex items-center gap-3 flex-1">
                        <button
                            onClick={togglePlayback}
                            className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-full transition"
                        >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <span className="text-sm font-bold text-purple-600 min-w-[40px]">
                            {formatDuration(duration)}
                        </span>
                        <audio ref={audioRef} src={audioUrl || undefined} onEnded={() => setIsPlaying(false)} />
                        <div className="flex-1 h-1 bg-purple-100 dark:bg-purple-800 rounded-full">
                            <div className="w-full h-full bg-purple-400 rounded-full" />
                        </div>
                    </div>
                ) : null}

                {/* Stop / Send Button */}
                {isRecording ? (
                    <button
                        onClick={stopRecording}
                        className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                    >
                        <Square className="w-5 h-5" />
                    </button>
                ) : audioBlob ? (
                    <button
                        onClick={sendRecording}
                        disabled={isProcessing}
                        className="p-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition shadow-lg disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                ) : null}
            </motion.div>
        </AnimatePresence>
    )
}
