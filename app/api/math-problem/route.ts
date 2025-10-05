import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../../../lib/supabaseClient'

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

// GET endpoint for generate problem
export async function GET(request: NextRequest) {
  try {
    // Check if Google API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      )
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Create a prompt for generating math word problems
    const prompt = `Generate a math word problem suitable for elementary to middle school students. The problem should:
        1. Generate math word problems suitable for Primary 5 students
        2. Be a word problem with a clear scenario
        3. Require basic arithmetic (addition, subtraction, multiplication, or division)
        4. Have a single numerical answer
        5. Be engaging and age-appropriate

        Return your response as a JSON object with exactly this format:
        {
        "problem_text": "The word problem text here",
        "final_answer": [numeric answer]
        }

        Example:
        {
        "problem_text": "A bakery sold 45 cupcakes in the morning and 23 cupcakes in the afternoon. How many cupcakes did they sell in total?",
        "final_answer": 68
        }

    Generate a new, unique math word problem now:`

    // Generate the math problem using Gemini
    const { response } = await model.generateContent(prompt)
    const text = response.text()

    // Parse the JSON response from Gemini
    let problemData:any
    
    try {
      // Clean up the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      problemData = JSON.parse(jsonMatch[0])
    } catch (parseError) {
     
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    // Validate the response structure
    if (!problemData.problem_text || typeof problemData.final_answer !== 'number') {
      return NextResponse.json(
        { error: 'Invalid problem data from AI' },
        { status: 500 }
      )
    }

    // Save the problem to the database
    const { data: sessionData, error: dbError } = await supabase
      .from('math_problem_sessions')
      .insert({
        problem_text: problemData.problem_text,
        correct_answer: problemData.final_answer
      })
      .select()
      .single()

    if (dbError) {
      
      return NextResponse.json(
        { error: 'Failed to save problem to database' },
        { status: 500 }
      )
    }

    // Return the problem and session ID
    return NextResponse.json({
      success: true,
      session_id: sessionData.id,
      problem_text: problemData.problem_text,
      final_answer: problemData.final_answer
    })

  } catch (error) {
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST endpoint for submitting answers
export async function POST(request: NextRequest) {
  try {
    // Check if Google API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { session_id, user_answer } = body

    // Validate required fields
    if (!session_id || user_answer === undefined || user_answer === null) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id and user_answer' },
        { status: 400 }
      )
    }

    // Validate user_answer is a number
    const numericAnswer = Number(user_answer)
    if (isNaN(numericAnswer)) {
      return NextResponse.json(
        { error: 'user_answer must be a valid number' },
        { status: 400 }
      )
    }

    // Get the original problem from the database
    const { data: sessionData, error: sessionError } = await supabase
      .from('math_problem_sessions')
      .select('*')
      .eq('id', session_id)
      .single()

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check if the answer is correct
    const isCorrect = numericAnswer === sessionData.correct_answer
    
    // Get the Gemini model for generating feedback
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Create a prompt for generating personalized feedback
    const feedbackPrompt = `You are a helpful math tutor. Generate personalized feedback for a student based on the following information:

    Original Problem: "${sessionData.problem_text}"
    Correct Answer: ${sessionData.correct_answer}
    Student's Answer: ${numericAnswer}
    Is Correct: ${isCorrect}

    Generate encouraging and educational feedback that:
    1. Acknowledges the student's effort
    2. If correct: Celebrates their success and reinforces the concept
    3. If incorrect: Gently explains the mistake and provides guidance on how to solve it correctly
    4. Is age-appropriate for Primary 5 students
    5. Is encouraging and supportive
    6. Keeps the feedback concise (2-3 sentences)

    Return only the feedback text, no additional formatting or explanations.`

    // Generate feedback using Gemini
    const feedbackResult = await model.generateContent(feedbackPrompt)
    const feedbackResponse = await feedbackResult.response
    const feedbackText = feedbackResponse.text().trim()

    // Save the submission to the database
    const { data: _, error: submissionError } = await supabase
      .from('math_problem_submissions')
      .insert({
        session_id: session_id,
        user_answer: numericAnswer,
        is_correct: isCorrect,
        feedback_text: feedbackText
      })
      .select()
      .single()

    if (submissionError) {
      
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      )
    }

    // Return the feedback and correctness
    return NextResponse.json({
      success: true,
      is_correct: isCorrect,
      feedback: feedbackText,
      correct_answer: sessionData.correct_answer,
      user_answer: numericAnswer
    })

  } catch (error) {
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
