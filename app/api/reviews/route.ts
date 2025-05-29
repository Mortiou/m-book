import { type NextRequest, NextResponse } from "next/server"

const mockReviews = [
  {
    id: 1,
    bookId: 1,
    userId: 1,
    userName: "John Doe",
    rating: 5,
    comment: "Excellent book! Very comprehensive and well-written.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: 2,
    bookId: 1,
    userId: 2,
    userName: "Jane Smith",
    rating: 4,
    comment: "Great content, helped me a lot with my web development skills.",
    date: "2024-01-10",
    verified: true,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get("bookId")

  if (bookId) {
    const bookReviews = mockReviews.filter((review) => review.bookId === Number.parseInt(bookId))
    return NextResponse.json({ reviews: bookReviews })
  }

  return NextResponse.json({ reviews: mockReviews })
}

export async function POST(request: NextRequest) {
  try {
    const { bookId, userId, userName, rating, comment } = await request.json()

    const newReview = {
      id: Date.now(),
      bookId: Number.parseInt(bookId),
      userId: Number.parseInt(userId),
      userName,
      rating: Number.parseInt(rating),
      comment,
      date: new Date().toISOString().split("T")[0],
      verified: true,
    }

    mockReviews.push(newReview)

    return NextResponse.json({ review: newReview })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
