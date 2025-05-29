"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Settings, Bookmark, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReaderProps {
  params: {
    bookId: string
  }
}

export default function EbookReader({ params }: ReaderProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(250) // Mock total pages
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState("dark")
  const [showSettings, setShowSettings] = useState(false)
  const [showTOC, setShowTOC] = useState(false)
  const [bookmarks, setBookmarks] = useState<number[]>([])

  // Mock book content
  const bookContent = {
    title: "The Art of Web Development",
    author: "John Smith",
    chapters: [
      { id: 1, title: "Introduction to Web Development", page: 1 },
      { id: 2, title: "HTML Fundamentals", page: 15 },
      { id: 3, title: "CSS Styling", page: 45 },
      { id: 4, title: "JavaScript Basics", page: 85 },
      { id: 5, title: "React Framework", page: 125 },
      { id: 6, title: "Backend Development", page: 165 },
      { id: 7, title: "Database Integration", page: 195 },
      { id: 8, title: "Deployment", page: 225 },
    ],
  }

  const mockPageContent = `
    <h2>Chapter ${Math.ceil(currentPage / 30)}: Web Development Fundamentals</h2>
    <p>This is page ${currentPage} of the ebook. In this section, we'll explore the fundamental concepts of web development that every developer should know.</p>
    
    <p>Web development is a rapidly evolving field that combines creativity with technical expertise. Whether you're building a simple website or a complex web application, understanding the core principles is essential for success.</p>
    
    <h3>Key Concepts</h3>
    <ul>
      <li>HTML structure and semantics</li>
      <li>CSS styling and layout</li>
      <li>JavaScript interactivity</li>
      <li>Responsive design principles</li>
      <li>Performance optimization</li>
    </ul>
    
    <p>As we progress through this book, you'll gain hands-on experience with modern web development tools and frameworks. Each chapter builds upon the previous one, creating a comprehensive learning experience.</p>
    
    <blockquote>
      "The best way to learn web development is by building real projects and continuously practicing your skills."
    </blockquote>
    
    <p>Remember to take your time with each concept and don't hesitate to experiment with the code examples provided throughout this book.</p>
  `

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter((page) => page !== currentPage))
    } else {
      setBookmarks([...bookmarks, currentPage])
    }
  }

  const goToChapter = (page: number) => {
    setCurrentPage(page)
    setShowTOC(false)
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevPage()
      if (e.key === "ArrowRight") nextPage()
      if (e.key === "Escape") {
        setShowSettings(false)
        setShowTOC(false)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentPage])

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        theme === "dark" ? "bg-[#191d2b] text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b ${
          theme === "dark" ? "bg-[#2a2e35] border-[#454e56]" : "bg-gray-50 border-gray-200"
        } p-4`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className={theme === "dark" ? "border-[#454e56] text-[#b2becd] hover:bg-[#454e56]" : ""}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-semibold">{bookContent.title}</h1>
              <p className={`text-sm ${theme === "dark" ? "text-[#b2becd]" : "text-gray-600"}`}>
                by {bookContent.author}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowTOC(!showTOC)}
              className={theme === "dark" ? "border-[#454e56] text-[#b2becd] hover:bg-[#454e56]" : ""}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={toggleBookmark}
              className={`${bookmarks.includes(currentPage) ? "bg-[#27AE60] text-white" : ""} ${
                theme === "dark" ? "border-[#454e56] text-[#b2becd] hover:bg-[#454e56]" : ""
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className={theme === "dark" ? "border-[#454e56] text-[#b2becd] hover:bg-[#454e56]" : ""}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Table of Contents Sidebar */}
        {showTOC && (
          <div
            className={`w-80 border-r ${
              theme === "dark" ? "bg-[#2a2e35] border-[#454e56]" : "bg-gray-50 border-gray-200"
            } p-6 h-screen overflow-y-auto`}
          >
            <h3 className="font-semibold mb-4">Table of Contents</h3>
            <div className="space-y-2">
              {bookContent.chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => goToChapter(chapter.page)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentPage >= chapter.page && currentPage < (bookContent.chapters[chapter.id]?.page || totalPages)
                      ? "bg-[#27AE60] text-white"
                      : theme === "dark"
                        ? "hover:bg-[#454e56]"
                        : "hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium">{chapter.title}</div>
                  <div
                    className={`text-sm ${
                      currentPage >= chapter.page &&
                      currentPage < (bookContent.chapters[chapter.id]?.page || totalPages)
                        ? "text-white/80"
                        : theme === "dark"
                          ? "text-[#b2becd]"
                          : "text-gray-600"
                    }`}
                  >
                    Page {chapter.page}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Settings Panel */}
          {showSettings && (
            <div
              className={`border-b ${
                theme === "dark" ? "bg-[#2a2e35] border-[#454e56]" : "bg-gray-50 border-gray-200"
              } p-4`}
            >
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Font Size</label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm mt-1">{fontSize}px</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className={theme === "dark" ? "bg-[#454e56] border-[#6c7983]" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="sepia">Sepia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Progress</label>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages} ({Math.round((currentPage / totalPages) * 100)}%)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reading Area */}
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div
                className="prose prose-lg max-w-none"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.6,
                  color: theme === "dark" ? "white" : "black",
                }}
                dangerouslySetInnerHTML={{ __html: mockPageContent }}
              />
            </div>
          </div>

          {/* Navigation Footer */}
          <footer
            className={`border-t ${
              theme === "dark" ? "bg-[#2a2e35] border-[#454e56]" : "bg-gray-50 border-gray-200"
            } p-4`}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                variant="outline"
                className={theme === "dark" ? "border-[#454e56] text-[#b2becd] hover:bg-[#454e56]" : ""}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-4">
                <span className={`text-sm ${theme === "dark" ? "text-[#b2becd]" : "text-gray-600"}`}>
                  {currentPage} / {totalPages}
                </span>
                <div className="w-32">
                  <Slider
                    value={[currentPage]}
                    onValueChange={(value) => setCurrentPage(value[0])}
                    min={1}
                    max={totalPages}
                    step={1}
                  />
                </div>
              </div>

              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                className={theme === "dark" ? "border-[#454e56] text-[#b2becd] hover:bg-[#454e56]" : ""}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
