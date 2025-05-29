import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const users: any[] = []

function getUserFromToken(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    return users.find((u) => u.id === decoded.userId)
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const user = getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profile: user.profile,
      preferences: user.preferences,
      stats: user.stats,
      subscription: user.subscription,
    },
  })
}

export async function PUT(request: NextRequest) {
  const user = getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const updates = await request.json()

    // Update user data
    Object.assign(user, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profile: user.profile,
        preferences: user.preferences,
        stats: user.stats,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
