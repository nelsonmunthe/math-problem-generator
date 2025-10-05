'use client'
import "./globals.css";
import axios from 'axios'
import { useState } from 'react'

interface MathProblem {
  problem_text: string
  final_answer: number
}

export default function Home() {
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null);

  const generateProblem = async () => {
    // TODO: Implement problem generation logic
    // This should call your API route to generate a new problem
    // and save it to the database
    try {
      setIsLoading(true)
      setProblem(null)
      setFeedback(null)
      setSessionId(null)
      setIsCorrect(null)
      setUserAnswer('')
      setError(null)
      const response = await axios.get(`api/math-problem`);

      if(response.data.success) {
        setProblem(prev => {
          return{
            ...prev,
            problem_text: response.data.problem_text,
            final_answer: response.data.final_answer
          }
        })

        setIsLoading(false)
        setSessionId(response.data.session_id)
        setError(null)
      }
    
    } catch (error:any) {
      setError(error?.response?.statusText || "something went wrong")
      setIsLoading(false)
    }
  }

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement answer submission logic
    // This should call your API route to check the answer,
    // save the submission, and generate feedback
    try {
      setIsLoading(true)
      const response = await axios.post(`api/math-problem`, 
        {
          session_id: sessionId,
          user_answer: userAnswer
        }
      );
      
      if(response.data.success) {
        setIsLoading(false)
        setFeedback(response.data.feedback)
        setIsCorrect(response.data.is_correct)
        setError(null)
      }
    } catch (error:any) {
      setError(error?.response?.statusText || "something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            Math Problem Generator
          </h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="w-full max-w-md sm:max-w-lg">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <button
                onClick={generateProblem}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 text-sm sm:text-base hover:cursor-pointer"
              >
                {isLoading ? 'Generating...' : 'Generate New Problem'}
              </button>
            </div>
          </div>
        </div>

        {problem && (
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-gray-700 text-center">Problem:</h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed mb-4 sm:mb-6 text-center">
                  {problem.problem_text}
                </p>
                
                <form onSubmit={submitAnswer} className="space-y-4 gap-y-4">
                  <div className="flex gap-1">
                    <label htmlFor="answer" className="block text-sm sm:text-base font-medium text-gray-700 mb-2 text-center">
                      Your Answer:
                    </label>
                    <input
                      type="number"
                      id="answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter your answer"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!userAnswer || isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 text-sm sm:text-base hover:cursor-pointer"
                  >
                    Submit Answer
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {feedback && (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className={`rounded-lg shadow-lg p-4 sm:p-6 ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-gray-700 text-center">
                  {isCorrect ? '✅ Correct!' : '❌ Not quite right'}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed text-center">{feedback}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}