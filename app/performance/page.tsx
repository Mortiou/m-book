"use client"

import { useState, useEffect } from "react"
import { Activity, Zap, Clock, Users, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function PerformancePage() {
  const [metrics, setMetrics] = useState({
    pageLoadTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    activeUsers: 0,
    errorRate: 0,
    uptime: 99.9,
  })

  useEffect(() => {
    // Simulate real-time performance monitoring
    const interval = setInterval(() => {
      setMetrics({
        pageLoadTime: Math.random() * 2000 + 500, // 500-2500ms
        apiResponseTime: Math.random() * 200 + 50, // 50-250ms
        memoryUsage: Math.random() * 30 + 60, // 60-90%
        activeUsers: Math.floor(Math.random() * 100) + 50,
        errorRate: Math.random() * 2, // 0-2%
        uptime: 99.9 - Math.random() * 0.5, // 99.4-99.9%
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getPerformanceStatus = (metric: string, value: number) => {
    switch (metric) {
      case "pageLoadTime":
        if (value < 1000) return { status: "excellent", color: "bg-green-500" }
        if (value < 2000) return { status: "good", color: "bg-yellow-500" }
        return { status: "poor", color: "bg-red-500" }
      case "apiResponseTime":
        if (value < 100) return { status: "excellent", color: "bg-green-500" }
        if (value < 200) return { status: "good", color: "bg-yellow-500" }
        return { status: "poor", color: "bg-red-500" }
      case "memoryUsage":
        if (value < 70) return { status: "excellent", color: "bg-green-500" }
        if (value < 85) return { status: "good", color: "bg-yellow-500" }
        return { status: "poor", color: "bg-red-500" }
      case "errorRate":
        if (value < 1) return { status: "excellent", color: "bg-green-500" }
        if (value < 2) return { status: "good", color: "bg-yellow-500" }
        return { status: "poor", color: "bg-red-500" }
      default:
        return { status: "good", color: "bg-green-500" }
    }
  }

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Performance Monitoring</h1>
          <p className="text-[#b2becd]">Real-time application performance metrics</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Page Load Time</p>
                  <p className="text-2xl font-bold">{metrics.pageLoadTime.toFixed(0)}ms</p>
                  <Badge
                    className={`mt-2 ${getPerformanceStatus("pageLoadTime", metrics.pageLoadTime).color} text-white`}
                  >
                    {getPerformanceStatus("pageLoadTime", metrics.pageLoadTime).status}
                  </Badge>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">API Response Time</p>
                  <p className="text-2xl font-bold">{metrics.apiResponseTime.toFixed(0)}ms</p>
                  <Badge
                    className={`mt-2 ${getPerformanceStatus("apiResponseTime", metrics.apiResponseTime).color} text-white`}
                  >
                    {getPerformanceStatus("apiResponseTime", metrics.apiResponseTime).status}
                  </Badge>
                </div>
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Memory Usage</p>
                  <p className="text-2xl font-bold">{metrics.memoryUsage.toFixed(1)}%</p>
                  <Progress value={metrics.memoryUsage} className="mt-2" />
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Active Users</p>
                  <p className="text-2xl font-bold">{metrics.activeUsers}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">+12% from last hour</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Error Rate</p>
                  <p className="text-2xl font-bold">{metrics.errorRate.toFixed(2)}%</p>
                  <Badge className={`mt-2 ${getPerformanceStatus("errorRate", metrics.errorRate).color} text-white`}>
                    {getPerformanceStatus("errorRate", metrics.errorRate).status}
                  </Badge>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Uptime</p>
                  <p className="text-2xl font-bold">{metrics.uptime.toFixed(2)}%</p>
                  <p className="text-green-500 text-sm mt-2">Excellent</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Recommendations */}
        <Card className="bg-[#2a2e35] border-[#454e56]">
          <CardHeader>
            <CardTitle>Performance Recommendations</CardTitle>
            <CardDescription className="text-[#b2becd]">Suggestions to improve application performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-[#454e56] rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">Optimize Image Loading</h4>
                  <p className="text-[#b2becd] text-sm">
                    Consider implementing lazy loading for book cover images to improve page load times.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-[#454e56] rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">Enable Caching</h4>
                  <p className="text-[#b2becd] text-sm">
                    Implement Redis caching for frequently accessed book data and search results.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-[#454e56] rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold">Database Optimization</h4>
                  <p className="text-[#b2becd] text-sm">
                    Add database indexes for commonly searched fields like title, author, and category.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
