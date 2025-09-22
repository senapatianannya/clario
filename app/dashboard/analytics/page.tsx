import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Calendar, Target, Award, BarChart3, Clock, Users, Brain, MessageSquare } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's interview statistics
  const { data: interviews } = await supabase
    .from("interviews")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const totalInterviews = interviews?.length || 0
  const completedInterviews = interviews?.filter((i) => i.status === "completed").length || 0
  const averageScore = interviews?.reduce((acc, i) => acc + (i.overall_score || 0), 0) / (completedInterviews || 1)

  // Calculate category averages
  const categoryAverages = {
    technical: interviews?.reduce((acc, i) => acc + (i.technical_score || 0), 0) / (completedInterviews || 1),
    communication: interviews?.reduce((acc, i) => acc + (i.communication_score || 0), 0) / (completedInterviews || 1),
    problem_solving:
      interviews?.reduce((acc, i) => acc + (i.problem_solving_score || 0), 0) / (completedInterviews || 1),
    cultural_fit: interviews?.reduce((acc, i) => acc + (i.cultural_fit_score || 0), 0) / (completedInterviews || 1),
  }

  // Get recent interviews for progress tracking
  const recentInterviews = interviews?.slice(0, 5) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track your interview performance and progress</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalInterviews}</div>
            <p className="text-xs text-muted-foreground">{completedInterviews} completed</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{Math.round(averageScore)}%</div>
            <p className="text-xs text-muted-foreground">Across all interviews</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {Math.max(...(interviews?.map((i) => i.overall_score || 0) || [0]))}%
            </div>
            <p className="text-xs text-muted-foreground">Personal best</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">+12%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance by Category
          </CardTitle>
          <CardDescription>Your average scores across different skill areas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Technical Skills</span>
              </div>
              <span className="text-sm font-bold">{Math.round(categoryAverages.technical)}%</span>
            </div>
            <Progress value={categoryAverages.technical} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Communication</span>
              </div>
              <span className="text-sm font-bold">{Math.round(categoryAverages.communication)}%</span>
            </div>
            <Progress value={categoryAverages.communication} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Problem Solving</span>
              </div>
              <span className="text-sm font-bold">{Math.round(categoryAverages.problem_solving)}%</span>
            </div>
            <Progress value={categoryAverages.problem_solving} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Cultural Fit</span>
              </div>
              <span className="text-sm font-bold">{Math.round(categoryAverages.cultural_fit)}%</span>
            </div>
            <Progress value={categoryAverages.cultural_fit} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Interview History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Interviews
          </CardTitle>
          <CardDescription>Your latest interview sessions and scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInterviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/10">
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">{interview.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {interview.job_position} • {interview.difficulty}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(interview.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      interview.overall_score >= 80
                        ? "default"
                        : interview.overall_score >= 60
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {interview.overall_score}%
                  </Badge>
                  <Button asChild variant="outline" size="sm" className="bg-transparent">
                    <Link href={`/dashboard/interviews/${interview.id}/results`}>View Results</Link>
                  </Button>
                </div>
              </div>
            ))}
            {recentInterviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No interviews completed yet</p>
                <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                  <Link href="/dashboard/interviews/new">Start Your First Interview</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
