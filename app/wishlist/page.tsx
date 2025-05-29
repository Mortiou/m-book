"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2, Star, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist?userId=1")
      const data = await response.json()

      // Mock wishlist items for demo
      const mockItems = [
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
          description: "Learn the secrets of successful digital marketing campaigns.",
          discount: 17,
          addedDate: "2024-01-20",
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
          description: "Dive deep into artificial intelligence and machine learning.",
          discount: 20,
          addedDate: "2024-01-18",
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
          description: "Unlock your creative potential with proven writing techniques.",
          discount: 20,
          addedDate: "2024-01-15",
        },
      ]

      setWishlistItems(mockItems)
    } catch (error) {
      console.error("Failed to fetch wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (bookId: number) => {
    try {
      await fetch(`/api/wishlist?bookId=${bookId}`, { method: "DELETE" })
      setWishlistItems((prev) => prev.filter((item: any) => item.id !== bookId))
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
    }
  }

  const addToCart = (bookId: number) => {
    // Add to cart logic
    console.log("Adding to cart:", bookId)
  }

  const shareWishlist = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My EbookHub Wishlist",
          text: "Check out my wishlist on EbookHub",
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Wishlist link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27AE60] mx-auto mb-4"></div>
          <p>Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Wishlist</h1>
            <p className="text-[#b2becd]">{wishlistItems.length} books saved for later</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={shareWishlist}
              variant="outline"
              className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Wishlist
            </Button>
            <Link href="/">
              <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {wishlistItems.length === 0 ? (
          <Card className="bg-[#2a2e35] border-[#454e56] text-center py-12">
            <CardContent>
              <Heart className="w-16 h-16 text-[#454e56] mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-[#b2becd] mb-6">Save books you're interested in to your wishlist</p>
              <Link href="/search">
                <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">Browse Books</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {wishlistItems.map((book: any) => (
              <Card key={book.id} className="bg-[#2a2e35] border-[#454e56] hover:border-[#27AE60] transition-colors">
                <CardContent className="p-6">
                  <div className="flex space-x-6">
                    <Link href={`/book/${book.id}`}>
                      <div className="relative">
                        <Image
                          src={book.cover || "/placeholder.svg"}
                          alt={book.title}
                          width={120}
                          height={160}
                          className="rounded"
                        />
                        {book.discount > 0 && (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                            -{book.discount}%
                          </Badge>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 space-y-3">
                      <div>
                        <Link href={`/book/${book.id}`}>
                          <h3 className="text-xl font-semibold hover:text-[#27AE60] transition-colors">{book.title}</h3>
                        </Link>
                        <p className="text-[#b2becd]">by {book.author}</p>
                      </div>

                      <p className="text-[#b2becd] line-clamp-2">{book.description}</p>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= book.rating ? "fill-yellow-400 text-yellow-400" : "text-[#454e56]"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-[#b2becd]">({book.reviewCount})</span>
                        </div>
                        <Badge variant="outline" className="border-[#454e56] text-[#b2becd]">
                          {book.category}
                        </Badge>
                        <span className="text-sm text-[#b2becd]">
                          Added {new Date(book.addedDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {book.originalPrice > book.price && (
                            <span className="text-lg text-[#b2becd] line-through">${book.originalPrice}</span>
                          )}
                          <span className="text-2xl font-bold text-[#27AE60]">${book.price}</span>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => addToCart(book.id)}
                            className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            onClick={() => removeFromWishlist(book.id)}
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
