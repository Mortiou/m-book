"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  CreditCard,
  Calendar,
  Download,
  BookOpen,
  Clock,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Crown,
  Star,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ManageSubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/subscriptions/status?userId=1")
      const data = await response.json()
      setSubscription(data.subscription)
    } catch (error) {
      console.error("Failed to fetch subscription:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscriptionAction = async (action: string, data?: any) => {
    setActionLoading(action)
    try {
      const response = await fetch("/api/subscriptions/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId: 1, ...data }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchSubscriptionStatus()
        alert(result.message)
      }
    } catch (error) {
      console.error("Action failed:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "trialing":
        return "bg-blue-500"
      case "past_due":
        return "bg-yellow-500"
      case "canceled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle
      case "trialing":
        return Clock
      case "past_due":
        return AlertTriangle
      case "canceled":
        return XCircle
      default:
        return Settings
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27AE60] mx-auto mb-4"></div>
          <p>Loading subscription details...</p>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <Card className="bg-[#2a2e35] border-[#454e56] max-w-md w-full text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">No Active Subscription</h2>
            <p className="text-[#b2becd] mb-6">You don't have an active subscription. Choose a plan to get started!</p>
            <Link href="/subscription/plans">
              <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">View Plans</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const StatusIcon = getStatusIcon(subscription.status)
  const isPremium = subscription.planName.includes("Premium")

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Manage Subscription</h1>
          <p className="text-[#b2becd]">Control your EbookHub subscription and usage</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Subscription Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <StatusIcon className="w-5 h-5 text-[#27AE60]" />
                    <Badge className={`${getStatusColor(subscription.status)} text-white`}>
                      {subscription.isTrialing ? "Free Trial" : subscription.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{subscription.planName}</h3>
                  <p className="text-[#b2becd] text-sm">
                    {subscription.isTrialing
                      ? `Trial ends in ${subscription.daysUntilRenewal} days`
                      : `Renews in ${subscription.daysUntilRenewal} days`}
                  </p>
                </div>
                {isPremium ? <Crown className="w-8 h-8 text-yellow-500" /> : <Star className="w-8 h-8 text-blue-500" />}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">This Month's Usage</p>
                  <p className="text-2xl font-bold">{subscription.usage.booksRead}</p>
                  <p className="text-[#b2becd] text-sm">Books read</p>
                </div>
                <BookOpen className="w-8 h-8 text-[#27AE60]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#b2becd] text-sm">Reading Time</p>
                  <p className="text-2xl font-bold">{subscription.usage.readingTime}</p>
                  <p className="text-[#b2becd] text-sm">This month</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trial Alert */}
        {subscription.isTrialing && (
          <Alert className="mb-6 bg-blue-500/10 border-blue-500">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              You're currently on a free trial. Your subscription will automatically start on{" "}
              {new Date(subscription.trialEnd).toLocaleDateString()} unless you cancel.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#2a2e35] border border-[#454e56]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Usage & Stats
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Billing
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Plan */}
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {isPremium ? (
                      <Crown className="w-8 h-8 text-yellow-500" />
                    ) : (
                      <Star className="w-8 h-8 text-blue-500" />
                    )}
                    <div>
                      <h3 className="font-semibold">{subscription.planName}</h3>
                      <p className="text-[#b2becd] text-sm">
                        {subscription.isTrialing ? "Free Trial Active" : "Active Subscription"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Benefits:</h4>
                    <ul className="space-y-1">
                      {subscription.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#27AE60]" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    <Link href="/subscription/plans">
                      <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                        Change Plan
                      </Button>
                    </Link>
                    {!subscription.cancelAtPeriodEnd ? (
                      <Button
                        onClick={() => handleSubscriptionAction("cancel")}
                        disabled={actionLoading === "cancel"}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        {actionLoading === "cancel" ? "Processing..." : "Cancel"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSubscriptionAction("reactivate")}
                        disabled={actionLoading === "reactivate"}
                        className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white"
                      >
                        {actionLoading === "reactivate" ? "Processing..." : "Reactivate"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Next Billing */}
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-[#27AE60]" />
                    <div>
                      <p className="font-semibold">{subscription.isTrialing ? "Trial Ends" : "Next Billing"}</p>
                      <p className="text-[#b2becd] text-sm">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-[#27AE60]" />
                    <div>
                      <p className="font-semibold">Payment Method</p>
                      <p className="text-[#b2becd] text-sm">•••• •••• •••• 4242</p>
                    </div>
                  </div>

                  {subscription.cancelAtPeriodEnd && (
                    <Alert className="bg-yellow-500/10 border-yellow-500">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Your subscription will be canceled on{" "}
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Download Usage */}
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Download Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Downloads this month</span>
                    <span className="font-semibold">
                      {subscription.usage.downloadsThisMonth}
                      {subscription.usage.downloadLimit && ` / ${subscription.usage.downloadLimit}`}
                    </span>
                  </div>

                  {subscription.usage.downloadLimit && (
                    <Progress
                      value={(subscription.usage.downloadsThisMonth / subscription.usage.downloadLimit) * 100}
                      className="w-full"
                    />
                  )}

                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-[#27AE60]" />
                    <span className="text-sm text-[#b2becd]">
                      {subscription.usage.downloadLimit
                        ? `${subscription.usage.downloadLimit - subscription.usage.downloadsThisMonth} downloads remaining`
                        : "Unlimited downloads"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Reading Stats */}
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Reading Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#27AE60]">{subscription.usage.booksRead}</p>
                      <p className="text-[#b2becd] text-sm">Books Read</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#27AE60]">{subscription.usage.readingTime}</p>
                      <p className="text-[#b2becd] text-sm">Reading Time</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-[#27AE60]" />
                    <span className="text-sm text-[#b2becd]">+15% more than last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "2024-01-01", amount: "$19.99", status: "Paid", description: "Premium Monthly" },
                    { date: "2023-12-01", amount: "$19.99", status: "Paid", description: "Premium Monthly" },
                    { date: "2023-11-01", amount: "$19.99", status: "Paid", description: "Premium Monthly" },
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#454e56] rounded-lg">
                      <div>
                        <p className="font-semibold">{invoice.description}</p>
                        <p className="text-[#b2becd] text-sm">{invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{invoice.amount}</p>
                        <Badge className="bg-green-500 text-white">{invoice.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Subscription Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Auto-renewal</h4>
                      <p className="text-[#b2becd] text-sm">Automatically renew your subscription</p>
                    </div>
                    <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                      {subscription.cancelAtPeriodEnd ? "Enable" : "Disable"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Email Notifications</h4>
                      <p className="text-[#b2becd] text-sm">Receive billing and account updates</p>
                    </div>
                    <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Payment Method</h4>
                      <p className="text-[#b2becd] text-sm">Update your payment information</p>
                    </div>
                    <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                      Update
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Download Account Data</h4>
                      <p className="text-[#b2becd] text-sm">Export your reading history and data</p>
                    </div>
                    <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                      Export
                    </Button>
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
