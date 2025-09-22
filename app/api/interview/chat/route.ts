import { xai } from "@ai-sdk/xai"
import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const {
      messages,
      interviewId,
      currentQuestionId,
    }: {
      messages: UIMessage[]
      interviewId: string
      currentQuestionId?: string
    } = await req.json()

    const supabase = await createClient()

    // Get interview and current question details
    const { data: interview } = await supabase
      .from("interviews")
      .select("*")
      .eq("id", interviewId)
      .single()

    const { data: currentQuestion } = currentQuestionId
      ? await supabase
          .from("interview_questions")
          .select("*")
          .eq("id", currentQuestionId)
          .single()
      : { data: null }

    const systemPrompt = `You are an AI interviewer conducting a ${interview?.job_position || "professional"} interview. 

Your role:
- Ask thoughtful follow-up questions based on the candidate's responses
- Provide encouraging but professional feedback
- Keep the conversation focused on the interview topic
- Be conversational but maintain professionalism
- If the candidate asks for clarification, provide it helpfully
- Move the conversation forward naturally

Current question context: ${currentQuestion?.question_text || "General interview discussion"}

Guidelines:
- Keep responses concise and engaging
- Ask one follow-up question at a time
- Acknowledge good points in their answers
- If they're struggling, provide gentle guidance
- Maintain a supportive but evaluative tone`

    const prompt = convertToModelMessages([
      { role: "system", parts: [{ type: "text", text: systemPrompt }] },
      ...messages
    ])

    const result = streamText({
      model: xai("grok-3"),
      messages: prompt,
      maxOutputTokens: 500, // Changed from maxTokens to maxOutputTokens
      temperature: 0.7,
      abortSignal: req.signal,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error in interview chat:", error)
    return Response.json({ error: "Failed to process chat" }, { status: 500 })
  }
}