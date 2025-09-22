import { createClient } from "@/lib/supabase/server"

export async function DELETE(req: Request) {
  try {
    console.log("[v0] Starting interview deletion...")
    const { searchParams } = new URL(req.url)
    const interviewId = searchParams.get("id")

    if (!interviewId) {
      console.log("[v0] No interview ID provided")
      return Response.json({ error: "Interview ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      console.log("[v0] User not authenticated")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify interview belongs to user
    const { data: interview, error: interviewError } = await supabase
      .from("interviews")
      .select("id, user_id")
      .eq("id", interviewId)
      .eq("user_id", user.id)
      .single()

    if (interviewError || !interview) {
      console.log("[v0] Interview not found or unauthorized")
      return Response.json({ error: "Interview not found" }, { status: 404 })
    }

    console.log("[v0] Deleting interview responses...")
    // Delete interview responses first (foreign key constraint)
    const { error: responsesError } = await supabase
      .from("interview_responses")
      .delete()
      .eq("interview_id", interviewId)

    if (responsesError) {
      console.error("[v0] Error deleting responses:", responsesError)
      return Response.json({ error: "Failed to delete interview responses" }, { status: 500 })
    }

    console.log("[v0] Deleting interview questions...")
    // Delete interview questions
    const { error: questionsError } = await supabase
      .from("interview_questions")
      .delete()
      .eq("interview_id", interviewId)

    if (questionsError) {
      console.error("[v0] Error deleting questions:", questionsError)
      return Response.json({ error: "Failed to delete interview questions" }, { status: 500 })
    }

    console.log("[v0] Deleting interview...")
    // Finally delete the interview
    const { error: deleteError } = await supabase
      .from("interviews")
      .delete()
      .eq("id", interviewId)
      .eq("user_id", user.id)

    if (deleteError) {
      console.error("[v0] Error deleting interview:", deleteError)
      return Response.json({ error: "Failed to delete interview" }, { status: 500 })
    }

    console.log("[v0] Interview deleted successfully")
    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting interview:", error)
    return Response.json({ error: "Failed to delete interview" }, { status: 500 })
  }
}
