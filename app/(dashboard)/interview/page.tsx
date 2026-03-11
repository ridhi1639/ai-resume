"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { toast } from "sonner"
import { 
  Mic, 
  MicOff, 
  Send, 
  ChevronRight, 
  Monitor,
  MonitorOff,
  Video,
  VideoOff,
  Clock,
  Sparkles,
  MessageSquare,
  User,
  Play,
  Square,
  AlertTriangle,
  Timer,
  Camera,
  ScreenShare,
  Loader2
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const TOTAL_TIME_LIMIT = 30 * 60 // 30 minutes total
const QUESTION_TIME_LIMIT = 5 * 60 // 5 minutes per question
const WARNING_TIME = 2 * 60 // 2 minutes - yellow warning
const CRITICAL_TIME = 60 // 1 minute - red warning

const questions = [
  {
    id: 1,
    question: "Tell me about yourself and your experience with React.",
    category: "Introduction",
    difficulty: "Easy"
  },
  {
    id: 2,
    question: "Can you explain the difference between state and props in React?",
    category: "Technical",
    difficulty: "Medium"
  },
  {
    id: 3,
    question: "How would you optimize a React application that has performance issues?",
    category: "Technical",
    difficulty: "Hard"
  },
  {
    id: 4,
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    category: "Behavioral",
    difficulty: "Medium"
  },
  {
    id: 5,
    question: "How do you handle code reviews and give/receive feedback?",
    category: "Behavioral",
    difficulty: "Easy"
  }
]

export default function InterviewPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(TOTAL_TIME_LIMIT)
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(QUESTION_TIME_LIMIT)
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenVideoRef = useRef<HTMLVideoElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // AI Chat integration
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/interview/chat' }),
  })

  const isStreaming = status === 'streaming'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Total Time Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isInterviewStarted && totalTimeRemaining > 0) {
      interval = setInterval(() => {
        setTotalTimeRemaining(prev => {
          if (prev <= 1) {
            endInterview()
            return 0
          }
          return prev - 1
        })
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isInterviewStarted, totalTimeRemaining])

  // Question Time Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isInterviewStarted && !isStreaming && questionTimeRemaining > 0) {
      interval = setInterval(() => {
        setQuestionTimeRemaining(prev => {
          if (prev <= 1) {
            setShowTimeWarning(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isInterviewStarted, isStreaming, questionTimeRemaining])

  // Reset question timer when moving to next question
  useEffect(() => {
    setQuestionTimeRemaining(QUESTION_TIME_LIMIT)
    setShowTimeWarning(false)
  }, [currentQuestionIndex])

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop())
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [videoStream, screenStream])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = (timeRemaining: number) => {
    if (timeRemaining <= CRITICAL_TIME) return 'text-destructive'
    if (timeRemaining <= WARNING_TIME) return 'text-chart-3'
    return 'text-foreground'
  }

  const getTimerBgColor = (timeRemaining: number) => {
    if (timeRemaining <= CRITICAL_TIME) return 'bg-destructive/10 border-destructive/50'
    if (timeRemaining <= WARNING_TIME) return 'bg-chart-3/10 border-chart-3/50'
    return 'bg-muted/50 border-border'
  }

  const startInterview = async () => {
    setIsInterviewStarted(true)
    // Send the first question to the AI
    await sendMessage({ 
      text: `I'm starting a mock interview. Please ask me this interview question and be ready to evaluate my answer: "${questions[0].question}"` 
    })
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || isStreaming) return

    // Store the answer
    setUserAnswers(prev => [...prev, answer])
    const currentAnswer = answer
    setAnswer("")

    // Send answer to AI for feedback
    await sendMessage({ 
      text: currentAnswer 
    })

    // Move to next question after a short delay
    setTimeout(async () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        await sendMessage({ 
          text: `Good. Now please ask me this next interview question: "${questions[currentQuestionIndex + 1].question}"` 
        })
      } else {
        // Interview complete - save data and redirect
        localStorage.setItem('interviewAnswers', JSON.stringify([...userAnswers, currentAnswer]))
        localStorage.setItem('interviewQuestions', JSON.stringify(questions.map(q => q.question)))
        
        await sendMessage({ 
          text: "Thank you for the interview. Please provide a brief summary of my performance before I check my detailed results." 
        })
        
        setTimeout(() => {
          router.push("/results")
        }, 3000)
      }
    }, 1500)
  }

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1 && !isStreaming) {
      setCurrentQuestionIndex(prev => prev + 1)
      await sendMessage({ 
        text: `Let's move to the next question. Please ask me: "${questions[currentQuestionIndex + 1].question}"` 
      })
    }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false)
      toast.info("Voice recording stopped")
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        setIsRecording(true)
        toast.success("Voice recording started")
      } catch (err) {
        console.error("Microphone access denied:", err)
        toast.error("Microphone access denied. Please enable microphone permissions.")
      }
    }
  }

  const toggleVideo = async () => {
    if (isVideoOn) {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop())
        setVideoStream(null)
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setIsVideoOn(false)
      setPermissionError(null)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          } 
        })
        setVideoStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setIsVideoOn(true)
        setPermissionError(null)
        toast.success("Camera enabled")
      } catch (err: unknown) {
        console.error("Error accessing camera:", err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        if (errorMessage.includes('Permission') || errorMessage.includes('NotAllowed')) {
          setPermissionError("Camera access denied. Please enable camera permissions in your browser settings.")
          toast.error("Camera access denied")
        } else {
          setPermissionError("Unable to access camera. It may be in use by another application.")
          toast.error("Unable to access camera")
        }
      }
    }
  }

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop())
        setScreenStream(null)
      }
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null
      }
      setIsScreenSharing(false)
      setPermissionError(null)
    } else {
      try {
        // Check if the API is available
        if (!navigator.mediaDevices?.getDisplayMedia) {
          throw new Error('Screen sharing is not supported in this browser')
        }

        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: "monitor",
          },
          audio: false
        })
        
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream
          await screenVideoRef.current.play()
        }
        setScreenStream(stream)
        setIsScreenSharing(true)
        setPermissionError(null)
        toast.success("Screen sharing started")

        // Handle when user stops sharing via browser UI
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
          setScreenStream(null)
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = null
          }
          toast.info("Screen sharing stopped")
        }
      } catch (err: unknown) {
        console.error("Error sharing screen:", err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        
        if (errorMessage.includes('Permission') || errorMessage.includes('NotAllowed') || errorMessage.includes('disallowed')) {
          setPermissionError("Screen sharing is not available in this preview environment. Deploy the app to use screen sharing, or try opening in a new tab.")
          toast.error("Screen sharing unavailable in preview. Deploy or open in new tab to use this feature.")
        } else if (errorMessage.includes('not supported')) {
          setPermissionError("Screen sharing is not supported in this browser.")
          toast.error("Screen sharing not supported")
        } else {
          setPermissionError("Screen sharing was cancelled or denied.")
          toast.error("Screen sharing cancelled")
        }
      }
    }
  }, [isScreenSharing, screenStream])

  const endInterview = useCallback(() => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop())
    }
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop())
    }
    
    // Save interview data
    localStorage.setItem('interviewAnswers', JSON.stringify(userAnswers))
    localStorage.setItem('interviewQuestions', JSON.stringify(questions.map(q => q.question)))
    localStorage.setItem('interviewTime', elapsedTime.toString())
    
    router.push("/results")
  }, [screenStream, videoStream, userAnswers, elapsedTime, router])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Extract text from message parts
  const getMessageText = (msg: typeof messages[0]) => {
    if (!msg.parts || !Array.isArray(msg.parts)) return ''
    return msg.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map(p => p.text)
      .join('')
  }

  if (!isInterviewStarted) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Card className="max-w-lg border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">AI Mock Interview</CardTitle>
            <CardDescription>
              Practice your interview skills with our AI interviewer powered by Claude. Get real-time feedback on your answers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium">What to expect:</p>
              <ul className="mt-2 space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Timer className="h-3.5 w-3.5 text-primary" />
                  30 minutes total time limit
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  5 minutes per question
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  AI-powered real-time feedback
                </li>
                <li className="flex items-center gap-2">
                  <Camera className="h-3.5 w-3.5 text-primary" />
                  Optional video for practice
                </li>
                <li className="flex items-center gap-2">
                  <ScreenShare className="h-3.5 w-3.5 text-primary" />
                  Screen sharing for coding questions
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-chart-3/30 bg-chart-3/5 p-3 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-chart-3" />
                Timer warnings: Yellow at 2 min, Red at 1 min remaining
              </p>
            </div>
            <Button onClick={startInterview} className="w-full gap-2">
              <Play className="h-4 w-4" />
              Start Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleTimeUp = async () => {
    setShowTimeWarning(false)
    if (answer.trim()) {
      await handleSubmitAnswer()
    } else {
      await handleNextQuestion()
    }
  }

  return (
    <div className="space-y-6">
      {/* Time Warning Dialog */}
      <AlertDialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-chart-3" />
              Time is Up for This Question
            </AlertDialogTitle>
            <AlertDialogDescription>
              {answer.trim() 
                ? "Your current answer will be submitted automatically."
                : "Moving to the next question since no answer was provided."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleTimeUp}>
              {answer.trim() ? "Submit Answer" : "Next Question"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permission Error Toast */}
      {permissionError && (
        <div className="fixed right-4 top-20 z-50 max-w-sm rounded-lg border border-chart-3/50 bg-chart-3/10 p-4 shadow-lg">
          <p className="text-sm text-foreground">{permissionError}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2"
            onClick={() => setPermissionError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Interview</h1>
          <p className="text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Question Timer */}
          <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${getTimerBgColor(questionTimeRemaining)}`}>
            <span className="text-xs text-muted-foreground">Question:</span>
            <span className={`font-mono font-medium ${getTimerColor(questionTimeRemaining)}`}>
              {formatTime(questionTimeRemaining)}
            </span>
            {questionTimeRemaining <= WARNING_TIME && (
              <span className={`h-2 w-2 rounded-full animate-pulse ${
                questionTimeRemaining <= CRITICAL_TIME ? 'bg-destructive' : 'bg-chart-3'
              }`} />
            )}
          </div>
          {/* Total Timer */}
          <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${getTimerBgColor(totalTimeRemaining)}`}>
            <Clock className={`h-4 w-4 ${getTimerColor(totalTimeRemaining)}`} />
            <span className={`font-mono font-medium ${getTimerColor(totalTimeRemaining)}`}>
              {formatTime(totalTimeRemaining)}
            </span>
            {totalTimeRemaining <= WARNING_TIME && (
              <span className={`h-2 w-2 rounded-full animate-pulse ${
                totalTimeRemaining <= CRITICAL_TIME ? 'bg-destructive' : 'bg-chart-3'
              }`} />
            )}
          </div>
          <Button variant="destructive" size="sm" onClick={endInterview}>
            <Square className="mr-2 h-4 w-4" />
            End Interview
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Questions Panel */}
        <Card className="border-border/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className={`rounded-lg border p-3 transition-colors ${
                      index === currentQuestionIndex
                        ? 'border-primary bg-primary/5'
                        : index < currentQuestionIndex
                        ? 'border-border/50 bg-muted/30 opacity-60'
                        : 'border-border/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Q{index + 1}</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          q.difficulty === 'Easy' ? 'bg-chart-2/20 text-chart-2' :
                          q.difficulty === 'Medium' ? 'bg-chart-3/20 text-chart-3' :
                          'bg-chart-5/20 text-chart-5'
                        }`}
                      >
                        {q.difficulty}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm line-clamp-2">{q.question}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat & Answer Area */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Interview Session</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="mr-2">{currentQuestion.category}</Badge>
                {currentQuestion.difficulty}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={isVideoOn ? "default" : "outline"}
                size="icon"
                onClick={toggleVideo}
                title={isVideoOn ? "Turn off camera" : "Turn on camera"}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isScreenSharing ? "default" : "outline"}
                size="icon"
                onClick={toggleScreenShare}
                title={isScreenSharing ? "Stop sharing" : "Share screen"}
              >
                {isScreenSharing ? <Monitor className="h-4 w-4" /> : <MonitorOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={toggleRecording}
                title={isRecording ? "Stop recording" : "Start voice recording"}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Previews */}
            {(isVideoOn || isScreenSharing) && (
              <div className="flex gap-4">
                {isVideoOn && (
                  <div className="relative aspect-video w-32 overflow-hidden rounded-lg border border-border bg-muted">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="h-full w-full scale-x-[-1] object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-background/80 px-1 text-xs">You</span>
                  </div>
                )}
                {isScreenSharing && (
                  <div className="relative aspect-video flex-1 overflow-hidden rounded-lg border border-primary bg-muted">
                    <video
                      ref={screenVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="h-full w-full object-contain"
                    />
                    <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-primary/80 px-2 py-0.5 text-xs text-primary-foreground">
                      <Monitor className="h-3 w-3" />
                      Screen Sharing
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="h-[300px] rounded-lg border border-border/50 bg-muted/30 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Starting interview...
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      {message.role === 'assistant' ? (
                        <Sparkles className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'assistant' 
                        ? 'bg-card border border-border/50' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{getMessageText(message)}</p>
                      {status === 'streaming' && index === messages.length - 1 && message.role === 'assistant' && (
                        <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Answer Input */}
            <div className="space-y-4">
              <Textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isStreaming}
              />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex >= questions.length - 1 || isStreaming}
                >
                  Skip Question
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleSubmitAnswer} 
                  disabled={!answer.trim() || isStreaming}
                >
                  {isStreaming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AI Responding...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
