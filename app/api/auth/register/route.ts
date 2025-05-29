import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Mock database - replace with real database
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, preferences } = await request.json()

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = {
      id: Date.now(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      preferences: preferences || {
        language: "en",
        currency: "USD",
        notifications: {
          email: true,
          push: true,
          marketing: false,
        },
        reading: {
          fontSize: 16,
          theme: "dark",
          autoBookmark: true,
        },
      },
      profile: {
        avatar: null,
        bio: "",
        location: "",
        website: "",
        socialLinks: {},
        readingGoals: {
          booksPerMonth: 2,
          minutesPerDay: 30,
        },
        privacy: {
          profilePublic: true,
          readingActivityPublic: false,
          reviewsPublic: true,
        },
      },
      stats: {
        booksRead: 0,
        totalReadingTime: 0,
        favoriteGenres: [],
        readingStreak: 0,
        joinDate: new Date().toISOString(),
      },
      subscription: null,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(user)

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "7d",
    })

    // Send verification email
    await fetch("/api/emails/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        template: "email_verification",
        data: {
          firstName,
          verificationLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`,
        },
      }),
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
