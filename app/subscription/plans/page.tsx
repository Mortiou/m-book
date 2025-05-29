"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Check, Star, Zap, Crown, ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Plan {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  currency: string
  interval: string
  features: string[]
  limitations: string[]
  popular: boolean
  trialDays: number
  discount: number
  savings?: string
}

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/subscriptions/plans")
      const data = await response.json()
      setPlans(data.plans || [])
    } catch (error) {
      console.error("Failed to fetch plans:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlans = plans.filter((plan) => (isYearly ? plan.interval === "year" : plan.interval === "month"))

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId)
    // Redirect to checkout with plan selection
    window.location.href = `/subscription/checkout?plan=${planId}`
  }

  const getPlanIcon = (planName: string) => {
    if (planName.includes("Premium")) return Crown
    if (planName.includes("Basic")) return Star
    return Zap
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27AE60] mx-auto mb-4"></div>
          <p>Loading subscription plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center space-x-2 text-[#b2becd] hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Store</span>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Choose Your <span className="text-[#27AE60]">Reading Plan</span>
            </h1>
            <p className="text-xl text-[#b2becd] mb-8">Unlimited access to thousands of premium ebooks</p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-lg ${!isYearly ? "text-white font-semibold" : "text-[#b2becd]"}`}>Monthly</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-[#27AE60]" />
              <span className={`text-lg ${isYearly ? "text-white font-semibold" : "text-[#b2becd]"}`}>Yearly</span>
              {isYearly && <Badge className="bg-[#27AE60] text-white ml-2">Save up to 36%</Badge>}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {filteredPlans.map((plan) => {
            const Icon = getPlanIcon(plan.name)
            const isPopular = plan.popular

            return (
              <Card
                key={plan.id}
                className={`relative bg-[#2a2e35] border-2 transition-all duration-300 hover:transform hover:-translate-y-2 ${
                  isPopular
                    ? "border-[#27AE60] shadow-lg shadow-[#27AE60]/20"
                    : "border-[#454e56] hover:border-[#27AE60]"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#27AE60] text-white px-4 py-1 text-sm font-semibold">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isPopular ? "bg-[#27AE60]" : "bg-[#454e56]"
                      }`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-[#b2becd]">{plan.description}</p>

                  <div className="mt-4">
                    <div className="flex items-center justify-center space-x-2">
                      {plan.originalPrice > plan.price && (
                        <span className="text-lg text-[#b2becd] line-through">${plan.originalPrice}</span>
                      )}
                      <span className="text-4xl font-bold text-[#27AE60]">${plan.price}</span>
                    </div>
                    <p className="text-[#b2becd] mt-1">per {plan.interval}</p>

                    {plan.discount > 0 && <Badge className="bg-red-500 text-white mt-2">{plan.discount}% OFF</Badge>}

                    {plan.savings && <p className="text-[#27AE60] text-sm mt-2 font-semibold">{plan.savings}</p>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Trial Info */}
                  <div className="text-center p-3 bg-[#454e56] rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold text-[#27AE60]">{plan.trialDays} days free trial</span>
                      <br />
                      Cancel anytime during trial
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="w-5 h-5 text-[#27AE60] flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-[#b2becd]">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-5 h-5 border border-[#454e56] rounded flex-shrink-0"></div>
                            <span className="text-sm text-[#b2becd]">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={selectedPlan === plan.id}
                    className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                      isPopular
                        ? "bg-[#27AE60] hover:bg-[#27AE60]/90 text-white"
                        : "bg-transparent border-2 border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60] hover:text-white"
                    }`}
                  >
                    {selectedPlan === plan.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Start {plan.trialDays}-Day Free Trial
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <Card className="bg-[#2a2e35] border-[#454e56]">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[#454e56]">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white"
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white"
                >
                  Billing
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white"
                >
                  Features
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What happens during my free trial?</h4>
                    <p className="text-[#b2becd]">
                      You get full access to all features of your chosen plan. You can cancel anytime during the trial
                      period without being charged.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can I change my plan later?</h4>
                    <p className="text-[#b2becd]">
                      Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing
                      cycle.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What devices can I use?</h4>
                    <p className="text-[#b2becd]">
                      You can read on any device - phones, tablets, computers, and e-readers. Your progress syncs across
                      all devices.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="billing" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">When will I be charged?</h4>
                    <p className="text-[#b2becd]">
                      You'll be charged after your free trial ends, then automatically on each billing cycle unless you
                      cancel.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can I get a refund?</h4>
                    <p className="text-[#b2becd]">
                      We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How do I cancel my subscription?</h4>
                    <p className="text-[#b2becd]">
                      You can cancel anytime from your account settings. You'll continue to have access until the end of
                      your billing period.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What's the difference between Basic and Premium?</h4>
                    <p className="text-[#b2becd]">
                      Premium includes unlimited downloads, audiobooks, priority support, and exclusive early access to
                      new releases.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can I download books for offline reading?</h4>
                    <p className="text-[#b2becd]">
                      Yes! All plans include offline reading. Basic plans have download limits, while Premium offers
                      unlimited downloads.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Do you add new books regularly?</h4>
                    <p className="text-[#b2becd]">
                      We add new books weekly across all categories. Premium subscribers get early access to new
                      releases.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">No Commitment</h4>
              <p className="text-[#b2becd] text-sm">Cancel anytime, no questions asked</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Premium Quality</h4>
              <p className="text-[#b2becd] text-sm">Curated collection of high-quality ebooks</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Instant Access</h4>
              <p className="text-[#b2becd] text-sm">Start reading immediately after signup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
