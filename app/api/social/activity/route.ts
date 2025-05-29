import { type NextRequest, NextResponse } from "next/server"

const activities: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = Number.parseInt(searchParams.get("userId") || "1")
  const type = searchParams.get("type") || "all" // all, reading, reviews, social
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  const filteredActivities = activities.filter((activity) => {
    if (type === "all") return true
    return activity.type === type
  })

  // Sort by date
  filteredActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Pagination
  const startIndex = (page - 1) * limit
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + limit)

  return NextResponse.json({
    activities: paginatedActivities,
    hasMore: startIndex + limit < filteredActivities.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, data } = await request.json()

    const activity = {
      id: Date.now(),
      userId,
      type, // reading_started, reading_finished, review_posted, book_liked, friend_added
      data,
      createdAt: new Date().toISOString(),
    }

    activities.push(activity)

    return NextResponse.json({ activity })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}
