"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Review {
  id: number
  bookId: number
  userId: number
  userName: string
  rating: number
  comment: string
  date: string
  verified: boolean
  helpful: number
}

interface BookReviewsProps {
  bookId: number
  isDarkMode?: boolean
}

export default function BookReviews({ bookId, isDarkMode = true }: BookReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [bookId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?bookId=${bookId}`)
      const data = await response.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    }
  }

  const submitReview = async () => {
    if (!newReview.comment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          userId: 1, // Mock user ID
          userName: "Current User",
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      })

      const data = await response.json()
      setReviews([data.review, ...reviews])
      setNewReview({ rating: 5, comment: "" })
      setShowReviewForm(false)
    } catch (error) {
      console.error("Failed to submit review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage:
      reviews.length > 0 ? (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100 : 0,
  }))

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className={`${isDarkMode ? "bg-[#2a2e35] border-[#454e56]" : "bg-white border-gray-200"}`}>
        <CardHeader>
          <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-[#27AE60] mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= averageRating
                        ? "fill-yellow-400 text-yellow-400"
                        : isDarkMode
                          ? "text-[#454e56]"
                          : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-sm ${isDarkMode ? "text-[#b2becd]" : "text-gray-600"}`}>
                Based on {reviews.length} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className={`text-sm w-8 ${isDarkMode ? "text-[#b2becd]" : "text-gray-600"}`}>{rating}★</span>
                  <div className={`flex-1 h-2 rounded-full ${isDarkMode ? "bg-[#454e56]" : "bg-gray-200"}`}>
                    <div className="h-full bg-[#27AE60] rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className={`text-sm w-8 ${isDarkMode ? "text-[#b2becd]" : "text-gray-600"}`}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Write a Review
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card className={`${isDarkMode ? "bg-[#2a2e35] border-[#454e56]" : "bg-white border-gray-200"}`}>
          <CardHeader>
            <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Write Your Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Rating Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : isDarkMode
                            ? "text-[#454e56]"
                            : "text-gray-300"
                      } hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Your Review
              </label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your thoughts about this ebook..."
                className={`${isDarkMode ? "bg-[#454e56] border-[#6c7983] text-white" : "bg-white border-gray-300"}`}
                rows={4}
              />
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={submitReview}
                disabled={isSubmitting || !newReview.comment.trim()}
                className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                onClick={() => setShowReviewForm(false)}
                variant="outline"
                className={`${isDarkMode ? "border-[#454e56] text-[#b2becd] hover:bg-[#454e56]" : "border-gray-300"}`}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className={`${isDarkMode ? "bg-[#2a2e35] border-[#454e56]" : "bg-white border-gray-200"}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback className="bg-[#27AE60] text-white">
                    {review.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {review.userName}
                    </h4>
                    {review.verified && (
                      <span className="text-xs bg-[#27AE60] text-white px-2 py-1 rounded">Verified Purchase</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : isDarkMode
                                ? "text-[#454e56]"
                                : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm ${isDarkMode ? "text-[#b2becd]" : "text-gray-600"}`}>{review.date}</span>
                  </div>
                  <p className={`mb-3 ${isDarkMode ? "text-[#b2becd]" : "text-gray-700"}`}>{review.comment}</p>
                  <div className="flex items-center space-x-4">
                    <button
                      className={`flex items-center space-x-1 text-sm ${isDarkMode ? "text-[#b2becd] hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpful || 0})</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card className={`${isDarkMode ? "bg-[#2a2e35] border-[#454e56]" : "bg-white border-gray-200"}`}>
          <CardContent className="p-8 text-center">
            <MessageCircle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-[#454e56]" : "text-gray-400"}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              No reviews yet
            </h3>
            <p className={`${isDarkMode ? "text-[#b2becd]" : "text-gray-600"}`}>Be the first to review this ebook!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
