"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Edit, Trash2, Eye, Book, Users, DollarSign, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const books = [
  {
    id: 1,
    title: "The Art of Web Development",
    author: "John Smith",
    price: 29.99,
    sales: 156,
    status: "Published",
    cover: "/placeholder.svg?height=200&width=150",
    category: "Programming",
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    author: "Sarah Johnson",
    price: 24.99,
    sales: 89,
    status: "Published",
    cover: "/placeholder.svg?height=200&width=150",
    category: "Business",
  },
]

const stats = [
  { title: "Total Books", value: "1,234", icon: Book, color: "text-blue-500" },
  { title: "Active Users", value: "5,678", icon: Users, color: "text-green-500" },
  { title: "Total Revenue", value: "$45,678", icon: DollarSign, color: "text-yellow-500" },
  { title: "Downloads", value: "12,345", icon: Download, color: "text-purple-500" },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-[#b2becd]">Manage your ebook store</p>
          </div>
          <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Book
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#2a2e35] border border-[#454e56]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="books" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Books
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Users
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-[#2a2e35] border-[#454e56]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#b2becd] text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription className="text-[#b2becd]">Latest updates from your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New book published", book: "The Art of Web Development", time: "2 hours ago" },
                    { action: "Order completed", book: "Digital Marketing Mastery", time: "4 hours ago" },
                    { action: "User registered", book: "New user: john@example.com", time: "6 hours ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#454e56] rounded-lg">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-[#b2becd] text-sm">{activity.book}</p>
                      </div>
                      <span className="text-[#b2becd] text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Books Tab */}
          <TabsContent value="books" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#b2becd]" />
                <Input
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#2a2e35] border-[#454e56] text-white"
                />
              </div>
              <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </Button>
            </div>

            <Card className="bg-[#2a2e35] border-[#454e56]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#454e56]">
                    <TableHead className="text-[#b2becd]">Book</TableHead>
                    <TableHead className="text-[#b2becd]">Author</TableHead>
                    <TableHead className="text-[#b2becd]">Price</TableHead>
                    <TableHead className="text-[#b2becd]">Sales</TableHead>
                    <TableHead className="text-[#b2becd]">Status</TableHead>
                    <TableHead className="text-[#b2becd]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id} className="border-[#454e56]">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Image
                            src={book.cover || "/placeholder.svg"}
                            alt={book.title}
                            width={40}
                            height={60}
                            className="rounded"
                          />
                          <div>
                            <p className="font-medium">{book.title}</p>
                            <p className="text-[#b2becd] text-sm">{book.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#b2becd]">{book.author}</TableCell>
                      <TableCell className="text-[#27AE60] font-semibold">${book.price}</TableCell>
                      <TableCell className="text-[#b2becd]">{book.sales}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{book.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription className="text-[#b2becd]">Manage registered users and their accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-[#454e56] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">User Management</h3>
                  <p className="text-[#b2becd]">User management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription className="text-[#b2becd]">Track and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-[#454e56] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Order Management</h3>
                  <p className="text-[#b2becd]">Order management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
