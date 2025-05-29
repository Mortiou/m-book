import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Mock database - replace with real database
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const expiresIn = rememberMe ? "30d" : "7d"
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn,
    })

    // Update last login
    user.lastLogin = new Date().toISOString()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        preferences: user.preferences,
        profile: user.profile,
        stats: user.stats,
      },
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
