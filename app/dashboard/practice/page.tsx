"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, Star, Target, TrendingUp } from "lucide-react"

const practiceScenarios = [
  {
    id: 1,
    title: "Technical Interview Basics",
    description: "Practice fundamental technical questions for software engineering roles",
    difficulty: "Beginner",
    duration: "15-20 min",
    topics: ["Data Structures", "Algorithms", "Problem Solving"],
    color: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    title: "System Design Interview",
    description: "Learn to design scalable systems and discuss architecture decisions",
    difficulty: "Advanced",
    duration: "45-60 min",
    topics: ["Scalability", "Architecture", "Trade-offs"],
    color: "bg-red-100 text-red-800",
  },
  {
    id: 3,
    title: "Behavioral Questions",
    description: "Master the STAR method and common behavioral interview questions",
    difficulty: "Intermediate",
    duration: "20-30 min",
    topics: ["Leadership", "Teamwork", "Problem Resolution"],
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 4,
    title: "Frontend Development",
    description: "Practice React, JavaScript, and frontend-specific interview questions",
    difficulty: "Intermediate",
    duration: "25-35 min",
    topics: ["React", "JavaScript", "CSS", "Performance"],
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 5,
    title: "Backend Development",
    description: "Focus on server-side technologies, databases, and API design",
    difficulty: "Intermediate",
    duration: "30-40 min",
    topics: ["APIs", "Databases", "Security", "Performance"],
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: 6,
    title: "Mock Interview Simulation",
    description: "Full-length practice interview with mixed question types",
    difficulty: "Advanced",
    duration: "60-90 min",
    topics: ["Technical", "Behavioral", "System Design"],
    color: "bg-indigo-100 text-indigo-800",
  },
]

const tips = [
  {
    icon: Target,
    title: "Set Clear Goals",
    description: "Define what you want to achieve in each practice session",
  },
  {
    icon: Clock,
    title: "Time Management",
    description: "Practice answering questions within typical interview time limits",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Review your performance and identify areas for improvement",
  },
]

export default function PracticePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All")

  const filteredScenarios =
    selectedDifficulty === "All"
      ? practiceScenarios
      : practiceScenarios.filter((scenario) => scenario.difficulty === selectedDifficulty)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-balance">Practice Interviews</h1>
        <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
          Sharpen your interview skills with our curated practice scenarios. Build confidence and improve your
          performance.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {["All", "Beginner", "Intermediate", "Advanced"].map((difficulty) => (
          <Button
            key={difficulty}
            variant={selectedDifficulty === difficulty ? "default" : "outline"}
            onClick={() => setSelectedDifficulty(difficulty)}
            className="rounded-full"
          >
            {difficulty}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenarios.map((scenario) => (
          <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{scenario.title}</CardTitle>
                  <Badge className={scenario.color}>{scenario.difficulty}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {scenario.duration}
                </div>
              </div>
              <CardDescription className="text-pretty">{scenario.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {scenario.topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
              <Button className="w-full" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Start Practice
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Practice Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <tip.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">{tip.title}</h3>
              <p className="text-sm text-muted-foreground text-pretty">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center space-y-4 py-8">
        <h2 className="text-2xl font-semibold">Ready for a Real Interview?</h2>
        <p className="text-muted-foreground">
          Once you've practiced enough, create a custom interview tailored to your target role.
        </p>
        <Button size="lg" className="rounded-full">
          <Star className="w-4 h-4 mr-2" />
          Create Custom Interview
        </Button>
      </div>
    </div>
  )
}
