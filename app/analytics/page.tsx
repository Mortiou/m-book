"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, DollarSign, Users, Book, Download, Calendar, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const salesData = [
  { month: "Jan", revenue: 4500, sales: 89, downloads: 156 },
  { month: "Feb", revenue: 5200, sales: 102, downloads: 189 },
  { month: "Mar", revenue: 4800, sales: 95, downloads: 167 },
  { month: "Apr", revenue: 6100, sales: 121, downloads: 234 },
  { month: "May", revenue: 7300, sales: 145, downloads: 289 },
  { month: "Jun", revenue: 8200, sales: 163, downloads: 312 },
]

const topBooks = [
  { title: "The Art of Web Development", sales: 156, revenue: 4668 },
  { title: "Digital Marketing Mastery", sales: 89, revenue: 2223 },
  { title: "AI and Machine Learning", sales: 67, revenue: 2679 },
  { title: "Creative Writing Workshop", sales: 45, revenue: 899 },
  { title: "Business Strategy Guide", sales: 34, revenue: 1020 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")

  const totalRevenue = salesData.reduce((sum, month) => sum + month.revenue, 0)
  const totalSales = salesData.reduce((sum, month) => sum + month.sales, 0)
  const totalDownloads = salesData.reduce((sum, month) => sum + month.downloads, 0)
  const avgOrderValue = totalRevenue / totalSales

  const revenueGrowth = ((salesData[5].revenue - salesData[0].revenue) / salesData[0].revenue) * 100

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-[#b2becd]">Track your ebook store performance</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-[#454e56] border-[#6c7983] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">+{revenueGrowth.toFixed(1)}%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Total Sales</p>
                  <p className="text-2xl font-bold">{totalSales}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-blue-500 text-sm">+12.5%</span>
                  </div>
                </div>
                <Book className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Downloads</p>
                  <p className="text-2xl font-bold">{totalDownloads.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                    <span className="text-purple-500 text-sm">+18.2%</span>
                  </div>
                </div>
                <Download className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Avg Order Value</p>
                  <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-red-500 text-sm">-2.1%</span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#2a2e35] border border-[#454e56]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Sales
            </TabsTrigger>
            <TabsTrigger value="books" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Top Books
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Customers
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription className="text-[#b2becd]">Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end space-x-2">
                    {salesData.map((month, index) => (
                      <div key={month.month} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-[#27AE60] rounded-t"
                          style={{ height: `${(month.revenue / 8200) * 200}px` }}
                        />
                        <span className="text-xs text-[#b2becd] mt-2">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sales Chart */}
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Sales Volume</CardTitle>
                  <CardDescription className="text-[#b2becd]">Number of ebooks sold</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end space-x-2">
                    {salesData.map((month, index) => (
                      <div key={month.month} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-500 rounded-t"
                          style={{ height: `${(month.sales / 163) * 200}px` }}
                        />
                        <span className="text-xs text-[#b2becd] mt-2">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription className="text-[#b2becd]">Detailed sales analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-4 bg-[#454e56] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Calendar className="w-5 h-5 text-[#27AE60]" />
                        <div>
                          <p className="font-medium">{month.month} 2024</p>
                          <p className="text-sm text-[#b2becd]">{month.sales} sales</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#27AE60]">${month.revenue.toLocaleString()}</p>
                        <p className="text-sm text-[#b2becd]">{month.downloads} downloads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Books Tab */}
          <TabsContent value="books" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Best Selling Books</CardTitle>
                <CardDescription className="text-[#b2becd]">Top performing ebooks by sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topBooks.map((book, index) => (
                    <div key={book.title} className="flex items-center justify-between p-4 bg-[#454e56] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-[#27AE60] rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-[#b2becd]">{book.sales} copies sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#27AE60]">${book.revenue.toLocaleString()}</p>
                        <p className="text-sm text-[#b2becd]">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
                <CardDescription className="text-[#b2becd]">Customer behavior and demographics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-[#27AE60] mx-auto mb-2" />
                    <p className="text-2xl font-bold">2,847</p>
                    <p className="text-[#b2becd]">Total Customers</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">68%</p>
                    <p className="text-[#b2becd]">Returning Customers</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">$47.50</p>
                    <p className="text-[#b2becd]">Customer Lifetime Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
