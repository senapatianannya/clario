"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, Play, SkipForward, MessageSquare, Clock, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question_text: string
  category: string
  difficulty: string
  order_index: number
}

interface Interview {
  id: string
  title: string
  job_position: string
  company_name: string
  difficulty_level: string
  status: string
}

export default function InterviewPage() {
  const params = useParams()
  const router = useRouter()
  const interviewId = params.id as string

  const [interview, setInterview] = useState<Interview | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [currentResponse, setCurrentResponse] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    loadInterview()
  }, [interviewId])

  const loadInterview = async () => {
    try {
      const supabase = createClient()

      // Load interview details
      const { data: interviewData, error: interviewError } = await supabase
        .from("interviews")
        .select("*")
        .eq("id", interviewId)
        .single()

      if (interviewError || !interviewData) {
        console.error("Interview not found:", interviewError)
        router.push("/dashboard/interviews")
        return
      }

      setInterview(interviewData)

      // Load questions if they exist
      const { data: questionsData } = await supabase
        .from("interview_questions")
        .select("*")
        .eq("interview_id", interviewId)
        .order("order_index")

      if (questionsData && questionsData.length > 0) {
        setQuestions(questionsData)

        // Load existing responses
        const { data: responsesData } = await supabase
          .from("interview_responses")
          .select("*")
          .eq("interview_id", interviewId)

        if (responsesData) {
          const responseMap: Record<string, string> = {}
          responsesData.forEach((response) => {
            responseMap[response.question_id] = response.response_text
          })
          setResponses(responseMap)

          // Set current response if we're on a question that has been answered
          const currentQuestionId = questionsData[currentQuestionIndex]?.id
          if (currentQuestionId && responseMap[currentQuestionId]) {
            setCurrentResponse(responseMap[currentQuestionId])
          }
        }
      } else {
        console.log(" No questions found, generating questions...")
        await generateQuestions()
      }
    } catch (error) {
      console.error("Error loading interview:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateQuestions = async () => {
    setIsGeneratingQuestions(true)
    try {
      console.log("Generating questions for interview:", interviewId)
      const response = await fetch("/api/interview/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Questions generated:", data.questions.length)

        // Reload the interview to get the updated questions from database
        await loadInterview()
      } else {
        const errorData = await response.json()
        console.error(" Error generating questions:", errorData)
      }
    } catch (error) {
      console.error(" Error generating questions:", error)
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  const startInterview = () => {
    setInterviewStarted(true)
    setStartTime(new Date())
    setQuestionStartTime(new Date())
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })

        // Convert speech to text using AI
        try {
          const formData = new FormData()
          formData.append("audio", audioBlob)

          const response = await fetch("/api/speech-to-text", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const { transcript } = await response.json()
            setCurrentResponse((prev) => prev + (prev ? " " : "") + transcript)
          }
        } catch (error) {
          console.error("Error converting speech to text:", error)
        }
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
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  const saveResponse = async () => {
    if (!currentResponse.trim() || !questionStartTime) return

    const responseTime = Math.floor((Date.now() - questionStartTime.getTime()) / 1000)
    const currentQuestion = questions[currentQuestionIndex]

    try {
      const supabase = createClient()

      const { error } = await supabase.from("interview_responses").upsert(
        {
          interview_id: interviewId,
          question_id: currentQuestion.id,
          response_text: currentResponse,
          response_time_seconds: responseTime,
        },
        {
          onConflict: "interview_id,question_id",
        },
      )

      if (error) {
        console.error("Error saving response:", error)
        return
      }

      setResponses((prev) => ({
        ...prev,
        [currentQuestion.id]: currentResponse,
      }))

      console.log("Response saved successfully")
    } catch (error) {
      console.error("Error saving response:", error)
    }
  }

  const nextQuestion = async () => {
    await saveResponse()

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)

      // Load existing response for next question
      const nextQuestionId = questions[nextIndex]?.id
      if (nextQuestionId && responses[nextQuestionId]) {
        setCurrentResponse(responses[nextQuestionId])
      } else {
        setCurrentResponse("")
      }

      setQuestionStartTime(new Date())
    } else {
      // Interview completed
      await submitInterview()
    }
  }

  const submitInterview = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      console.log("Submitting interview...")

      // Save final response if any
      await saveResponse()

      // Update interview status to completed
      const supabase = createClient()
      await supabase
        .from("interviews")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", interviewId)

      // Generate feedback using Grok AI
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId }),
      })

      if (response.ok) {
        console.log("[v0] Interview submitted successfully")
        router.push(`/dashboard/interviews/${interviewId}/results`)
      } else {
        console.error("Error evaluating interview")
        const errorData = await response.json()
        console.error("Evaluation error:", errorData)
      }
    } catch (error) {
      console.error("Error submitting interview:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!interview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Interview Not Found</h1>
          <Button asChild>
            <Link href="/dashboard/interviews">Back to Interviews</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isGeneratingQuestions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md glass-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Generating Questions</h2>
              <p className="text-muted-foreground">
                Our AI is creating personalized interview questions for your {interview.job_position} position...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0 && !isGeneratingQuestions) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="sm" className="bg-transparent">
            <Link href="/dashboard/interviews">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{interview?.title || "Interview"}</h1>
            <p className="text-muted-foreground">Questions not available</p>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Questions Not Generated</h2>
              <p className="text-muted-foreground">
                There was an issue generating questions for this interview. Please try generating them again.
              </p>
              <Button
                onClick={generateQuestions}
                disabled={isGeneratingQuestions}
                className="bg-primary hover:bg-primary/90"
              >
                {isGeneratingQuestions ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  "Generate Questions"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!interviewStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="sm" className="bg-transparent">
            <Link href="/dashboard/interviews">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{interview.title}</h1>
            <p className="text-muted-foreground">
              {interview.job_position} • {interview.difficulty_level} level
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Interview Overview</CardTitle>
              <CardDescription>Review the details before starting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium text-foreground">{interview.job_position}</p>
                </div>
                {interview.company_name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium text-foreground">{interview.company_name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                    {interview.difficulty_level}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-medium text-foreground">{questions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>How the interview will work</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Answer each question thoughtfully and completely
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  You can use voice recording or type your responses
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Take your time - there's no strict time limit
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  You'll receive detailed feedback at the end
                </li>
              </ul>

              <Button onClick={startInterview} className="w-full mt-6 bg-primary hover:bg-primary/90" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Start Interview
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{interview.title}</h1>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {startTime && Math.floor((Date.now() - startTime.getTime()) / 60000)}m
          </div>
          <Badge variant="secondary" className="bg-secondary/20 text-secondary">
            {currentQuestion?.category}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Interview Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground leading-relaxed">{currentQuestion?.question_text}</p>
        </CardContent>
      </Card>

      {/* Response Area */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle>Your Response</CardTitle>
          <CardDescription>You can type your answer or use voice recording</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type your response here..."
            value={currentResponse}
            onChange={(e) => setCurrentResponse(e.target.value)}
            className="min-h-[120px] bg-input border-border"
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={isRecording ? stopRecording : startRecording}
              className={`bg-transparent ${isRecording ? "text-destructive" : ""}`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>

            {isRecording && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                Recording...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
  {/* Left: Previous button */}
  <div className="w-full sm:w-auto">
    <Button
      variant="outline"
      onClick={() => {
        const prevIndex = Math.max(0, currentQuestionIndex - 1)
        setCurrentQuestionIndex(prevIndex)
        const prevQuestionId = questions[prevIndex]?.id
        if (prevQuestionId && responses[prevQuestionId]) {
          setCurrentResponse(responses[prevQuestionId])
        } else {
          setCurrentResponse("")
        }
      }}
      disabled={currentQuestionIndex === 0}
      className="w-full sm:w-auto bg-transparent"
    >
      Previous
    </Button>
  </div>

  {/* Right: Submit / Go Back / Next */}
  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
    <Button
      onClick={submitInterview}
      disabled={isSubmitting}
      className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Submitting...
        </>
      ) : (
        "Submit Interview"
      )}
    </Button>

    <Button
      variant="outline"
      onClick={() => router.push("/dashboard/interviews")}
      className="w-full sm:w-auto bg-muted hover:bg-muted/80"
    >
      Go Back
    </Button>

    <Button
      onClick={nextQuestion}
      disabled={!currentResponse.trim() || isSubmitting}
      className="w-full sm:w-auto bg-primary hover:bg-primary/90"
    >
      {currentQuestionIndex === questions.length - 1 ? (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Complete Interview
        </>
      ) : (
        <>
          Next Question
          <SkipForward className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  </div>
</div>

      </div>
  )
}
