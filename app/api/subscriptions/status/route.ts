import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  // Mock subscription status
  const mockSubscription = {
    id: "sub_1234567890",
    userId,
    planId: "premium_monthly",
    planName: "Premium Monthly",
    status: "active",
    currentPeriodStart: "2024-01-01T00:00:00Z",
    currentPeriodEnd: "2024-02-01T00:00:00Z",
    trialEnd: "2024-01-15T00:00:00Z",
    cancelAtPeriodEnd: false,
    isTrialing: new Date() < new Date("2024-01-15T00:00:00Z"),
    daysUntilRenewal: Math.ceil(
      (new Date("2024-02-01T00:00:00Z").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    ),
    usage: {
      downloadsThisMonth: 7,
      downloadLimit: null, // unlimited for premium
      booksRead: 23,
      readingTime: "45h 32m",
    },
    benefits: ["Unlimited ebook access", "Unlimited downloads", "Premium audiobooks", "Priority support"],
  }

  return NextResponse.json({ subscription: mockSubscription })
}

export async function PUT(request: NextRequest) {
  try {
    const { action, userId } = await request.json()

    switch (action) {
      case "cancel":
        return NextResponse.json({
          success: true,
          message: "Subscription will be canceled at the end of the current period",
        })

      case "reactivate":
        return NextResponse.json({
          success: true,
          message: "Subscription reactivated successfully",
        })

      case "change_plan":
        const { newPlanId } = await request.json()
        return NextResponse.json({
          success: true,
          message: `Plan changed to ${newPlanId}`,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Action failed" }, { status: 500 })
  }
}
