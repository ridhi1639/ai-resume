"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowRight,
  Download,
  Share2,
  BarChart3,
  Lightbulb,
  RefreshCw
} from "lucide-react"
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts"

const overallScore = 82

const categoryScores = [
  { category: "Technical Skills", score: 85, maxScore: 100 },
  { category: "Communication", score: 78, maxScore: 100 },
  { category: "Problem Solving", score: 88, maxScore: 100 },
  { category: "Behavioral", score: 75, maxScore: 100 },
  { category: "System Design", score: 82, maxScore: 100 },
]

const progressData = [
  { interview: "Interview 1", score: 65 },
  { interview: "Interview 2", score: 70 },
  { interview: "Interview 3", score: 72 },
  { interview: "Interview 4", score: 78 },
  { interview: "Interview 5", score: 82 },
]

const strengthsData = [
  { name: "Technical", value: 35 },
  { name: "Problem Solving", value: 30 },
  { name: "Communication", value: 20 },
  { name: "Leadership", value: 15 },
]

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))']

const strengths = [
  { title: "Strong Technical Foundation", description: "Excellent understanding of data structures and algorithms" },
  { title: "Clear Communication", description: "Explains complex concepts in an understandable way" },
  { title: "Problem-Solving Approach", description: "Systematically breaks down problems into smaller parts" },
]

const weaknesses = [
  { title: "System Design Depth", description: "Could dive deeper into scalability considerations" },
  { title: "Behavioral Examples", description: "Need more concrete examples using STAR format" },
]

const improvements = [
  { 
    title: "Practice System Design", 
    description: "Focus on distributed systems and scalability patterns",
    priority: "High"
  },
  { 
    title: "Prepare STAR Stories", 
    description: "Document 5-7 strong behavioral examples",
    priority: "High"
  },
  { 
    title: "Mock Interview Practice", 
    description: "Schedule 2-3 more practice sessions this week",
    priority: "Medium"
  },
  { 
    title: "Review Edge Cases", 
    description: "Think about boundary conditions in coding problems",
    priority: "Medium"
  },
]

const feedbackCards = [
  {
    question: "Tell me about yourself",
    answer: "I discussed my background in software engineering with 5 years of experience...",
    feedback: "Good structure but could be more concise. Focus on relevant experience for the role.",
    score: 75,
    type: "warning"
  },
  {
    question: "Explain React hooks",
    answer: "I explained useState, useEffect, and custom hooks with examples...",
    feedback: "Excellent technical explanation with practical examples. Great job!",
    score: 92,
    type: "success"
  },
  {
    question: "Design a URL shortener",
    answer: "I discussed the system architecture, database schema, and API design...",
    feedback: "Good high-level design but could explore caching and scaling more.",
    score: 78,
    type: "warning"
  },
]

export default function ResultsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Results</h1>
          <p className="text-muted-foreground">Your performance analysis and improvement suggestions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="border-border/50 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          <CardContent className="relative p-8">
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold">{overallScore}</span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary">+12% from last interview</span>
                </div>
              </div>
              
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Top 15%</p>
                  <p className="text-xs text-muted-foreground">of candidates</p>
                </div>
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chart-2/10">
                    <Award className="h-8 w-8 text-chart-2" />
                  </div>
                  <p className="mt-2 text-sm font-medium">Ready</p>
                  <p className="text-xs text-muted-foreground">for interviews</p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Category Scores */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Category Performance
            </CardTitle>
            <CardDescription>Your scores across different interview categories</CardDescription>
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
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Progress Over Time
            </CardTitle>
            <CardDescription>Your interview score progression</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="interview" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-chart-2">
              <CheckCircle2 className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {strengths.map((strength, index) => (
              <div key={index} className="rounded-lg bg-chart-2/5 border border-chart-2/20 p-4">
                <p className="font-medium">{strength.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{strength.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-chart-5">
              <AlertCircle className="h-5 w-5" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weaknesses.map((weakness, index) => (
              <div key={index} className="rounded-lg bg-chart-5/5 border border-chart-5/20 p-4">
                <p className="font-medium">{weakness.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{weakness.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Skill Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={strengthsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {strengthsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {strengthsData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Feedback */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Question-by-Question Feedback
          </CardTitle>
          <CardDescription>Detailed analysis of each answer</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="good">Good</TabsTrigger>
              <TabsTrigger value="improve">Needs Work</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4 space-y-4">
              {feedbackCards.map((card, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg border p-4 ${
                    card.type === 'success' 
                      ? 'border-chart-2/30 bg-chart-2/5' 
                      : 'border-chart-3/30 bg-chart-3/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {card.type === 'success' ? (
                          <CheckCircle2 className="h-4 w-4 text-chart-2" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-chart-3" />
                        )}
                        <p className="font-medium">{card.question}</p>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{card.answer}</p>
                      <p className="mt-2 text-sm">{card.feedback}</p>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {card.score}%
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="good" className="mt-4">
              {feedbackCards.filter(c => c.type === 'success').map((card, index) => (
                <div key={index} className="rounded-lg border border-chart-2/30 bg-chart-2/5 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-chart-2" />
                        <p className="font-medium">{card.question}</p>
                      </div>
                      <p className="mt-2 text-sm">{card.feedback}</p>
                    </div>
                    <Badge variant="secondary">{card.score}%</Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="improve" className="mt-4 space-y-4">
              {feedbackCards.filter(c => c.type === 'warning').map((card, index) => (
                <div key={index} className="rounded-lg border border-chart-3/30 bg-chart-3/5 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-chart-3" />
                        <p className="font-medium">{card.question}</p>
                      </div>
                      <p className="mt-2 text-sm">{card.feedback}</p>
                    </div>
                    <Badge variant="secondary">{card.score}%</Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Improvement Suggestions
          </CardTitle>
          <CardDescription>Actionable steps to improve your interview performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {improvements.map((item, index) => (
              <div key={index} className="flex items-start gap-4 rounded-lg border border-border/50 p-4">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  item.priority === 'High' ? 'bg-chart-5/10' : 'bg-chart-3/10'
                }`}>
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.title}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.priority === 'High' ? 'border-chart-5/50 text-chart-5' : 'border-chart-3/50 text-chart-3'
                      }`}
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link href="/interview">
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Practice Again
          </Button>
        </Link>
        <Link href="/companies">
          <Button variant="outline" className="gap-2">
            <Target className="h-4 w-4" />
            Company-Specific Practice
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            Back to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
