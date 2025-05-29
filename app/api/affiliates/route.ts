import { type NextRequest, NextResponse } from "next/server"

const mockAffiliates = [
  {
    id: 1,
    name: "Tech Blogger",
    email: "blogger@example.com",
    code: "TECHBLOG20",
    commission: 20,
    totalSales: 1250.0,
    totalCommission: 250.0,
    status: "active",
    joinDate: "2024-01-01",
  },
  {
    id: 2,
    name: "Book Reviewer",
    email: "reviewer@example.com",
    code: "BOOKLOVER15",
    commission: 15,
    totalSales: 890.0,
    totalCommission: 133.5,
    status: "active",
    joinDate: "2024-01-15",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const affiliateId = searchParams.get("affiliateId")

  if (affiliateId) {
    const affiliate = mockAffiliates.find((a) => a.id === Number.parseInt(affiliateId))
    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 })
    }
    return NextResponse.json({ affiliate })
  }

  return NextResponse.json({ affiliates: mockAffiliates })
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, website } = await request.json()

    const newAffiliate = {
      id: Date.now(),
      name,
      email,
      website,
      code: generateAffiliateCode(name),
      commission: 15, // Default commission rate
      totalSales: 0,
      totalCommission: 0,
      status: "pending",
      joinDate: new Date().toISOString().split("T")[0],
    }

    mockAffiliates.push(newAffiliate)

    return NextResponse.json({ affiliate: newAffiliate })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create affiliate" }, { status: 500 })
  }
}

function generateAffiliateCode(name: string): string {
  const cleanName = name.replace(/[^a-zA-Z]/g, "").toUpperCase()
  const randomNum = Math.floor(Math.random() * 100)
  return `${cleanName.slice(0, 6)}${randomNum}`
}
