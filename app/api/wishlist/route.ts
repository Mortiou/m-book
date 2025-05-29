import { type NextRequest, NextResponse } from "next/server"

let mockWishlist: number[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  // In a real app, fetch from database based on userId
  return NextResponse.json({ wishlist: mockWishlist })
}

export async function POST(request: NextRequest) {
  try {
    const { bookId, userId } = await request.json()

    if (!mockWishlist.includes(bookId)) {
      mockWishlist.push(bookId)
    }

    return NextResponse.json({ success: true, wishlist: mockWishlist })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = Number.parseInt(searchParams.get("bookId") || "0")

    mockWishlist = mockWishlist.filter((id) => id !== bookId)

    return NextResponse.json({ success: true, wishlist: mockWishlist })
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
  }
}
