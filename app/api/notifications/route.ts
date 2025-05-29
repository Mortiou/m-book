import { type NextRequest, NextResponse } from "next/server"

const notifications: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = Number.parseInt(searchParams.get("userId") || "1")
  const type = searchParams.get("type") // all, unread, system, social, marketing
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  let filtered = notifications.filter((n) => n.userId === userId)

  if (type && type !== "all") {
    if (type === "unread") {
      filtered = filtered.filter((n) => !n.read)
    } else {
      filtered = filtered.filter((n) => n.type === type)
    }
  }

  // Sort by date
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Pagination
  const startIndex = (page - 1) * limit
  const paginatedNotifications = filtered.slice(startIndex, startIndex + limit)

  const unreadCount = notifications.filter((n) => n.userId === userId && !n.read).length

  return NextResponse.json({
    notifications: paginatedNotifications,
    unreadCount,
    hasMore: startIndex + limit < filtered.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, title, message, data, channels } = await request.json()

    const notification = {
      id: Date.now(),
      userId,
      type, // system, social, marketing, reading, subscription
      title,
      message,
      data: data || {},
      channels: channels || ["in_app"], // in_app, email, push
      read: false,
      createdAt: new Date().toISOString(),
    }

    notifications.push(notification)

    // Send to different channels
    if (channels.includes("email")) {
      await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.email,
          template: "notification",
          data: { title, message },
        }),
      })
    }

    if (channels.includes("push")) {
      // Send push notification
      await sendPushNotification(userId, { title, message, data })
    }

    return NextResponse.json({ notification })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { notificationIds, action } = await request.json()

    if (action === "mark_read") {
      notificationIds.forEach((id: number) => {
        const notification = notifications.find((n) => n.id === id)
        if (notification) {
          notification.read = true
          notification.readAt = new Date().toISOString()
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}

async function sendPushNotification(userId: number, payload: any) {
  // Mock push notification implementation
  console.log(`Sending push notification to user ${userId}:`, payload)
}
