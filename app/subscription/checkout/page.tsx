"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CreditCard, Lock, ArrowLeft, Check, Crown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SubscriptionCheckoutPage() {
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan")

  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [subscriptionComplete, setSubscriptionComplete] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zipCode: "",
    country: "",
  })

  useEffect(() => {
    if (planId) {
      fetchPlanDetails()
    }
  }, [planId])

  const fetchPlanDetails = async () => {
    try {
      const response = await fetch("/api/subscriptions/plans")
      const data = await response.json()
      const plan = data.plans.find((p: any) => p.id === planId)
      setSelectedPlan(plan)
    } catch (error) {
      console.error("Failed to fetch plan details:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Create subscription
      const response = await fetch("/api/subscriptions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          userId: 1, // Mock user ID
          paymentMethodId: "pm_mock_payment_method",
          customerInfo: formData,
        }),
      })

      const { subscription } = await response.json()

      if (subscription) {
        // Send welcome email
        await fetch("/api/emails/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formData.email,
            template: "subscription_welcome",
            data: {
              customerName: `${formData.firstName} ${formData.lastName}`,
              planName: selectedPlan.name,
              trialDays: selectedPlan.trialDays,
            },
          }),
        })

        setSubscriptionComplete(true)
      }
    } catch (error) {
      console.error("Subscription failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (subscriptionComplete) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center p-4">
        <Card className="bg-[#2a2e35] border-[#454e56] max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-[#27AE60] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Welcome to EbookHub!</h2>
            <p className="text-[#b2becd] mb-6">
              Your {selectedPlan?.trialDays}-day free trial has started. Enjoy unlimited access to our entire library!
            </p>
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">Start Reading</Button>
              </Link>
              <Link href="/subscription/manage">
                <Button variant="outline" className="w-full border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                  Manage Subscription
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27AE60] mx-auto mb-4"></div>
          <p>Loading plan details...</p>
        </div>
      </div>
    )
  }

  const getPlanIcon = (planName: string) => {
    if (planName.includes("Premium")) return Crown
    return Star
  }

  const Icon = getPlanIcon(selectedPlan.name)

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/subscription/plans">
            <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Complete Your Subscription</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-[#27AE60]" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Contact Information</h3>
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#454e56] border-[#6c7983] text-white"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-[#454e56] border-[#6c7983] text-white"
                        required
                      />
                      <Input
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="bg-[#454e56] border-[#6c7983] text-white"
                        required
                      />
                    </div>
                  </div>

                  <Separator className="bg-[#454e56]" />

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Credit/Debit Card
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Card Details */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <Input
                        placeholder="Card number"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="bg-[#454e56] border-[#6c7983] text-white"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          className="bg-[#454e56] border-[#6c7983] text-white"
                          required
                        />
                        <Input
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                          className="bg-[#454e56] border-[#6c7983] text-white"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <Separator className="bg-[#454e56]" />

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Billing Address</h3>
                    <Input
                      placeholder="Address"
                      value={formData.billingAddress}
                      onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                      className="bg-[#454e56] border-[#6c7983] text-white"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="bg-[#454e56] border-[#6c7983] text-white"
                        required
                      />
                      <Input
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="bg-[#454e56] border-[#6c7983] text-white"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white py-3"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Start ${selectedPlan.trialDays}-Day Free Trial`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Plan Summary */}
          <div className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Subscription Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedPlan.name}</h3>
                    <p className="text-[#b2becd] text-sm">{selectedPlan.description}</p>
                  </div>
                </div>

                <Separator className="bg-[#454e56]" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Plan Price</span>
                    <span>
                      ${selectedPlan.price}/{selectedPlan.interval}
                    </span>
                  </div>
                  {selectedPlan.originalPrice > selectedPlan.price && (
                    <div className="flex justify-between text-[#b2becd]">
                      <span>Regular Price</span>
                      <span className="line-through">${selectedPlan.originalPrice}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#27AE60] font-semibold">
                    <span>Free Trial</span>
                    <span>{selectedPlan.trialDays} days</span>
                  </div>
                </div>

                <Separator className="bg-[#454e56]" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Due Today</span>
                  <span className="text-[#27AE60]">$0.00</span>
                </div>

                <div className="text-sm text-[#b2becd] bg-[#454e56] p-3 rounded-lg">
                  <p className="font-semibold mb-2">Trial Details:</p>
                  <ul className="space-y-1">
                    <li>• {selectedPlan.trialDays} days of full access</li>
                    <li>• Cancel anytime during trial</li>
                    <li>• No charge until trial ends</li>
                    <li>
                      • Auto-renews at ${selectedPlan.price}/{selectedPlan.interval}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Plan Features */}
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {selectedPlan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-[#27AE60] flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-sm text-[#b2becd]">
                  <Lock className="w-4 h-4 text-[#27AE60]" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
