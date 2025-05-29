import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const metric = searchParams.get("metric")
  const timeframe = searchParams.get("timeframe") || "30d"
  const segment = searchParams.get("segment")

  // Mock advanced analytics data
  const analytics = {
    userEngagement: {
      dailyActiveUsers: generateTimeSeriesData(30, 1000, 1500),
      sessionDuration: generateTimeSeriesData(30, 15, 25),
      pagesPerSession: generateTimeSeriesData(30, 3, 8),
      bounceRate: generateTimeSeriesData(30, 20, 40),
      retentionRates: {
        day1: 85,
        day7: 65,
        day30: 45,
        day90: 30,
      },
    },

    revenueAnalytics: {
      mrr: generateTimeSeriesData(12, 50000, 80000),
      arpu: generateTimeSeriesData(12, 25, 35),
      ltv: generateTimeSeriesData(12, 150, 250),
      churnRate: generateTimeSeriesData(12, 3, 8),
      conversionFunnel: {
        visitors: 10000,
        signups: 2500,
        trials: 1800,
        subscriptions: 900,
        conversions: {
          visitorToSignup: 25,
          signupToTrial: 72,
          trialToSubscription: 50,
        },
      },
    },

    contentAnalytics: {
      popularBooks: [
        { id: 1, title: "The Art of Web Development", views: 5420, downloads: 1230 },
        { id: 2, title: "Digital Marketing Mastery", views: 4890, downloads: 980 },
        { id: 3, title: "AI and Machine Learning", views: 4560, downloads: 1450 },
      ],
      categoryPerformance: [
        { category: "Programming", books: 45, avgRating: 4.6, totalSales: 12500 },
        { category: "Business", books: 32, avgRating: 4.4, totalSales: 8900 },
        { category: "Technology", books: 28, avgRating: 4.7, totalSales: 11200 },
      ],
      readingPatterns: {
        avgReadingTime: 45,
        completionRate: 68,
        favoriteReadingTimes: [
          { hour: 9, percentage: 15 },
          { hour: 13, percentage: 12 },
          { hour: 20, percentage: 25 },
          { hour: 22, percentage: 18 },
        ],
      },
    },

    userSegmentation: {
      bySubscription: [
        { segment: "Premium Yearly", users: 2500, revenue: 45000, avgBooks: 12 },
        { segment: "Premium Monthly", users: 1800, revenue: 28000, avgBooks: 8 },
        { segment: "Basic Yearly", users: 1200, revenue: 15000, avgBooks: 6 },
        { segment: "Basic Monthly", users: 900, revenue: 8000, avgBooks: 4 },
      ],
      byBehavior: [
        { segment: "Power Readers", users: 850, avgBooksPerMonth: 8, retention: 95 },
        { segment: "Regular Readers", users: 2400, avgBooksPerMonth: 3, retention: 78 },
        { segment: "Casual Readers", users: 1600, avgBooksPerMonth: 1, retention: 45 },
        { segment: "Inactive", users: 800, avgBooksPerMonth: 0, retention: 15 },
      ],
    },

    performanceMetrics: {
      pageLoadTimes: {
        homepage: 1.2,
        search: 0.8,
        bookDetails: 1.5,
        reader: 2.1,
      },
      errorRates: {
        total: 0.5,
        byPage: [
          { page: "/checkout", errorRate: 1.2 },
          { page: "/reader", errorRate: 0.8 },
          { page: "/search", errorRate: 0.3 },
        ],
      },
      uptime: 99.9,
    },
  }

  if (metric && analytics[metric as keyof typeof analytics]) {
    return NextResponse.json({ data: analytics[metric as keyof typeof analytics] })
  }

  return NextResponse.json({ analytics })
}

function generateTimeSeriesData(days: number, min: number, max: number) {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    value: Math.floor(Math.random() * (max - min) + min),
  }))
}
