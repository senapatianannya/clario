import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Play, BarChart3 } from "lucide-react"
import { redirect } from "next/navigation"

export default async function InterviewDetailPage({ params }: { params: { id: string } }) {
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

  // Get questions count
  const { count: questionsCount } = await supabase
    .from("interview_questions")
    .select("*", { count: "exact" })
    .eq("interview_id", params.id)

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
          <h1 className="text-3xl font-bold text-foreground">{interview.title}</h1>
          <p className="text-muted-foreground">{interview.job_position}</p>
        </div>
      </div>

      {/* Interview Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Interview Information</CardTitle>
            <CardDescription>Details about this interview session</CardDescription>
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
                <p className="font-medium text-foreground">{questionsCount || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={interview.status === "completed" ? "default" : "secondary"}>{interview.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium text-foreground">{new Date(interview.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>What would you like to do?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {interview.status === "draft" || interview.status === "in_progress" ? (
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href={`/interview/${interview.id}`}>
                  <Play className="h-4 w-4 mr-2" />
                  {interview.status === "draft" ? "Start Interview" : "Continue Interview"}
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href={`/interview/${interview.id}`}>
                  <Play className="h-4 w-4 mr-2" />
                  Retake Interview
                </Link>
              </Button>
            )}

            {interview.status === "completed" && (
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href={`/dashboard/interviews/${interview.id}/results`}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Results
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {interview.status === "completed" && interview.overall_score && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Your latest results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{interview.overall_score}%</div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{interview.technical_score || 0}%</div>
                <p className="text-sm text-muted-foreground">Technical</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{interview.communication_score || 0}%</div>
                <p className="text-sm text-muted-foreground">Communication</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{interview.problem_solving_score || 0}%</div>
                <p className="text-sm text-muted-foreground">Problem Solving</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
