import { type NextRequest, NextResponse } from "next/server"

const audiobooks = [
  {
    id: 1,
    bookId: 1,
    title: "The Art of Web Development",
    author: "John Smith",
    narrator: "Alex Johnson",
    duration: "12h 30m",
    durationSeconds: 45000,
    chapters: [
      { id: 1, title: "Introduction", startTime: 0, duration: 1800 },
      { id: 2, title: "HTML Fundamentals", startTime: 1800, duration: 3600 },
      { id: 3, title: "CSS Styling", startTime: 5400, duration: 4200 },
    ],
    audioUrl: "/audio/web-development.mp3",
    cover: "/placeholder.svg?height=300&width=200",
    sampleUrl: "/audio/web-development-sample.mp3",
    bitrate: "128kbps",
    format: "MP3",
    size: "156 MB",
    language: "English",
    releaseDate: "2024-01-15",
    rating: 4.8,
    reviewCount: 89,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get("bookId")
  const narrator = searchParams.get("narrator")
  const duration = searchParams.get("duration") // short, medium, long
  const language = searchParams.get("language")

  let filtered = audiobooks

  if (bookId) {
    filtered = filtered.filter((a) => a.bookId === Number.parseInt(bookId))
  }

  if (narrator) {
    filtered = filtered.filter((a) => a.narrator.toLowerCase().includes(narrator.toLowerCase()))
  }

  if (duration) {
    filtered = filtered.filter((a) => {
      const hours = a.durationSeconds / 3600
      switch (duration) {
        case "short":
          return hours <= 5
        case "medium":
          return hours > 5 && hours <= 12
        case "long":
          return hours > 12
        default:
          return true
      }
    })
  }

  if (language) {
    filtered = filtered.filter((a) => a.language === language)
  }

  return NextResponse.json({ audiobooks: filtered })
}
