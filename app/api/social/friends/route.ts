import { type NextRequest, NextResponse } from "next/server"

const friendships: any[] = []
const users: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = Number.parseInt(searchParams.get("userId") || "1")
  const type = searchParams.get("type") || "friends" // friends, followers, following, suggestions

  switch (type) {
    case "friends":
      const friends = friendships
        .filter((f) => (f.userId === userId || f.friendId === userId) && f.status === "accepted")
        .map((f) => {
          const friendId = f.userId === userId ? f.friendId : f.userId
          return users.find((u) => u.id === friendId)
        })
        .filter(Boolean)

      return NextResponse.json({ friends })

    case "suggestions":
      // Mock friend suggestions based on reading preferences
      const suggestions = users
        .filter((u) => u.id !== userId)
        .slice(0, 10)
        .map((user) => ({
          ...user,
          mutualFriends: Math.floor(Math.random() * 5),
          commonBooks: Math.floor(Math.random() * 10),
          reason: "Similar reading interests",
        }))

      return NextResponse.json({ suggestions })

    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, friendId, action } = await request.json()

    switch (action) {
      case "send_request":
        friendships.push({
          id: Date.now(),
          userId,
          friendId,
          status: "pending",
          createdAt: new Date().toISOString(),
        })
        break

      case "accept_request":
        const friendship = friendships.find(
          (f) => f.userId === friendId && f.friendId === userId && f.status === "pending",
        )
        if (friendship) {
          friendship.status = "accepted"
          friendship.acceptedAt = new Date().toISOString()
        }
        break

      case "decline_request":
        const index = friendships.findIndex(
          (f) => f.userId === friendId && f.friendId === userId && f.status === "pending",
        )
        if (index > -1) {
          friendships.splice(index, 1)
        }
        break

      case "remove_friend":
        const removeIndex = friendships.findIndex(
          (f) =>
            ((f.userId === userId && f.friendId === friendId) || (f.userId === friendId && f.friendId === userId)) &&
            f.status === "accepted",
        )
        if (removeIndex > -1) {
          friendships.splice(removeIndex, 1)
        }
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Action failed" }, { status: 500 })
  }
}
