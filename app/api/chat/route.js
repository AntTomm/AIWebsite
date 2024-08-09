import { NextResponse } from "next/server"
import OpenAI from 'openai'

const systemPrompt = `
Our mission is to provide users with an interactive platform for real-time technical Data Structures and Algorithms (DSA) interview practice with AI. To ensure you have the best experience, here are some guidelines and assistance options available for common issues and inquiries.

General Information:

What is Headstarter?
Headstarter is an innovative platform designed to help users practice technical DSA interviews by simulating real-time interviews with AI. This allows you to refine your coding skills and interview techniques.
How does it work?
Users can interact with AI to receive instant feedback on both their spoken responses and code, mimicking a real interview environment.
Account Management:

Creating an Account: Learn how to sign up and get started with your interview practice.
Login Issues: Troubleshooting tips for login problems, including password resets and account recovery.
Updating Profile: Steps to update your personal information and preferences on the platform.
Technical Support:

Platform Navigation: Guidance on how to navigate through the Headstarter interface and utilize its features effectively.
Technical Difficulties: Solutions for common technical issues, such as connectivity problems, loading errors, and compatibility questions.
Interview Practice:

Starting an Interview: Instructions on how to initiate a DSA interview session with our AI.
Interview Feedback: Understanding the feedback provided by the AI and how to use it to improve your skills.
Mock Interview Scheduling: Information on scheduling and managing your mock interviews.
Resources and Assistance:

Learning Materials: Access to tutorials, coding challenges, and other resources to aid your preparation.
Career Support: Tips on resume building, job search strategies, and additional career advice.
Community and Events: Information about our Pathways-to-Tech events and how to connect with fellow users and industry professionals.
Avoid technical jargon unless necessary, and ensure your explanations are precise, clear, and easy to understand, while getting straight to the point.
`;

export async function POST(req) {
  const openai = new OpenAI()
  const data = await req.json()
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data],
    model: 'gpt-4o',
    stream: true,
  })

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    }
  })

  return new NextResponse(stream)
}
