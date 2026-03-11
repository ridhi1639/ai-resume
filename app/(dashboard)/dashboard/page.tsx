"use client"

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
  CheckCircle2
} from "lucide-react"

const skills = [
  "React", "TypeScript", "Node.js", "Python", "AWS", "Docker", 
  "GraphQL", "PostgreSQL", "REST APIs", "Git", "CI/CD", "Agile"
]

const recentInterviews = [
  { company: "Google", role: "Senior Frontend", score: 85, date: "2 days ago" },
  { company: "Amazon", role: "Full Stack", score: 78, date: "5 days ago" },
  { company: "Meta", role: "React Developer", score: 92, date: "1 week ago" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resume Score</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85/100</div>
            <Progress value={85} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">+5 from last update</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="mt-2 text-xs text-muted-foreground">3 this week</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="mt-2 text-xs text-primary">+12% improvement</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Skills Matched</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="mt-2 text-xs text-muted-foreground">Across 4 companies</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Extracted Skills */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Extracted Skills
            </CardTitle>
            <CardDescription>Skills identified from your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
            <Link href="/upload" className="mt-4 inline-block">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Update Resume
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Interview Progress */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Interview Progress
            </CardTitle>
            <CardDescription>Your recent mock interview sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInterviews.map((interview, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    interview.score >= 90 ? 'bg-primary/20 text-primary' :
                    interview.score >= 80 ? 'bg-chart-2/20 text-chart-2' :
                    'bg-chart-5/20 text-chart-5'
                  }`}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{interview.company}</p>
                    <p className="text-sm text-muted-foreground">{interview.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{interview.score}%</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {interview.date}
                  </p>
                </div>
              </div>
            ))}
            <Link href="/results">
              <Button variant="outline" className="w-full gap-2">
                View All Results
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
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
