import { type NextRequest, NextResponse } from "next/server"

const mockBooks = [
  {
    id: 1,
    title: "The Art of Web Development",
    author: "John Smith",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.8,
    reviewCount: 156,
    cover: "/placeholder.svg?height=300&width=200",
    category: "Programming",
    tags: ["web development", "javascript", "react", "frontend"],
    description:
      "Master modern web development with this comprehensive guide covering HTML, CSS, JavaScript, and popular frameworks.",
    publishDate: "2024-01-15",
    pages: 450,
    language: "English",
    format: ["PDF", "EPUB"],
    isbn: "978-1234567890",
    bestseller: true,
    featured: true,
    discount: 25,
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    author: "Sarah Johnson",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.6,
    reviewCount: 89,
    cover: "/placeholder.svg?height=300&width=200",
    category: "Business",
    tags: ["marketing", "digital", "social media", "advertising"],
    description: "Learn the secrets of successful digital marketing campaigns and grow your business online.",
    publishDate: "2024-01-10",
    pages: 320,
    language: "English",
    format: ["PDF", "EPUB", "MOBI"],
    isbn: "978-1234567891",
    bestseller: false,
    featured: true,
    discount: 17,
  },
  {
    id: 3,
    title: "AI and Machine Learning",
    author: "Dr. Michael Chen",
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.9,
    reviewCount: 234,
    cover: "/placeholder.svg?height=300&width=200",
    category: "Technology",
    tags: ["ai", "machine learning", "python", "data science"],
    description:
      "Dive deep into artificial intelligence and machine learning with practical examples and real-world applications.",
    publishDate: "2024-01-05",
    pages: 580,
    language: "English",
    format: ["PDF", "EPUB"],
    isbn: "978-1234567892",
    bestseller: true,
    featured: false,
    discount: 20,
  },
  {
    id: 4,
    title: "Creative Writing Workshop",
    author: "Emma Wilson",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.7,
    reviewCount: 67,
    cover: "/placeholder.svg?height=300&width=200",
    category: "Writing",
    tags: ["creative writing", "storytelling", "fiction", "narrative"],
    description:
      "Unlock your creative potential with proven writing techniques and exercises from professional authors.",
    publishDate: "2023-12-20",
    pages: 280,
    language: "English",
    format: ["PDF", "EPUB", "MOBI"],
    isbn: "978-1234567893",
    bestseller: false,
    featured: false,
    discount: 20,
  },
  {
    id: 5,
    title: "Business Strategy Guide",
    author: "Robert Davis",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.5,
    reviewCount: 123,
    cover: "/placeholder.svg?height=300&width=200",
    category: "Business",
    tags: ["strategy", "management", "leadership", "entrepreneurship"],
    description: "Essential strategies for building and scaling successful businesses in the modern economy.",
    publishDate: "2023-12-15",
    pages: 420,
    language: "English",
    format: ["PDF", "EPUB"],
    isbn: "978-1234567894",
    bestseller: false,
    featured: true,
    discount: 22,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""
  const category = searchParams.get("category")
  const minPrice = Number.parseFloat(searchParams.get("minPrice") || "0")
  const maxPrice = Number.parseFloat(searchParams.get("maxPrice") || "1000")
  const sortBy = searchParams.get("sortBy") || "relevance"
  const format = searchParams.get("format")
  const rating = Number.parseFloat(searchParams.get("rating") || "0")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "12")

  const filteredBooks = mockBooks.filter((book) => {
    const matchesQuery =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query) ||
      book.tags.some((tag) => tag.toLowerCase().includes(query))

    const matchesCategory = !category || category === "all" || book.category.toLowerCase() === category.toLowerCase()
    const matchesPrice = book.price >= minPrice && book.price <= maxPrice
    const matchesFormat = !format || book.format.includes(format.toUpperCase())
    const matchesRating = book.rating >= rating

    return matchesQuery && matchesCategory && matchesPrice && matchesFormat && matchesRating
  })

  // Sort results
  switch (sortBy) {
    case "price-low":
      filteredBooks.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredBooks.sort((a, b) => b.price - a.price)
      break
    case "rating":
      filteredBooks.sort((a, b) => b.rating - a.rating)
      break
    case "newest":
      filteredBooks.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      break
    case "bestseller":
      filteredBooks.sort((a, b) => b.reviewCount - a.reviewCount)
      break
    default:
      // Relevance - prioritize exact matches, then bestsellers
      filteredBooks.sort((a, b) => {
        const aExact = a.title.toLowerCase().includes(query) ? 1 : 0
        const bExact = b.title.toLowerCase().includes(query) ? 1 : 0
        if (aExact !== bExact) return bExact - aExact
        return b.reviewCount - a.reviewCount
      })
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex)

  return NextResponse.json({
    books: paginatedBooks,
    total: filteredBooks.length,
    page,
    totalPages: Math.ceil(filteredBooks.length / limit),
    hasMore: endIndex < filteredBooks.length,
  })
}
