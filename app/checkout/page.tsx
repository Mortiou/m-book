"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { CreditCard, Lock, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
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

  const orderItems = [
    { title: "The Art of Web Development", price: 29.99 },
    { title: "Digital Marketing Mastery", price: 24.99 },
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Create payment intent
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "usd",
          metadata: { orderItems: JSON.stringify(orderItems) },
        }),
      })

      const { paymentIntent } = await response.json()

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Confirm payment
      const confirmResponse = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          paymentMethodId: "pm_mock_payment_method",
        }),
      })

      const { payment } = await confirmResponse.json()

      if (payment.status === "succeeded") {
        // Send confirmation email
        await fetch("/api/emails/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formData.email,
            template: "purchase_confirmation",
            data: {
              customerName: `${formData.firstName} ${formData.lastName}`,
              bookTitle: orderItems.map((item) => item.title).join(", "),
              downloadLink: "/dashboard",
            },
          }),
        })

        setOrderComplete(true)
      }
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center p-4">
        <Card className="bg-[#2a2e35] border-[#454e56] max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Order Complete!</h2>
            <p className="text-[#b2becd] mb-6">
              Thank you for your purchase. Your ebooks are now available in your dashboard.
            </p>
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">Go to Dashboard</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/cart">
            <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Secure Checkout</h1>
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
                    {isProcessing ? "Processing..." : `Complete Order - $${total.toFixed(2)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-[#b2becd]">{item.title}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
                <Separator className="bg-[#454e56]" />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="bg-[#454e56]" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#27AE60]">${total.toFixed(2)}</span>
                </div>
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
