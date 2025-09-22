import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { interviewId, responses } = await req.json()

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Store interview responses
    const responsesToInsert = responses.map((response: any) => ({
      interview_id: interviewId,
      question_id: response.questionId,
      response_text: response.answer,
      response_time_seconds: response.responseTime || 0,
      user_id: user.id,
    }))

    const { error: insertError } = await supabase.from("interview_responses").insert(responsesToInsert)

    if (insertError) {
      console.error("Error inserting responses:", insertError)
      return NextResponse.json({ error: "Failed to save responses" }, { status: 500 })
    }

    // Update interview status to submitted
    const { error: updateError } = await supabase
      .from("interviews")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", interviewId)

    if (updateError) {
      console.error("Error updating interview:", updateError)
      return NextResponse.json({ error: "Failed to update interview" }, { status: 500 })
    }

    return NextResponse.json({ message: "Interview submitted successfully" })
  } catch (error) {
    console.error("Error submitting interview:", error)
    return NextResponse.json({ error: "Failed to submit interview" }, { status: 500 })
  }
}
