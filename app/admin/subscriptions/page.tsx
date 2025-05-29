"use client"

import { useState, useEffect } from "react"
import { Users, DollarSign, TrendingUp, TrendingDown, Crown, Star, AlertTriangle, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function SubscriptionAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/subscriptions/analytics")
      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27AE60] mx-auto mb-4"></div>
          <p>Loading subscription analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Subscription Analytics</h1>
          <p className="text-[#b2becd]">Monitor subscription performance and revenue metrics</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Total Subscribers</p>
                  <p className="text-2xl font-bold">{analytics.overview.totalSubscribers.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">+12.5%</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Monthly Recurring Revenue</p>
                  <p className="text-2xl font-bold">${analytics.overview.monthlyRecurringRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">+8.3%</span>
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
                  <p className="text-[#b2becd] text-sm">Churn Rate</p>
                  <p className="text-2xl font-bold">{analytics.overview.churnRate}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">-0.5%</span>
                  </div>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Average Revenue Per User</p>
                  <p className="text-2xl font-bold">${analytics.overview.averageRevenuePerUser}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">+3.2%</span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#2a2e35] border border-[#454e56]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Plan Distribution
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Revenue Trends
            </TabsTrigger>
            <TabsTrigger value="churn" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Churn Analysis
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Subscription Health</CardTitle>
                  <CardDescription className="text-[#b2becd]">Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Active Subscribers</span>
                      <span className="font-semibold">{analytics.overview.activeSubscribers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Trial Users</span>
                      <span className="font-semibold">{analytics.overview.trialUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Lifetime Value</span>
                      <span className="font-semibold">${analytics.overview.lifetimeValue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Trial Conversion Rate</span>
                      <span className="font-semibold text-[#27AE60]">
                        {analytics.conversionRates.trialToSubscription}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription className="text-[#b2becd]">User journey metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Free to Trial</span>
                        <span>{analytics.conversionRates.freeToTrial}%</span>
                      </div>
                      <Progress value={analytics.conversionRates.freeToTrial} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Trial to Subscription</span>
                        <span>{analytics.conversionRates.trialToSubscription}%</span>
                      </div>
                      <Progress value={analytics.conversionRates.trialToSubscription} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Plan Upgrade Rate</span>
                        <span>{analytics.conversionRates.upgradeRate}%</span>
                      </div>
                      <Progress value={analytics.conversionRates.upgradeRate} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Plan Distribution Tab */}
          <TabsContent value="plans" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription className="text-[#b2becd]">Subscriber breakdown by plan type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.planDistribution.map((plan: any) => (
                    <div key={plan.planId} className="flex items-center justify-between p-4 bg-[#454e56] rounded-lg">
                      <div className="flex items-center space-x-3">
                        {plan.name.includes("Premium") ? (
                          <Crown className="w-6 h-6 text-yellow-500" />
                        ) : (
                          <Star className="w-6 h-6 text-blue-500" />
                        )}
                        <div>
                          <h4 className="font-semibold">{plan.name}</h4>
                          <p className="text-[#b2becd] text-sm">{plan.subscribers} subscribers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-[#27AE60] text-white">{plan.percentage}%</Badge>
                        <div className="w-32 mt-2">
                          <Progress value={plan.percentage} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Trends Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription className="text-[#b2becd]">Monthly revenue and subscriber trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end space-x-4">
                  {analytics.revenueByMonth.map((month: any, index: number) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-[#27AE60] rounded-t"
                        style={{ height: `${(month.revenue / 50000) * 200}px` }}
                      />
                      <span className="text-xs text-[#b2becd] mt-2">{month.month}</span>
                      <span className="text-xs text-[#b2becd]">${(month.revenue / 1000).toFixed(0)}k</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Churn Analysis Tab */}
          <TabsContent value="churn" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Churn Reasons</CardTitle>
                  <CardDescription className="text-[#b2becd]">Why subscribers cancel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.churnAnalysis.reasons.map((reason: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{reason.reason}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-[#454e56] rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${reason.percentage}%` }} />
                          </div>
                          <span className="text-sm font-semibold">{reason.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Churn by Plan</CardTitle>
                  <CardDescription className="text-[#b2becd]">Retention rates by subscription type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.churnAnalysis.byPlan.map((plan: any) => (
                      <div key={plan.planId} className="flex items-center justify-between p-3 bg-[#454e56] rounded-lg">
                        <span className="font-medium">
                          {plan.planId.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${
                              plan.churnRate < 2 ? "bg-green-500" : plan.churnRate < 4 ? "bg-yellow-500" : "bg-red-500"
                            } text-white`}
                          >
                            {plan.churnRate}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
