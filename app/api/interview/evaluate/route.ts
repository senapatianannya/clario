import { xai } from "@ai-sdk/xai"
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const evaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categoryScores: z.object({
    technical: z.number().min(0).max(100),
    communication: z.number().min(0).max(100),
    problemSolving: z.number().min(0).max(100),
    cultural_fit: z.number().min(0).max(100),
  }),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  detailedFeedback: z.string(),
  recommendations: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    console.log("[v0] Starting interview evaluation...")
    const { interviewId } = await req.json()
    console.log("[v0] Interview ID:", interviewId)

    if (!interviewId) {
      console.log("[v0] No interview ID provided")
      return Response.json({ error: "Interview ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get interview details and responses
    const { data: interview } = await supabase.from("interviews").select("*").eq("id", interviewId).single()

    const { data: responses } = await supabase
      .from("interview_responses")
      .select(`
        *,
        interview_questions (
          question_text,
          category,
          difficulty,
          expected_answer
        )
      `)
      .eq("interview_id", interviewId)

    if (!interview || !responses) {
      console.log("[v0] Interview data not found")
      return Response.json({ error: "Interview data not found" }, { status: 404 })
    }

    console.log("[v0] Found interview and", responses.length, "responses")

    // Prepare evaluation context
    const evaluationContext = responses.map((response) => ({
      question: response.interview_questions.question_text,
      category: response.interview_questions.category,
      difficulty: response.interview_questions.difficulty,
      expectedAnswer: response.interview_questions.expected_answer,
      candidateAnswer: response.response_text,
      responseTime: response.response_time_seconds,
    }))

    const { object } = await generateObject({
      model: xai("grok-3"),
      schema: evaluationSchema,
      prompt: `Evaluate this ${interview.job_position} interview performance:

Position: ${interview.job_position}
Difficulty Level: ${interview.difficulty_level}
${interview.company_name ? `Company: ${interview.company_name}` : ""}

Interview Responses:
${evaluationContext
  .map(
    (item, index) => `
Question ${index + 1} (${item.category}, ${item.difficulty}):
Q: ${item.question}
A: ${item.candidateAnswer}
Response Time: ${item.responseTime}s
${item.expectedAnswer ? `Expected: ${item.expectedAnswer}` : ""}
`,
  )
  .join("\n")}

Provide a comprehensive evaluation with:
1. Overall score (0-100)
2. Category-specific scores for technical skills, communication, problem-solving, and cultural fit
3. Key strengths demonstrated
4. Areas needing improvement
5. Detailed feedback explaining the evaluation
6. Specific recommendations for improvement

Be constructive and specific in your feedback. Consider the difficulty level and position requirements.`,
    })

    console.log("[v0] Generated evaluation with score:", object.overallScore)

    // Store evaluation results
    const { error: updateError } = await supabase
      .from("interviews")
      .update({
        status: "completed",
        overall_score: object.overallScore,
        technical_score: object.categoryScores.technical,
        communication_score: object.categoryScores.communication,
        problem_solving_score: object.categoryScores.problemSolving,
        cultural_fit_score: object.categoryScores.cultural_fit,
        strengths: object.strengths,
        areas_for_improvement: object.areasForImprovement,
        detailed_feedback: object.detailedFeedback,
        recommendations: object.recommendations,
        completed_at: new Date().toISOString(),
      })
      .eq("id", interviewId)

    if (updateError) {
      console.error("[v0] Error updating interview:", updateError)
      return Response.json({ error: "Failed to save evaluation" }, { status: 500 })
    }

    console.log("[v0] Evaluation saved successfully")
    return Response.json({ evaluation: object })
  } catch (error) {
    console.error("[v0] Error evaluating interview:", error)
    return Response.json({ error: "Failed to evaluate interview" }, { status: 500 })
  }
}
