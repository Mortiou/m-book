import { NextResponse } from "next/server"

export async function GET() {
  // Mock subscription analytics
  const analytics = {
    overview: {
      totalSubscribers: 2847,
      activeSubscribers: 2654,
      trialUsers: 193,
      churnRate: 3.2,
      monthlyRecurringRevenue: 45680,
      averageRevenuePerUser: 17.21,
      lifetimeValue: 186.45,
    },
    planDistribution: [
      { planId: "basic_monthly", name: "Basic Monthly", subscribers: 856, percentage: 30.1 },
      { planId: "premium_monthly", name: "Premium Monthly", subscribers: 1203, percentage: 42.3 },
      { planId: "basic_yearly", name: "Basic Yearly", subscribers: 312, percentage: 11.0 },
      { planId: "premium_yearly", name: "Premium Yearly", subscribers: 476, percentage: 16.7 },
    ],
    revenueByMonth: [
      { month: "Jan", revenue: 38450, subscribers: 2234 },
      { month: "Feb", revenue: 41230, subscribers: 2456 },
      { month: "Mar", revenue: 43890, subscribers: 2634 },
      { month: "Apr", revenue: 45680, subscribers: 2847 },
    ],
    churnAnalysis: {
      reasons: [
        { reason: "Too expensive", percentage: 35 },
        { reason: "Not enough content", percentage: 28 },
        { reason: "Technical issues", percentage: 15 },
        { reason: "Found alternative", percentage: 12 },
        { reason: "Other", percentage: 10 },
      ],
      byPlan: [
        { planId: "basic_monthly", churnRate: 4.2 },
        { planId: "premium_monthly", churnRate: 2.8 },
        { planId: "basic_yearly", churnRate: 1.9 },
        { planId: "premium_yearly", churnRate: 1.2 },
      ],
    },
    conversionRates: {
      trialToSubscription: 68.5,
      freeToTrial: 12.3,
      upgradeRate: 23.7,
    },
  }

  return NextResponse.json({ analytics })
}
