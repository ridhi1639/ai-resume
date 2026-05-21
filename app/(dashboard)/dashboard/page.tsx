"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Award,
  ArrowRight,
  Upload,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface DashboardData {
  resumeScore: number | null
  skills: string[]
  interviewCount: number
  averageScore: number | null
  recentInterviews: { id: string; score: number; date: string }[]
  hasResume: boolean
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => setData(json))
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

  const resumeScore = data?.resumeScore ?? 0
  const skills = data?.skills?.length ? data.skills : []
  const interviewCount = data?.interviewCount ?? 0
  const averageScore = data?.averageScore ?? 0
  const recentInterviews = data?.recentInterviews ?? []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your interview preparation progress.</p>
        </div>
        <Link href="/interview">
          <Button className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Start Mock Interview
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resume Score</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {data?.hasResume ? (
              <>
                <div className="text-2xl font-bold">{resumeScore}/100</div>
                <Progress value={resumeScore} className="mt-2" />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Upload a resume to get your score</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewCount}</div>
            <p className="mt-2 text-xs text-muted-foreground">Saved in database</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore ? `${averageScore}%` : '—'}</div>
            <p className="mt-2 text-xs text-muted-foreground">
              {interviewCount > 0 ? 'Across all interviews' : 'Complete an interview first'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Skills Matched</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skills.length}</div>
            <p className="mt-2 text-xs text-muted-foreground">From latest resume</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Extracted Skills
            </CardTitle>
            <CardDescription>Skills identified from your resume</CardDescription>
          </CardHeader>
          <CardContent>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No skills yet. Upload your resume first.</p>
            )}
            <Link href="/upload" className="mt-4 inline-block">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Update Resume
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Interview Progress
            </CardTitle>
            <CardDescription>Your recent mock interview sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInterviews.length > 0 ? (
              recentInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        interview.score >= 90
                          ? 'bg-primary/20 text-primary'
                          : interview.score >= 80
                            ? 'bg-chart-2/20 text-chart-2'
                            : 'bg-chart-5/20 text-chart-5'
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Mock Interview</p>
                      <p className="text-sm text-muted-foreground">AI practice session</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{interview.score}%</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(interview.date), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No interviews yet. Start your first mock interview!</p>
            )}
            <Link href="/results">
              <Button variant="outline" className="w-full gap-2">
                View All Results
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Continue your interview preparation journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/upload" className="block">
              <div className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Upload Resume</p>
                  <p className="text-sm text-muted-foreground">Get AI analysis</p>
                </div>
              </div>
            </Link>
            <Link href="/interview" className="block">
              <div className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Mock Interview</p>
                  <p className="text-sm text-muted-foreground">Practice with AI</p>
                </div>
              </div>
            </Link>
            <Link href="/companies" className="block">
              <div className="flex items-center gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Company Prep</p>
                  <p className="text-sm text-muted-foreground">FAANG interviews</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
