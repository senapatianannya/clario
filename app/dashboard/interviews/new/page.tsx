"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

const jobPositions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "DevOps Engineer",
  "Mobile Developer",
  "QA Engineer",
  "Business Analyst",
  "Marketing Manager",
  "Sales Representative",
  "Customer Success Manager",
  "Other",
]

const difficultyLevels = [
  { value: "beginner", label: "Beginner", description: "Entry-level questions" },
  { value: "intermediate", label: "Intermediate", description: "Mid-level professional questions" },
  { value: "advanced", label: "Advanced", description: "Senior-level and complex questions" },
]

export default function NewInterviewPage() {
  const [title, setTitle] = useState("")
  const [jobPosition, setJobPosition] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [difficultyLevel, setDifficultyLevel] = useState("intermediate")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("interviews")
        .insert({
          user_id: user.id,
          title: title || `${jobPosition} Interview`,
          job_position: jobPosition,
          company_name: companyName || null,
          difficulty_level: difficultyLevel,
          status: "draft",
        })
        .select()
        .single()

      if (error) throw error

      const generateResponse = await fetch("/api/interview/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId: data.id }),
      })

      if (!generateResponse.ok) {
        throw new Error("Failed to generate questions")
      }

      router.push(`/interview/${data.id}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-foreground">Create New Interview</h1>
          <p className="text-muted-foreground">Set up your AI-powered practice session</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Interview Details
            </CardTitle>
            <CardDescription>Configure your practice session parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Interview Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="e.g., Frontend Developer at Google"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobPosition">Job Position *</Label>
                <Select value={jobPosition} onValueChange={setJobPosition} required>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select a job position" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobPositions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input
                  id="companyName"
                  placeholder="e.g., Google, Microsoft, Startup Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm text-muted-foreground">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && <div className="text-destructive text-sm">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading || !jobPosition}
              >
                {isLoading ? "Creating Interview..." : "Start Interview"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Interview Preview</CardTitle>
            <CardDescription>Here's what your interview will look like</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h3 className="font-medium text-foreground mb-2">
                {title || (jobPosition ? `${jobPosition} Interview` : "Interview Title")}
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Position: {jobPosition || "Not selected"}</p>
                {companyName && <p>Company: {companyName}</p>}
                <p>Difficulty: {difficultyLevels.find((l) => l.value === difficultyLevel)?.label}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">What to expect:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  AI-generated questions tailored to your selected position
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  Voice interaction with our AI interviewer
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Real-time feedback and scoring
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                  Complete transcript and detailed analysis
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
