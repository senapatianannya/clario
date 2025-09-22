import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, interviewId, context } = await request.json()

    // Get interview context
    const { data: interview } = await supabase.from("interviews").select("*").eq("id", interviewId).single()

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    const result = await streamText({
      model: openai("gpt-4"),
      messages: [
        {
          role: "system",
          content: `You are an AI interview assistant helping a candidate prepare for a ${interview.job_position} position. 
          
          Your role is to:
          - Provide helpful hints and guidance during the interview
          - Suggest improvements to answers
          - Help clarify questions when asked
          - Encourage the candidate
          
          Be supportive, professional, and constructive. Keep responses concise and actionable.
          
          Interview Context:
          - Position: ${interview.job_position}
          - Company: ${interview.company_name || "Not specified"}
          - Difficulty: ${interview.difficulty_level}
          
          Current Context: ${context || "No additional context provided"}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error with AI assistant:", error)
    return NextResponse.json({ error: "Failed to get AI assistance" }, { status: 500 })
  }
}
