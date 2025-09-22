import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { xai } from "@ai-sdk/xai"
import { z } from "zod"

const feedbackSchema = z.object({
  overall_score: z.number().min(0).max(100),
  technical_score: z.number().min(0).max(100),
  communication_score: z.number().min(0).max(100),
  problem_solving_score: z.number().min(0).max(100),
  cultural_fit_score: z.number().min(0).max(100),
  detailed_feedback: z.string(),
  strengths: z.array(z.string()),
  areas_for_improvement: z.array(z.string()),
  recommendations: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { interviewId, responses, jobPosition, difficulty } = await request.json()

    // Get interview questions and responses
    const { data: interviewData } = await supabase
      .from("interviews")
      .select(`
        *,
        interview_questions (
          question_text,
          category,
          difficulty
        )
      `)
      .eq("id", interviewId)
      .single()

    if (!interviewData) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    // Prepare context for AI evaluation
    const evaluationContext = `
      Job Position: ${jobPosition}
      Difficulty Level: ${difficulty}
      
      Questions and Responses:
      ${responses
        .map(
          (r: any, i: number) => `
        Q${i + 1}: ${r.question}
        Answer: ${r.answer}
        Category: ${r.category}
      `,
        )
        .join("\n")}
    `

    // Generate comprehensive feedback using AI
    const { object: feedback } = await generateObject({
      model: xai("grok-3"),
      schema: feedbackSchema,
      prompt: `
        You are an expert interview coach evaluating a candidate's performance in a ${jobPosition} interview.
        
        Please provide a comprehensive evaluation based on the following interview responses:
        
        ${evaluationContext}
        
        Evaluate the candidate across these dimensions:
        1. Technical Skills (0-100): Knowledge, accuracy, depth of technical responses
        2. Communication (0-100): Clarity, articulation, structure of responses
        3. Problem Solving (0-100): Analytical thinking, approach to challenges
        4. Cultural Fit (0-100): Alignment with company values, teamwork, attitude
        
        Provide:
        - Detailed feedback (2-3 paragraphs)
        - 3-5 specific strengths
        - 3-5 areas for improvement
        - 3-5 actionable recommendations
        
        Be constructive, specific, and encouraging while being honest about areas needing work.
      `,
    })

    // Update interview with feedback
    const { error: updateError } = await supabase
      .from("interviews")
      .update({
        status: "completed",
        overall_score: feedback.overall_score,
        technical_score: feedback.technical_score,
        communication_score: feedback.communication_score,
        problem_solving_score: feedback.problem_solving_score,
        cultural_fit_score: feedback.cultural_fit_score,
        detailed_feedback: feedback.detailed_feedback,
        strengths: feedback.strengths,
        areas_for_improvement: feedback.areas_for_improvement,
        recommendations: feedback.recommendations,
        completed_at: new Date().toISOString(),
      })
      .eq("id", interviewId)

    if (updateError) {
      console.error("Error updating interview:", updateError)
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Error generating feedback:", error)
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 })
  }
}
