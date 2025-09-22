import { xai } from "@ai-sdk/xai"
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const interviewQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      category: z.enum(["technical", "behavioral", "situational", "company_specific"]),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]),
      expectedAnswer: z.string().optional(),
      followUpQuestions: z.array(z.string()).optional(),
    }),
  ),
})

export async function POST(req: Request) {
  try {
    console.log(" Starting question generation...")
    const { interviewId } = await req.json()
    console.log("[ Interview ID:", interviewId)

    if (!interviewId) {
      console.log(" No interview ID provided")
      return Response.json({ error: "Interview ID is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get interview details
    const { data: interview, error } = await supabase.from("interviews").select("*").eq("id", interviewId).single()

    if (error || !interview) {
      console.log(" Interview not found:", error)
      return Response.json({ error: "Interview not found" }, { status: 404 })
    }

    console.log(" Interview found:", interview.job_position, interview.difficulty_level)

    // Check if questions already exist
    const { data: existingQuestions } = await supabase
      .from("interview_questions")
      .select("id")
      .eq("interview_id", interviewId)

    if (existingQuestions && existingQuestions.length > 0) {
      console.log(" Questions already exist, returning existing questions")
      const { data: questions } = await supabase
        .from("interview_questions")
        .select("*")
        .eq("interview_id", interviewId)
        .order("order_index")

      return Response.json({
        questions:
          questions?.map((q) => ({
            id: q.id,
            question: q.question_text,
            category: q.category,
            difficulty: q.difficulty,
          })) || [],
      })
    }

    const { object } = await generateObject({
      model: xai("grok-3"),
      schema: interviewQuestionsSchema,
      prompt: `Generate 8-12 interview questions for a ${interview.job_position} position${
        interview.company_name ? ` at ${interview.company_name}` : ""
      }. 
      
      Difficulty level: ${interview.difficulty_level}
      
      Include a mix of:
      - Technical questions (40%)
      - Behavioral questions (30%) 
      - Situational questions (20%)
      - Company-specific questions (10%)
      
      Make questions realistic and relevant to the role. For technical questions, focus on skills commonly required for ${interview.job_position}.
      
      For each question, provide:
      - A clear, well-structured question
      - The appropriate category and difficulty
      - Optional expected answer guidelines
      - Optional follow-up questions for deeper exploration`,
    })

    console.log(" Generated questions:", object.questions.length)

    // Store questions in database
    const questionsToInsert = object.questions.map((q, index) => ({
      interview_id: interviewId,
      question_text: q.question,
      category: q.category,
      difficulty: q.difficulty,
      order_index: index,
      expected_answer: q.expectedAnswer,
      follow_up_questions: q.followUpQuestions || [],
    }))

    const { data: insertedQuestions, error: insertError } = await supabase
      .from("interview_questions")
      .insert(questionsToInsert)
      .select()

    if (insertError) {
      console.error("[Error inserting questions:", insertError)
      return Response.json({ error: "Failed to save questions" }, { status: 500 })
    }

    // Update interview status
    await supabase.from("interviews").update({ status: "ready" }).eq("id", interviewId)

    console.log(" Questions saved successfully")
    return Response.json({
      questions:
        insertedQuestions?.map((q) => ({
          id: q.id,
          question: q.question_text,
          category: q.category,
          difficulty: q.difficulty,
        })) || [],
    })
  } catch (error) {
    console.error("Error generating questions:", error)
    return Response.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
