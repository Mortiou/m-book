"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Eye,
  Book,
  Calendar,
  Globe,
  FileText,
  User,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookReviews from "@/components/book-reviews"

interface BookPageProps {
  params: {
    id: string
  }
}

export default function BookPage({ params }: BookPageProps) {
  const [book, setBook] = useState<any>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState("PDF")
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookDetails()
    fetchRecommendations()
  }, [params.id])

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`/api/books/${params.id}`)
      const data = await response.json()
      setBook(data.book)
      if (data.book?.format?.length > 0) {
        setSelectedFormat(data.book.format[0])
      }
    } catch (error) {
      console.error("Failed to fetch book details:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`/api/recommendations?bookId=${params.id}&type=related`)
      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
    }
  }

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await fetch(`/api/wishlist?bookId=${params.id}`, { method: "DELETE" })
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId: Number.parseInt(params.id), userId: 1 }),
        })
      }
      setIsWishlisted(!isWishlisted)
    } catch (error) {
      console.error("Failed to update wishlist:", error)
    }
  }

  const shareBook = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Check out "${book.title}" by ${book.author}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27AE60] mx-auto mb-4"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
          <Link href="/">
            <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">Back to Store</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-[#b2becd] hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Store</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleWishlist}
              variant="outline"
              className={`border-[#454e56] ${
                isWishlisted ? "bg-red-500 text-white" : "text-[#b2becd] hover:bg-[#454e56]"
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-current" : ""}`} />
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </Button>
            <Button
              onClick={shareBook}
              variant="outline"
              className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Purchase */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Book Cover */}
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardContent className="p-6">
                  <div className="relative">
                    <Image
                      src={book.cover || "/placeholder.svg"}
                      alt={book.title}
                      width={300}
                      height={400}
                      className="w-full rounded-lg shadow-lg"
                    />
                    {book.discount > 0 && (
                      <Badge className="absolute top-4 right-4 bg-red-500 text-white">-{book.discount}%</Badge>
                    )}
                    {book.bestseller && (
                      <Badge className="absolute top-4 left-4 bg-[#27AE60] text-white">Bestseller</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Purchase Options */}
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      {book.originalPrice > book.price && (
                        <span className="text-lg text-[#b2becd] line-through">${book.originalPrice}</span>
                      )}
                      <span className="text-3xl font-bold text-[#27AE60]">${book.price}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= book.rating ? "fill-yellow-400 text-yellow-400" : "text-[#454e56]"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-[#b2becd]">({book.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Format Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      {book.format.map((format: string) => (
                        <Button
                          key={format}
                          onClick={() => setSelectedFormat(format)}
                          variant={selectedFormat === format ? "default" : "outline"}
                          className={
                            selectedFormat === format
                              ? "bg-[#27AE60] text-white"
                              : "border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                          }
                        >
                          {format}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white py-3">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="w-full border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                      <Eye className="w-5 h-5 mr-2" />
                      Preview ({book.preview?.pages} pages)
                    </Button>
                  </div>

                  <div className="text-center text-sm text-[#b2becd]">
                    <p>✓ Instant download after purchase</p>
                    <p>✓ 30-day money-back guarantee</p>
                    <p>✓ DRM-free files</p>
                  </div>
                </CardContent>
              </Card>

              {/* Book Info */}
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle className="text-lg">Book Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#27AE60]" />
                    <span className="text-sm">Author: {book.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#27AE60]" />
                    <span className="text-sm">Published: {book.publishDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#27AE60]" />
                    <span className="text-sm">Pages: {book.pages}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-[#27AE60]" />
                    <span className="text-sm">Language: {book.language}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Book className="w-4 h-4 text-[#27AE60]" />
                    <span className="text-sm">ISBN: {book.isbn}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Book Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Author */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-[#27AE60] text-white">{book.category}</Badge>
                {book.tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="border-[#454e56] text-[#b2becd]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
              <p className="text-xl text-[#b2becd] mb-4">by {book.author}</p>
              <p className="text-lg leading-relaxed text-[#b2becd]">{book.description}</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="space-y-6">
              <TabsList className="bg-[#2a2e35] border border-[#454e56]">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="contents"
                  className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white"
                >
                  Table of Contents
                </TabsTrigger>
                <TabsTrigger value="author" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
                  About Author
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white"
                >
                  Reviews ({book.reviewCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <Card className="bg-[#2a2e35] border-[#454e56]">
                  <CardContent className="p-6">
                    <div
                      className={`prose prose-invert max-w-none ${!showFullDescription ? "line-clamp-6" : ""}`}
                      dangerouslySetInnerHTML={{ __html: book.fullDescription }}
                    />
                    <Button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      variant="ghost"
                      className="mt-4 text-[#27AE60] hover:bg-[#27AE60]/10"
                    >
                      {showFullDescription ? (
                        <>
                          Show Less <ChevronUp className="w-4 h-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Read More <ChevronDown className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contents">
                <Card className="bg-[#2a2e35] border-[#454e56]">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {book.tableOfContents?.map((chapter: any) => (
                        <div
                          key={chapter.chapter}
                          className="flex justify-between items-center p-3 bg-[#454e56] rounded-lg"
                        >
                          <div>
                            <span className="font-medium">Chapter {chapter.chapter}</span>
                            <p className="text-[#b2becd]">{chapter.title}</p>
                          </div>
                          <span className="text-[#b2becd]">Page {chapter.page}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="author">
                <Card className="bg-[#2a2e35] border-[#454e56]">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-[#27AE60] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {book.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{book.author}</h3>
                        <p className="text-[#b2becd] leading-relaxed">{book.authorBio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <BookReviews bookId={book.id} isDarkMode={true} />
              </TabsContent>
            </Tabs>

            {/* Related Books */}
            {recommendations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((recBook: any) => (
                    <Card
                      key={recBook.id}
                      className="bg-[#2a2e35] border-[#454e56] hover:border-[#27AE60] transition-colors"
                    >
                      <CardContent className="p-4">
                        <Image
                          src={recBook.cover || "/placeholder.svg"}
                          alt={recBook.title}
                          width={150}
                          height={200}
                          className="w-full h-40 object-cover rounded mb-3"
                        />
                        <h3 className="font-semibold mb-1 line-clamp-2">{recBook.title}</h3>
                        <p className="text-[#b2becd] text-sm mb-2">by {recBook.author}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[#27AE60] font-bold">${recBook.price}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{recBook.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-[#b2becd] mt-2">{recBook.reason}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
