"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const cartItems = [
  {
    id: 1,
    title: "The Art of Web Development",
    author: "John Smith",
    price: 29.99,
    quantity: 1,
    cover: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 2,
    title: "Digital Marketing Mastery",
    author: "Sarah Johnson",
    price: 24.99,
    quantity: 2,
    cover: "/placeholder.svg?height=200&width=150",
  },
]

export default function CartPage() {
  const [items, setItems] = useState(cartItems)
  const [promoCode, setPromoCode] = useState("")

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setItems(items.filter((item) => item.id !== id))
    } else {
      setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold">
            <Book className="w-8 h-8 text-[#27AE60]" />
            <span>EbookHub</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-[#b2becd]">Review your items before checkout</p>
        </div>

        {items.length === 0 ? (
          <Card className="bg-[#2a2e35] border-[#454e56] text-center py-12">
            <CardContent>
              <ShoppingCart className="w-16 h-16 text-[#454e56] mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-[#b2becd] mb-6">Discover amazing ebooks in our catalog</p>
              <Link href="/">
                <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">Browse Catalog</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="bg-[#2a2e35] border-[#454e56]">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={item.cover || "/placeholder.svg"}
                        alt={item.title}
                        width={80}
                        height={120}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-[#b2becd]">by {item.author}</p>
                        <p className="text-[#27AE60] font-bold text-xl mt-2">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Promo Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-[#454e56] border-[#6c7983] text-white"
                    />
                    <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white py-3 text-lg">
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </Button>

              <div className="text-center text-sm text-[#b2becd]">
                <p>Secure checkout with 256-bit SSL encryption</p>
                <p className="mt-1">Instant download after payment</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
