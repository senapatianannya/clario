"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcript: string) => void
  isDisabled?: boolean
}

export function VoiceRecorder({ onRecordingComplete, isDisabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setIsProcessing(true)

        // Simulate speech-to-text processing
        // In a real implementation, you would use a service like OpenAI Whisper
        setTimeout(() => {
          const mockTranscript = "This is a mock transcript of the recorded audio."
          onRecordingComplete(audioBlob, mockTranscript)
          setIsProcessing(false)
        }, 2000)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {!isRecording ? (
        <Button
          onClick={startRecording}
          disabled={isDisabled || isProcessing}
          className={cn("bg-primary hover:bg-primary/90", isProcessing && "opacity-50 cursor-not-allowed")}
        >
          <Mic className="h-4 w-4 mr-2" />
          {isProcessing ? "Processing..." : "Start Recording"}
        </Button>
      ) : (
        <Button onClick={stopRecording} variant="destructive" className="animate-pulse">
          <Square className="h-4 w-4 mr-2" />
          Stop Recording
        </Button>
      )}

      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Recording...
        </div>
      )}
    </div>
  )
}
