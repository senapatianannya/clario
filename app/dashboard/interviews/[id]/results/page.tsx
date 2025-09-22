import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  ArrowLeft,
  TrendingUp,
  MessageSquare,
  Brain,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react"
import { redirect } from "next/navigation"

export default async function InterviewResultsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get interview details
  const { data: interview, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (error || !interview) {
    redirect("/dashboard/interviews")
  }

  // Get interview responses
  const { data: responses } = await supabase
    .from("interview_responses")
    .select(`
      *,
      interview_questions (
        question_text,
        category,
        difficulty
      )
    `)
    .eq("interview_id", params.id)

  const categoryScores = {
    technical: interview.technical_score || 0,
    communication: interview.communication_score || 0,
    problem_solving: interview.problem_solving_score || 0,
    cultural_fit: interview.cultural_fit_score || 0,
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm" className="bg-transparent">
          <Link href="/dashboard/interviews">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interview Results</h1>
          <p className="text-muted-foreground">{interview.title}</p>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Overall Performance
          </CardTitle>
          <CardDescription>Your comprehensive interview score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(interview.overall_score || 0)}`}>
                {interview.overall_score || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
            <div className="flex-1">
              <Progress value={interview.overall_score || 0} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <Badge variant={getScoreBadgeVariant(interview.overall_score || 0)} className="text-sm px-3 py-1">
              {interview.overall_score >= 80
                ? "Excellent"
                : interview.overall_score >= 60
                  ? "Good"
                  : "Needs Improvement"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technical Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(categoryScores.technical)}`}>
              {categoryScores.technical}%
            </div>
            <Progress value={categoryScores.technical} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communication</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(categoryScores.communication)}`}>
              {categoryScores.communication}%
            </div>
            <Progress value={categoryScores.communication} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problem Solving</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(categoryScores.problem_solving)}`}>
              {categoryScores.problem_solving}%
            </div>
            <Progress value={categoryScores.problem_solving} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cultural Fit</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(categoryScores.cultural_fit)}`}>
              {categoryScores.cultural_fit}%
            </div>
            <Progress value={categoryScores.cultural_fit} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Feedback */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Detailed Feedback
          </CardTitle>
          <CardDescription>Comprehensive analysis of your performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground">
            <p className="leading-relaxed">{interview.detailed_feedback}</p>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Areas for Improvement */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
            <CardDescription>What you did well</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {interview.strengths?.map((strength: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
            <CardDescription>Focus areas for growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {interview.areas_for_improvement?.map((area: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-foreground">{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-secondary" />
            Recommendations
          </CardTitle>
          <CardDescription>Next steps to improve your interview skills</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {interview.recommendations?.map((recommendation: string, index: number) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10">
                <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-secondary">{index + 1}</span>
                </div>
                <span className="text-sm text-foreground">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/dashboard/interviews/new">Practice Again</Link>
        </Button>
        <Button asChild variant="outline" className="bg-transparent">
          <Link href="/dashboard/analytics">View Analytics</Link>
        </Button>
      </div>
    </div>
  )
}
