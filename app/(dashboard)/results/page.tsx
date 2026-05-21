"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Target,
  Award,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Loader2,
} from "lucide-react"

interface QuestionFeedback {
  question: string
  score: number
  feedback: string
  suggestions: string
}

interface InterviewFeedback {
  overallScore: number
  technicalScore: number
  communicationScore: number
  problemSolvingScore: number
  strengths: string[]
  improvements: string[]
  questionFeedback: QuestionFeedback[]
  overallFeedback: string
  nextSteps: string[]
}

export default function ResultsPage() {
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/interviews/latest')
      .then((res) => res.json())
      .then((json) => {
        if (json.interview?.feedback) {
          setFeedback(json.interview.feedback as InterviewFeedback)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No interview results yet</h2>
        <p className="max-w-md text-muted-foreground">
          Complete a mock interview first. Your results will be saved to the database automatically.
        </p>
        <Link href="/interview">
          <Button className="gap-2">
            Start Mock Interview
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  const categoryScores = [
    { category: 'Technical Skills', score: feedback.technicalScore },
    { category: 'Communication', score: feedback.communicationScore },
    { category: 'Problem Solving', score: feedback.problemSolvingScore },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interview Results</h1>
        <p className="text-muted-foreground">Loaded from your database — latest interview session</p>
      </div>

      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold">{feedback.overallScore}</span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">{feedback.overallFeedback}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryScores.map((cat) => (
              <div key={cat.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{cat.category}</span>
                  <span className="font-medium">{cat.score}%</span>
                </div>
                <Progress value={cat.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-chart-2">
              <CheckCircle2 className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <p key={i} className="rounded-lg border border-chart-2/20 bg-chart-2/5 p-3 text-sm">
                {s}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-chart-5">
            <AlertCircle className="h-5 w-5" />
            Areas to Improve
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {feedback.improvements.map((item, i) => (
            <p key={i} className="rounded-lg border border-chart-5/20 bg-chart-5/5 p-3 text-sm">
              {item}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Question-by-Question Feedback</CardTitle>
          <CardDescription>Detailed AI feedback saved in database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback.questionFeedback.map((item, index) => (
            <div key={index} className="rounded-lg border border-border/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium">{item.question}</p>
                <Badge variant="secondary">{item.score}%</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{item.feedback}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Suggestion: </span>
                {item.suggestions}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {feedback.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Award className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {step}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Link href="/interview">
          <Button className="gap-2">
            Practice Again
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
