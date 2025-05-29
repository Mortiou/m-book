import { type NextRequest, NextResponse } from "next/server"

const mockPromotions = [
  {
    id: 1,
    title: "New Year Sale",
    description: "Get 30% off on all programming books",
    discount: 30,
    code: "NEWYEAR30",
    validUntil: "2024-01-31",
    category: "Programming",
    active: true,
  },
  {
    id: 2,
    title: "Business Bundle",
    description: "Buy 2 business books, get 1 free",
    discount: 33,
    code: "BUSINESS3FOR2",
    validUntil: "2024-02-15",
    category: "Business",
    active: true,
  },
  {
    id: 3,
    title: "First Time Buyer",
    description: "15% off your first purchase",
    discount: 15,
    code: "WELCOME15",
    validUntil: "2024-12-31",
    category: "All",
    active: true,
  },
]

export async function GET() {
  return NextResponse.json({ promotions: mockPromotions.filter((p) => p.active) })
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    const promotion = mockPromotions.find((p) => p.code === code && p.active)

    if (!promotion) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 400 })
    }

    if (new Date() > new Date(promotion.validUntil)) {
      return NextResponse.json({ error: "Promo code expired" }, { status: 400 })
    }

    return NextResponse.json({ promotion })
  } catch (error) {
    return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 })
  }
}
