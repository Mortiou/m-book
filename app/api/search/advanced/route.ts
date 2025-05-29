import { type NextRequest, NextResponse } from "next/server"

const mockBooks = [
  {
    id: 1,
    title: "The Art of Web Development",
    author: "John Smith",
    price: 29.99,
    rating: 4.8,
    reviewCount: 156,
    cover: "/placeholder.svg?height=300&width=200",
    category: "Programming",
    tags: ["web development", "javascript", "react", "frontend"],
    description:
      "Master modern web development with this comprehensive guide covering HTML, CSS, JavaScript, and popular frameworks.",
    fullText: "This comprehensive guide covers everything from basic HTML to advanced React patterns...",
    publishDate: "2024-01-15",
    pages: 450,
    language: "English",
    isbn: "978-1234567890",
    publisher: "Tech Books Inc",
    series: "Web Development Mastery",
    seriesNumber: 1,
    audiobook: true,
    audioDuration: "12h 30m",
    narrator: "Alex Johnson",
  },
  // Add more books...
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""
  const searchType = searchParams.get("type") || "all" // all, title, author, content, isbn
  const language = searchParams.get("language")
  const publisher = searchParams.get("publisher")
  const series = searchParams.get("series")
  const hasAudiobook = searchParams.get("audiobook") === "true"
  const yearFrom = searchParams.get("yearFrom")
  const yearTo = searchParams.get("yearTo")
  const pageCount = searchParams.get("pageCount") // short, medium, long
  const sortBy = searchParams.get("sortBy") || "relevance"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "12")

  const filteredBooks = mockBooks.filter((book) => {
    // Text search based on type
    let matchesQuery = true
    if (query) {
      switch (searchType) {
        case "title":
          matchesQuery = book.title.toLowerCase().includes(query)
          break
        case "author":
          matchesQuery = book.author.toLowerCase().includes(query)
          break
        case "content":
          matchesQuery = book.fullText.toLowerCase().includes(query)
          break
        case "isbn":
          matchesQuery = book.isbn.includes(query)
          break
        default:
          matchesQuery =
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.description.toLowerCase().includes(query) ||
            book.tags.some((tag) => tag.toLowerCase().includes(query))
      }
    }

    // Advanced filters
    const matchesLanguage = !language || book.language === language
    const matchesPublisher = !publisher || book.publisher === publisher
    const matchesSeries = !series || book.series === series
    const matchesAudiobook = !hasAudiobook || book.audiobook === hasAudiobook

    // Year range filter
    const bookYear = new Date(book.publishDate).getFullYear()
    const matchesYearFrom = !yearFrom || bookYear >= Number.parseInt(yearFrom)
    const matchesYearTo = !yearTo || bookYear <= Number.parseInt(yearTo)

    // Page count filter
    let matchesPageCount = true
    if (pageCount) {
      switch (pageCount) {
        case "short":
          matchesPageCount = book.pages <= 200
          break
        case "medium":
          matchesPageCount = book.pages > 200 && book.pages <= 400
          break
        case "long":
          matchesPageCount = book.pages > 400
          break
      }
    }

    return (
      matchesQuery &&
      matchesLanguage &&
      matchesPublisher &&
      matchesSeries &&
      matchesAudiobook &&
      matchesYearFrom &&
      matchesYearTo &&
      matchesPageCount
    )
  })

  // Advanced sorting
  switch (sortBy) {
    case "relevance":
      // Score based on query match quality
      filteredBooks.sort((a, b) => {
        const aScore = calculateRelevanceScore(a, query)
        const bScore = calculateRelevanceScore(b, query)
        return bScore - aScore
      })
      break
    case "popularity":
      filteredBooks.sort((a, b) => b.reviewCount - a.reviewCount)
      break
    case "rating":
      filteredBooks.sort((a, b) => b.rating - a.rating)
      break
    case "newest":
      filteredBooks.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      break
    case "oldest":
      filteredBooks.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
      break
    case "price-low":
      filteredBooks.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredBooks.sort((a, b) => b.price - a.price)
      break
    case "pages-short":
      filteredBooks.sort((a, b) => a.pages - b.pages)
      break
    case "pages-long":
      filteredBooks.sort((a, b) => b.pages - a.pages)
      break
    case "title-az":
      filteredBooks.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "title-za":
      filteredBooks.sort((a, b) => b.title.localeCompare(a.title))
      break
    case "author-az":
      filteredBooks.sort((a, b) => a.author.localeCompare(b.author))
      break
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex)

  // Search suggestions
  const suggestions = generateSearchSuggestions(query, mockBooks)

  // Facets for filtering
  const facets = {
    languages: [...new Set(mockBooks.map((b) => b.language))],
    publishers: [...new Set(mockBooks.map((b) => b.publisher))],
    series: [...new Set(mockBooks.map((b) => b.series).filter(Boolean))],
    categories: [...new Set(mockBooks.map((b) => b.category))],
    years: [...new Set(mockBooks.map((b) => new Date(b.publishDate).getFullYear()))].sort((a, b) => b - a),
  }

  return NextResponse.json({
    books: paginatedBooks,
    total: filteredBooks.length,
    page,
    totalPages: Math.ceil(filteredBooks.length / limit),
    hasMore: endIndex < filteredBooks.length,
    suggestions,
    facets,
    searchTime: Math.random() * 100 + 50, // Mock search time in ms
  })
}

function calculateRelevanceScore(book: any, query: string): number {
  let score = 0
  const lowerQuery = query.toLowerCase()

  // Title match (highest weight)
  if (book.title.toLowerCase().includes(lowerQuery)) score += 10
  if (book.title.toLowerCase().startsWith(lowerQuery)) score += 5

  // Author match
  if (book.author.toLowerCase().includes(lowerQuery)) score += 8

  // Tag match
  if (book.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))) score += 6

  // Description match
  if (book.description.toLowerCase().includes(lowerQuery)) score += 4

  // Popularity boost
  score += (book.rating * book.reviewCount) / 1000

  return score
}

function generateSearchSuggestions(query: string, books: any[]): string[] {
  if (!query || query.length < 2) return []

  const suggestions = new Set<string>()
  const lowerQuery = query.toLowerCase()

  books.forEach((book) => {
    // Title suggestions
    if (book.title.toLowerCase().includes(lowerQuery)) {
      suggestions.add(book.title)
    }

    // Author suggestions
    if (book.author.toLowerCase().includes(lowerQuery)) {
      suggestions.add(book.author)
    }

    // Tag suggestions
    book.tags.forEach((tag: string) => {
      if (tag.toLowerCase().includes(lowerQuery)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, 5)
}
