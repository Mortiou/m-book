import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const bookId = searchParams.get("bookId")
  const type = searchParams.get("type") || "personalized"

  // Mock recommendation engine
  const recommendations = [
    {
      id: 2,
      title: "Digital Marketing Mastery",
      author: "Sarah Johnson",
      price: 24.99,
      rating: 4.6,
      cover: "/placeholder.svg?height=300&width=200",
      reason: "Based on your interest in business books",
    },
    {
      id: 3,
      title: "AI and Machine Learning",
      author: "Dr. Michael Chen",
      price: 39.99,
      rating: 4.9,
      cover: "/placeholder.svg?height=300&width=200",
      reason: "Trending in Technology",
    },
    {
      id: 5,
      title: "Business Strategy Guide",
      author: "Robert Davis",
      price: 34.99,
      rating: 4.5,
      cover: "/placeholder.svg?height=300&width=200",
      reason: "Customers who bought this also bought",
    },
  ]

  return NextResponse.json({ recommendations })
}
