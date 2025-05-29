"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Download, Star, Book, User, Home, Search, Menu, Sun, Moon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import BookReviews from "@/components/book-reviews"

const featuredBooks = [
  {
    id: 1,
    title: "The Art of Web Development",
    author: "John Smith",
    price: 29.99,
    rating: 4.8,
    cover: "/placeholder.svg?height=300&width=200",
    category: "Programming",
    description: "Master modern web development with this comprehensive guide.",
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    author: "Sarah Johnson",
    price: 24.99,
    rating: 4.6,
    cover: "/placeholder.svg?height=300&width=200",
    category: "Business",
    description: "Learn the secrets of successful digital marketing campaigns.",
  },
  {
    id: 3,
    title: "AI and Machine Learning",
    author: "Dr. Michael Chen",
    price: 39.99,
    rating: 4.9,
    cover: "/placeholder.svg?height=300&width=200",
    category: "Technology",
    description: "Dive deep into artificial intelligence and machine learning.",
  },
  {
    id: 4,
    title: "Creative Writing Workshop",
    author: "Emma Wilson",
    price: 19.99,
    rating: 4.7,
    cover: "/placeholder.svg?height=300&width=200",
    category: "Writing",
    description: "Unlock your creative potential with proven writing techniques.",
  },
]

export default function EbookStore() {
  const [activeSection, setActiveSection] = useState("home")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [cartItems, setCartItems] = useState(0)
  const [selectedBook, setSelectedBook] = useState<any>(null)

  const addToCart = (bookId: number) => {
    setCartItems((prev) => prev + 1)
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${isDarkMode ? "bg-[#191d2b] text-white" : "bg-white text-[#454e56]"}`}
    >
      {/* Navigation Controls */}
      <div className="fixed right-[3%] top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-center space-y-4">
        {[
          { id: "home", icon: Home },
          { id: "catalog", icon: Book },
          { id: "about", icon: User },
          { id: "contact", icon: Menu },
        ].map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              activeSection === id
                ? "bg-[#27AE60] text-white"
                : `${isDarkMode ? "bg-[#454e56] text-[#b2becd]" : "bg-[#f8f8f8] text-[#454e56]"} hover:bg-[#27AE60] hover:text-white`
            }`}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-[5%] right-[3%] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-50 ${
          isDarkMode ? "bg-[#454e56] text-[#b2becd]" : "bg-[#f8f8f8] text-[#454e56]"
        } hover:transform hover:-translate-y-1`}
      >
        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      {/* Cart Button */}
      <button className="fixed top-[5%] left-[3%] w-16 h-16 rounded-full bg-[#27AE60] text-white flex items-center justify-center transition-all duration-300 shadow-lg z-50 hover:transform hover:-translate-y-1">
        <ShoppingCart className="w-6 h-6" />
        {cartItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {cartItems}
          </span>
        )}
      </button>

      {/* Home Section */}
      {activeSection === "home" && (
        <section className="min-h-screen flex items-center px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div
                  className={`absolute -left-8 top-0 w-2/3 h-full ${isDarkMode ? "bg-[#27AE60]" : "bg-[#f1a20d]"} -z-10`}
                  style={{ clipPath: "polygon(0 0, 46% 0, 79% 100%, 0% 100%)" }}
                ></div>
                <div className="relative">
                  <Image
                    src="/images/hero-avatar.png"
                    alt="Ebook Store"
                    width={400}
                    height={500}
                    className="rounded-lg filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold">
                Welcome to <span className="text-[#27AE60]">EbookHub</span>
                <br />
                Your Digital Library
              </h1>
              <p className="text-lg leading-relaxed opacity-90">
                Discover thousands of premium ebooks across all genres. From programming guides to creative writing,
                business strategies to personal development - find your next great read and download instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setActiveSection("catalog")}
                  className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300"
                >
                  Browse Catalog
                  <Book className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                    isDarkMode
                      ? "border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60] hover:text-white"
                      : "border-[#f1a20d] text-[#f1a20d] hover:bg-[#f1a20d] hover:text-white"
                  }`}
                >
                  Learn More
                  <Download className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Catalog Section */}
      {activeSection === "catalog" && (
        <section className="min-h-screen py-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-6xl font-bold mb-4">
                Our <span className="text-[#27AE60]">Catalog</span>
                <span
                  className={`absolute text-6xl lg:text-8xl font-black opacity-10 -z-10 ${isDarkMode ? "text-[#2a2e35]" : "text-[#f8f8f8]"}`}
                >
                  Books
                </span>
              </h2>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">
                Explore our curated collection of premium ebooks across various categories
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50" />
                <Input
                  placeholder="Search ebooks..."
                  className={`pl-10 py-3 rounded-full ${
                    isDarkMode
                      ? "bg-[#2a2e35] border-[#454e56] text-white"
                      : "bg-[#f8f8f8] border-[#dbe1e8] text-[#454e56]"
                  }`}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["All", "Programming", "Business", "Technology", "Writing"].map((category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className={`px-4 py-2 cursor-pointer transition-all duration-300 ${
                      isDarkMode
                        ? "border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60] hover:text-white"
                        : "border-[#f1a20d] text-[#f1a20d] hover:bg-[#f1a20d] hover:text-white"
                    }`}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Featured Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredBooks.map((book) => (
                <Card
                  key={book.id}
                  className={`group cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 ${
                    isDarkMode
                      ? "bg-[#2a2e35] border-[#454e56] hover:border-[#27AE60]"
                      : "bg-white border-[#dbe1e8] hover:border-[#f1a20d]"
                  } hover:shadow-xl`}
                  onClick={() => setSelectedBook(book)}
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        width={200}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-[#27AE60] text-white">{book.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-lg mb-2 line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className={`mb-3 ${isDarkMode ? "text-[#b2becd]" : "text-[#6c7983]"}`}>
                      by {book.author}
                    </CardDescription>
                    <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? "text-[#b2becd]" : "text-[#6c7983]"}`}>
                      {book.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                      <span className="text-2xl font-bold text-[#27AE60]">${book.price}</span>
                    </div>
                    <Button
                      onClick={() => addToCart(book.id)}
                      className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white rounded-full transition-all duration-300"
                    >
                      Add to Cart
                      <ShoppingCart className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {selectedBook && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div
                  className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg ${
                    isDarkMode ? "bg-[#2a2e35]" : "bg-white"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                      <Button
                        onClick={() => setSelectedBook(null)}
                        variant="outline"
                        className={isDarkMode ? "border-[#454e56] text-[#b2becd] hover:bg-[#454e56]" : ""}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <BookReviews bookId={selectedBook.id} isDarkMode={isDarkMode} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      {activeSection === "about" && (
        <section className="min-h-screen py-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-6xl font-bold mb-4 relative">
                About <span className="text-[#27AE60]">EbookHub</span>
                <span
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl lg:text-8xl font-black opacity-10 -z-10 ${isDarkMode ? "text-[#2a2e35]" : "text-[#f8f8f8]"}`}
                >
                  Our Story
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Content */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Your Digital Reading Destination</h3>
                <p className={`text-lg leading-relaxed ${isDarkMode ? "text-[#b2becd]" : "text-[#6c7983]"}`}>
                  EbookHub is more than just a digital bookstore. We're a community of readers, learners, and knowledge
                  seekers. Our mission is to make quality educational and entertainment content accessible to everyone,
                  anywhere, anytime.
                </p>
                <p className={`text-lg leading-relaxed ${isDarkMode ? "text-[#b2becd]" : "text-[#6c7983]"}`}>
                  With our secure payment system, instant downloads, and user-friendly interface, we've made it easier
                  than ever to build your personal digital library. Join thousands of satisfied readers who trust
                  EbookHub for their reading needs.
                </p>
                <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white px-8 py-3 rounded-full">
                  Join Our Community
                </Button>
              </div>

              {/* Right Side - Stats */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "10K+", label: "Happy Customers" },
                  { number: "5K+", label: "Ebooks Available" },
                  { number: "50+", label: "Categories" },
                  { number: "99%", label: "Satisfaction Rate" },
                ].map((stat, index) => (
                  <Card
                    key={index}
                    className={`text-center p-6 transition-all duration-300 hover:transform hover:-translate-y-2 ${
                      isDarkMode
                        ? "bg-[#2a2e35] border-[#454e56] hover:border-[#27AE60]"
                        : "bg-white border-[#dbe1e8] hover:border-[#f1a20d]"
                    }`}
                  >
                    <div className="text-3xl font-bold text-[#27AE60] mb-2">{stat.number}</div>
                    <div className={`text-sm ${isDarkMode ? "text-[#b2becd]" : "text-[#6c7983]"}`}>{stat.label}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {activeSection === "contact" && (
        <section className="min-h-screen py-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-6xl font-bold mb-4 relative">
                Contact <span className="text-[#27AE60]">Us</span>
                <span
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl lg:text-8xl font-black opacity-10 -z-10 ${isDarkMode ? "text-[#2a2e35]" : "text-[#f8f8f8]"}`}
                >
                  Get in Touch
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold">Get in touch with us</h3>
                <p className={`text-lg ${isDarkMode ? "text-[#b2becd]" : "text-[#6c7983]"}`}>
                  Have questions about our ebooks or need support? We're here to help you on your reading journey.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: "📧", label: "Email", value: "support@ebookhub.com" },
                    { icon: "📱", label: "Phone", value: "+1 (555) 123-4567" },
                    { icon: "📍", label: "Address", value: "123 Digital Street, Tech City, TC 12345" },
                    { icon: "🕒", label: "Hours", value: "24/7 Customer Support" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="text-2xl">{item.icon}</div>
                      <div>
                        <div className="font-semibold">{item.label}</div>
                        <div className={isDarkMode ? "text-[#b2becd]" : "text-[#6c7983]"}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <Card className={`p-8 ${isDarkMode ? "bg-[#2a2e35] border-[#454e56]" : "bg-white border-[#dbe1e8]"}`}>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name"
                      className={`${isDarkMode ? "bg-[#454e56] border-[#6c7983] text-white" : "bg-[#f8f8f8] border-[#dbe1e8]"}`}
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className={`${isDarkMode ? "bg-[#454e56] border-[#6c7983] text-white" : "bg-[#f8f8f8] border-[#dbe1e8]"}`}
                    />
                  </div>
                  <Input
                    placeholder="Subject"
                    className={`${isDarkMode ? "bg-[#454e56] border-[#6c7983] text-white" : "bg-[#f8f8f8] border-[#dbe1e8]"}`}
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={6}
                    className={`w-full p-3 rounded-lg border resize-none ${
                      isDarkMode
                        ? "bg-[#454e56] border-[#6c7983] text-white placeholder-[#b2becd]"
                        : "bg-[#f8f8f8] border-[#dbe1e8] text-[#454e56] placeholder-[#6c7983]"
                    }`}
                  />
                  <Button className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white py-3 rounded-full">
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
