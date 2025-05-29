"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Star, ShoppingCart, Heart, Grid, List, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Search filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "relevance")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)

  const categories = [
    "All",
    "Programming",
    "Business",
    "Technology",
    "Writing",
    "Design",
    "Marketing",
    "Science",
    "Fiction",
    "Non-Fiction",
  ]

  const formats = ["PDF", "EPUB", "MOBI", "AUDIOBOOK"]

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "bestseller", label: "Best Sellers" },
  ]

  const searchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        category: category === "all" ? "" : category,
        sortBy,
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
        rating: minRating.toString(),
        page: currentPage.toString(),
        limit: "12",
      })

      if (selectedFormats.length > 0) {
        params.append("format", selectedFormats[0])
      }

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      setBooks(data.books || [])
      setTotalResults(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, category, sortBy, priceRange, selectedFormats, minRating, currentPage])

  useEffect(() => {
    searchBooks()
  }, [searchBooks])

  const updateURL = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (category !== "all") params.set("category", category)
    if (sortBy !== "relevance") params.set("sortBy", sortBy)

    router.push(`/search?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    updateURL()
    searchBooks()
  }

  const clearFilters = () => {
    setCategory("all")
    setSortBy("relevance")
    setPriceRange([0, 100])
    setSelectedFormats([])
    setMinRating(0)
    setCurrentPage(1)
  }

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) => (prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]))
  }

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={category === cat.toLowerCase()}
                onCheckedChange={() => setCategory(cat.toLowerCase())}
              />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={5} className="w-full" />
          <div className="flex justify-between text-sm text-[#b2becd]">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Format Filter */}
      <div>
        <h3 className="font-semibold mb-3">Format</h3>
        <div className="space-y-2">
          {formats.map((format) => (
            <label key={format} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox checked={selectedFormats.includes(format)} onCheckedChange={() => toggleFormat(format)} />
              <span className="text-sm">{format}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-semibold mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={minRating === rating}
                onCheckedChange={() => setMinRating(minRating === rating ? 0 : rating)}
              />
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-[#454e56]"}`}
                  />
                ))}
                <span className="text-sm">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Button
        onClick={clearFilters}
        variant="outline"
        className="w-full border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
      >
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold mb-6">
            <span className="text-[#27AE60]">EbookHub</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b2becd]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for ebooks, authors, topics..."
                className="pl-10 py-3 bg-[#454e56] border-[#6c7983] text-white placeholder-[#b2becd]"
              />
            </div>
            <Button type="submit" className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white px-8">
              Search
            </Button>
          </form>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80">
            <Card className="bg-[#2a2e35] border-[#454e56] sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterPanel />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "All Books"}
                </h1>
                <p className="text-[#b2becd]">
                  {totalResults} {totalResults === 1 ? "book" : "books"} found
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="bg-[#2a2e35] border-[#454e56] text-white">
                    <SheetHeader>
                      <SheetTitle className="text-white">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterPanel />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-[#454e56] border-[#6c7983] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border border-[#454e56] rounded-lg overflow-hidden">
                  <Button
                    onClick={() => setViewMode("grid")}
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className={viewMode === "grid" ? "bg-[#27AE60] text-white" : "text-[#b2becd] hover:bg-[#454e56]"}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMode("list")}
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className={viewMode === "list" ? "bg-[#27AE60] text-white" : "text-[#b2becd] hover:bg-[#454e56]"}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(category !== "all" ||
              selectedFormats.length > 0 ||
              minRating > 0 ||
              priceRange[0] > 0 ||
              priceRange[1] < 100) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {category !== "all" && (
                  <Badge variant="secondary" className="bg-[#27AE60] text-white">
                    {category}
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setCategory("all")} />
                  </Badge>
                )}
                {selectedFormats.map((format) => (
                  <Badge key={format} variant="secondary" className="bg-[#27AE60] text-white">
                    {format}
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleFormat(format)} />
                  </Badge>
                ))}
                {minRating > 0 && (
                  <Badge variant="secondary" className="bg-[#27AE60] text-white">
                    {minRating}+ Stars
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setMinRating(0)} />
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 100) && (
                  <Badge variant="secondary" className="bg-[#27AE60] text-white">
                    ${priceRange[0]} - ${priceRange[1]}
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setPriceRange([0, 100])} />
                  </Badge>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27AE60]"></div>
              </div>
            )}

            {/* Results Grid/List */}
            {!loading && (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book: any) => (
                      <Card
                        key={book.id}
                        className="bg-[#2a2e35] border-[#454e56] hover:border-[#27AE60] transition-all duration-300 group"
                      >
                        <CardContent className="p-4">
                          <Link href={`/book/${book.id}`}>
                            <div className="relative mb-4">
                              <Image
                                src={book.cover || "/placeholder.svg"}
                                alt={book.title}
                                width={200}
                                height={280}
                                className="w-full h-48 object-cover rounded group-hover:scale-105 transition-transform duration-300"
                              />
                              {book.discount > 0 && (
                                <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                                  -{book.discount}%
                                </Badge>
                              )}
                              {book.bestseller && (
                                <Badge className="absolute top-2 left-2 bg-[#27AE60] text-white">Bestseller</Badge>
                              )}
                            </div>
                          </Link>

                          <div className="space-y-2">
                            <Link href={`/book/${book.id}`}>
                              <h3 className="font-semibold line-clamp-2 hover:text-[#27AE60] transition-colors">
                                {book.title}
                              </h3>
                            </Link>
                            <p className="text-[#b2becd] text-sm">by {book.author}</p>

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

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {book.originalPrice > book.price && (
                                  <span className="text-sm text-[#b2becd] line-through">${book.originalPrice}</span>
                                )}
                                <span className="text-lg font-bold text-[#27AE60]">${book.price}</span>
                              </div>
                              <Badge variant="outline" className="border-[#454e56] text-[#b2becd]">
                                {book.category}
                              </Badge>
                            </div>

                            <div className="flex space-x-2 pt-2">
                              <Button className="flex-1 bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Add to Cart
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {books.map((book: any) => (
                      <Card
                        key={book.id}
                        className="bg-[#2a2e35] border-[#454e56] hover:border-[#27AE60] transition-colors"
                      >
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
                                  <h3 className="text-xl font-semibold hover:text-[#27AE60] transition-colors">
                                    {book.title}
                                  </h3>
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
                                <div className="flex space-x-1">
                                  {book.format.map((fmt: string) => (
                                    <Badge key={fmt} variant="secondary" className="text-xs">
                                      {fmt}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {book.originalPrice > book.price && (
                                    <span className="text-lg text-[#b2becd] line-through">${book.originalPrice}</span>
                                  )}
                                  <span className="text-2xl font-bold text-[#27AE60]">${book.price}</span>
                                </div>

                                <div className="flex space-x-2">
                                  <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add to Cart
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                                  >
                                    <Heart className="w-4 h-4" />
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <Button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                    >
                      Previous
                    </Button>

                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                      return (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          className={
                            currentPage === page
                              ? "bg-[#27AE60] text-white"
                              : "border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                          }
                        >
                          {page}
                        </Button>
                      )
                    })}

                    <Button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                    >
                      Next
                    </Button>
                  </div>
                )}

                {/* No Results */}
                {!loading && books.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-2xl font-bold mb-2">No books found</h2>
                    <p className="text-[#b2becd] mb-6">Try adjusting your search criteria or browse our categories</p>
                    <Button onClick={clearFilters} className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
