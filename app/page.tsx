import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { 
  FileText, 
  Mic, 
  BarChart3, 
  Building2, 
  Upload, 
  Brain, 
  Target, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Monitor
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Powered by Advanced AI</span>
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              AI Resume Analyzer
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              Upload your resume, get instant AI-powered analysis, and practice mock interviews 
              with top tech companies. Land your dream job with confidence.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/upload">
                <Button size="lg" className="gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Resume
                </Button>
              </Link>
              <Link href="/interview">
                <Button size="lg" variant="outline" className="gap-2">
                  <Mic className="h-5 w-5" />
                  Start Interview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our AI-powered platform helps you analyze your resume and practice interviews
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Resume Analysis</CardTitle>
                <CardDescription>
                  Get detailed insights about your resume with AI-powered skill extraction and scoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Skill extraction & matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    ATS compatibility score
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Improvement suggestions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Mock Interviews</CardTitle>
                <CardDescription>
                  Practice with our AI interviewer that adapts to your responses in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Voice-enabled responses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Real-time feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Streaming AI questions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Monitor className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Screen Sharing</CardTitle>
                <CardDescription>
                  Share your screen during coding interviews for a realistic interview experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Live code sharing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Real-time collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Recording & playback
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Company Interviews</CardTitle>
                <CardDescription>
                  Practice with interview questions from Google, Amazon, Microsoft, Meta and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Company-specific questions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Required skill matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Interview tips & tricks
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track your progress with detailed charts and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Strengths & weaknesses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Progress tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Improvement suggestions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Personalized Feedback</CardTitle>
                <CardDescription>
                  Get tailored recommendations based on your career goals and target companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Career path guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Skill gap analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Action items
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 md:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90" />
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
                Ready to Ace Your Interview?
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                Join thousands of job seekers who have improved their interview skills with our AI platform
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold">ResumeAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with AI to help you land your dream job
          </p>
        </div>
      </footer>
    </div>
  )
}
