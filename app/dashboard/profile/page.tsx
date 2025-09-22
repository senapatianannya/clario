"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarDays, TrendingUp, Award, Target, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"

interface Interview {
  id: string
  job_position: string
  company_name: string
  difficulty_level: string
  status: string
  overall_score: number
  technical_score: number
  communication_score: number
  problem_solving_score: number
  cultural_fit_score: number
  strengths: string[]
  areas_for_improvement: string[]
  detailed_feedback: string
  recommendations: string[]
  created_at: string
  completed_at: string
}

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: interviewsData } = await supabase
          .from("interviews")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "completed")
          .order("completed_at", { ascending: false })

        setInterviews(interviewsData || [])
      }
      setLoading(false)
    }

    fetchUserData()
  }, [supabase])

  const deleteInterview = async (interviewId: string) => {
    const { error } = await supabase.from("interviews").delete().eq("id", interviewId)

    if (!error) {
      setInterviews(interviews.filter((interview) => interview.id !== interviewId))
    }
  }

  const averageScore =
    interviews.length > 0
      ? Math.round(interviews.reduce((sum, interview) => sum + interview.overall_score, 0) / interviews.length)
      : 0

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U"

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.user_metadata?.full_name || user?.email}</CardTitle>
                <CardDescription>{user?.user_metadata?.full_name && user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{interviews.length}</div>
                <div className="text-sm text-muted-foreground">Interviews Completed</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {interviews.filter((i) => i.overall_score >= 80).length}
                </div>
                <div className="text-sm text-muted-foreground">Excellent Performances</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview History */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Interview History</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {interviews.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No completed interviews yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start practicing to see your feedback and progress here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              interviews.map((interview) => (
                <Card key={interview.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {interview.job_position}
                          {interview.company_name && (
                            <span className="text-muted-foreground">at {interview.company_name}</span>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {format(new Date(interview.completed_at), "MMM dd, yyyy")}
                          </span>
                          <Badge variant="outline">{interview.difficulty_level}</Badge>
                          <Badge variant={getScoreBadgeVariant(interview.overall_score)}>
                            {interview.overall_score}% Overall
                          </Badge>
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteInterview(interview.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Technical</div>
                        <div className="flex items-center gap-2">
                          <Progress value={interview.technical_score} className="flex-1" />
                          <span className="text-sm font-medium">{interview.technical_score}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Communication</div>
                        <div className="flex items-center gap-2">
                          <Progress value={interview.communication_score} className="flex-1" />
                          <span className="text-sm font-medium">{interview.communication_score}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Problem Solving</div>
                        <div className="flex items-center gap-2">
                          <Progress value={interview.problem_solving_score} className="flex-1" />
                          <span className="text-sm font-medium">{interview.problem_solving_score}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Cultural Fit</div>
                        <div className="flex items-center gap-2">
                          <Progress value={interview.cultural_fit_score} className="flex-1" />
                          <span className="text-sm font-medium">{interview.cultural_fit_score}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Summary */}
                    <div className="space-y-3">
                      {interview.strengths && interview.strengths.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-green-500 mb-2">Strengths</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {interview.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Award className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {interview.areas_for_improvement && interview.areas_for_improvement.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-yellow-500 mb-2">Areas for Improvement</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {interview.areas_for_improvement.map((area, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <TrendingUp className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {interview.detailed_feedback && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Detailed Feedback</h4>
                          <p className="text-sm text-muted-foreground">{interview.detailed_feedback}</p>
                        </div>
                      )}

                      {interview.recommendations && interview.recommendations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-primary mb-2">Recommendations</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {interview.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Target className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Your improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {interviews.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Latest Score</span>
                        <span className={`font-bold ${getScoreColor(interviews[0]?.overall_score || 0)}`}>
                          {interviews[0]?.overall_score || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Best Score</span>
                        <span className="font-bold text-green-500">
                          {Math.max(...interviews.map((i) => i.overall_score))}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Score</span>
                        <span className={`font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Complete interviews to see your performance trends
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Skill Breakdown</CardTitle>
                  <CardDescription>Average scores by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {interviews.length > 0 ? (
                    <div className="space-y-4">
                      {[
                        { name: "Technical", key: "technical_score" },
                        { name: "Communication", key: "communication_score" },
                        { name: "Problem Solving", key: "problem_solving_score" },
                        { name: "Cultural Fit", key: "cultural_fit_score" },
                      ].map((skill) => {
                        const avgScore = Math.round(
                          interviews.reduce(
                            (sum, interview) => sum + (interview[skill.key as keyof Interview] as number),
                            0,
                          ) / interviews.length,
                        )
                        return (
                          <div key={skill.key}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">{skill.name}</span>
                              <span className="text-sm font-medium">{avgScore}%</span>
                            </div>
                            <Progress value={avgScore} />
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Complete interviews to see your skill breakdown
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
