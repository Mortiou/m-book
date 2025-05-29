"use client"

import { useState } from "react"
import Image from "next/image"
import { Book, Download, Star, Calendar, User, Settings, LogOut, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const purchasedBooks = [
  {
    id: 1,
    title: "The Art of Web Development",
    author: "John Smith",
    purchaseDate: "2024-01-15",
    downloadCount: 3,
    cover: "/placeholder.svg?height=200&width=150",
    rating: 4.8,
    progress: 75,
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    author: "Sarah Johnson",
    purchaseDate: "2024-01-10",
    downloadCount: 1,
    cover: "/placeholder.svg?height=200&width=150",
    rating: 4.6,
    progress: 45,
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("library")

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, John!</h1>
              <p className="text-[#b2becd]">Manage your digital library</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#2a2e35] border border-[#454e56]">
            <TabsTrigger value="library" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              <Book className="w-4 h-4 mr-2" />
              My Library
            </TabsTrigger>
            <TabsTrigger value="downloads" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              <Download className="w-4 h-4 mr-2" />
              Downloads
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Purchase History
            </TabsTrigger>
          </TabsList>

          {/* My Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {purchasedBooks.map((book) => (
                <Card
                  key={book.id}
                  className="bg-[#2a2e35] border-[#454e56] hover:border-[#27AE60] transition-all duration-300"
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <Image
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        width={150}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-[#27AE60] text-white">{book.progress}% Read</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className="text-[#b2becd] mb-3">by {book.author}</CardDescription>
                    <div className="flex items-center space-x-1 mb-4">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{book.rating}</span>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">
                        <Book className="w-4 h-4 mr-2" />
                        Read Now
                      </Button>
                      <Button variant="outline" className="w-full border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Download History</CardTitle>
                <CardDescription className="text-[#b2becd]">
                  Track your ebook downloads and manage your files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchasedBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 bg-[#454e56] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={book.cover || "/placeholder.svg"}
                          alt={book.title}
                          width={60}
                          height={80}
                          className="rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{book.title}</h3>
                          <p className="text-[#b2becd] text-sm">by {book.author}</p>
                          <p className="text-[#b2becd] text-xs">Downloaded {book.downloadCount} times</p>
                        </div>
                      </div>
                      <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchase History Tab */}
          <TabsContent value="purchases" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription className="text-[#b2becd]">View all your ebook purchases and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchasedBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 bg-[#454e56] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={book.cover || "/placeholder.svg"}
                          alt={book.title}
                          width={60}
                          height={80}
                          className="rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{book.title}</h3>
                          <p className="text-[#b2becd] text-sm">by {book.author}</p>
                          <div className="flex items-center space-x-2 text-xs text-[#b2becd]">
                            <Calendar className="w-3 h-3" />
                            <span>Purchased on {book.purchaseDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#27AE60]">$29.99</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56] mt-2"
                        >
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
