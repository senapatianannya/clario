import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MessageSquare, TrendingUp, Target, Play, BarChart3, Calendar, Award, ArrowRight } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's interviews
  const { data: interviews } = await supabase
    .from("interviews")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get interview stats
  const { data: stats } = await supabase.from("interviews").select("status, overall_score").eq("user_id", user.id)

  const totalInterviews = stats?.length || 0
  const completedInterviews = stats?.filter((s) => s.status === "completed").length || 0
  const averageScore = stats?.length
    ? Math.round(
        stats.filter((s) => s.overall_score).reduce((acc, s) => acc + (s.overall_score || 0), 0) /
          stats.filter((s) => s.overall_score).length,
      ) || 0
    : 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground">Here's your interview preparation progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalInterviews}</div>
            <p className="text-xs text-muted-foreground">Practice sessions completed</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{completedInterviews}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">Performance rating</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {interviews?.filter((i) => {
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return new Date(i.created_at) > weekAgo
              }).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Recent practice sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Start New Interview
            </CardTitle>
            <CardDescription>Begin a new practice session with AI-powered questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/dashboard/interviews/new">
                Start Practice Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-secondary" />
              View Analytics
            </CardTitle>
            <CardDescription>Track your progress and identify areas for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/analytics">
                View Progress
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Interviews */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>Your latest practice sessions</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="bg-transparent">
              <Link href="/dashboard/interviews">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {interviews && interviews.length > 0 ? (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{interview.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {interview.job_position} • {new Date(interview.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {interview.overall_score && (
                      <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                        {interview.overall_score}%
                      </Badge>
                    )}
                    <Badge
                      variant={
                        interview.status === "completed"
                          ? "default"
                          : interview.status === "in_progress"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        interview.status === "completed"
                          ? "bg-primary/20 text-primary"
                          : interview.status === "in_progress"
                            ? "bg-secondary/20 text-secondary"
                            : ""
                      }
                    >
                      {interview.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No interviews yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first practice session to begin improving your interview skills
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/dashboard/interviews/new">Create Your First Interview</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            Your Progress
          </CardTitle>
          <CardDescription>Keep up the great work!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary mb-1">{completedInterviews}</div>
              <div className="text-sm text-muted-foreground">Interviews Completed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/10">
              <div className="text-2xl font-bold text-secondary mb-1">{averageScore}%</div>
              <div className="text-sm text-muted-foreground">Average Performance</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.max(0, Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)))}
              </div>
              <div className="text-sm text-muted-foreground">Days Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
