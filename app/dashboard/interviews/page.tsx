"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { MessageSquare, Plus, Eye, Trash2, Calendar, Clock, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Interview {
  id: string
  title: string
  job_position: string
  company_name?: string
  status: string
  overall_score?: number
  created_at: string
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadInterviews()
  }, [])

  const loadInterviews = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase
        .from("interviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setInterviews(data || [])
    } catch (error) {
      console.error("Error loading interviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteInterview = async (interviewId: string) => {
    if (!confirm("Are you sure you want to delete this interview? This action cannot be undone.")) {
      return
    }

    setDeletingId(interviewId)
    try {
      const response = await fetch(`/api/interview/delete?id=${interviewId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error deleting interview:", errorData)
        alert("Failed to delete interview. Please try again.")
        return
      }

      // Remove from local state
      setInterviews((prev) => prev.filter((interview) => interview.id !== interviewId))
    } catch (error) {
      console.error("Error deleting interview:", error)
      alert("Failed to delete interview. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interview Management</h1>
          <p className="text-muted-foreground">Manage and review your practice sessions</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/dashboard/interviews/new">
            <Plus className="h-4 w-4 mr-2" />
            New Interview
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{interviews?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {interviews?.filter((i) => i.status === "completed").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {interviews?.filter((i) => i.status === "in_progress").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {interviews?.length
                ? Math.round(
                    interviews.filter((i) => i.overall_score).reduce((acc, i) => acc + (i.overall_score || 0), 0) /
                      interviews.filter((i) => i.overall_score).length,
                  ) || 0
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interviews Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Interviews</CardTitle>
          <CardDescription>View and manage your interview practice sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {interviews && interviews.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.map((interview) => (
                  <TableRow key={interview.id}>
                    <TableCell className="font-medium">{interview.title}</TableCell>
                    <TableCell>{interview.job_position}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      {interview.overall_score ? (
                        <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                          {interview.overall_score}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(interview.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button asChild size="sm" variant="outline" className="bg-transparent">
                          <Link
                            href={
                              interview.status === "completed"
                                ? `/dashboard/interviews/${interview.id}/results`
                                : `/interview/${interview.id}`
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent text-destructive hover:text-destructive"
                          onClick={() => deleteInterview(interview.id)}
                          disabled={deletingId === interview.id}
                        >
                          {deletingId === interview.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">No interviews yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first interview to start practicing and improving your skills
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/dashboard/interviews/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Interview
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
