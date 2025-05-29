import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

// Mock security monitoring
const securityLogs: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { event, details } = await request.json()
    const headersList = headers()

    const securityEvent = {
      id: Date.now(),
      event,
      details,
      timestamp: new Date().toISOString(),
      ip: headersList.get("x-forwarded-for") || "unknown",
      userAgent: headersList.get("user-agent") || "unknown",
      severity: getSeverity(event),
    }

    securityLogs.push(securityEvent)

    // In production, you would:
    // 1. Store in secure database
    // 2. Alert security team for high-severity events
    // 3. Implement rate limiting
    // 4. Block suspicious IPs

    if (securityEvent.severity === "high") {
      console.warn("High severity security event:", securityEvent)
    }

    return NextResponse.json({ success: true, eventId: securityEvent.id })
  } catch (error) {
    return NextResponse.json({ error: "Security logging failed" }, { status: 500 })
  }
}

export async function GET() {
  // Return recent security events (admin only)
  return NextResponse.json({
    events: securityLogs.slice(-50),
    summary: {
      total: securityLogs.length,
      highSeverity: securityLogs.filter((e) => e.severity === "high").length,
      mediumSeverity: securityLogs.filter((e) => e.severity === "medium").length,
      lowSeverity: securityLogs.filter((e) => e.severity === "low").length,
    },
  })
}

function getSeverity(event: string): "low" | "medium" | "high" {
  const highSeverityEvents = ["failed_login_attempt", "unauthorized_access", "data_breach"]
  const mediumSeverityEvents = ["suspicious_activity", "rate_limit_exceeded", "invalid_token"]

  if (highSeverityEvents.includes(event)) return "high"
  if (mediumSeverityEvents.includes(event)) return "medium"
  return "low"
}
