"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Book,
  CreditCard,
  Settings,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Video,
  FileText,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const helpCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Book,
      color: "text-blue-500",
      articles: [
        "How to create an account",
        "Choosing the right subscription plan",
        "Downloading your first ebook",
        "Setting up your reading preferences",
      ],
    },
    {
      id: "reading",
      title: "Reading & Library",
      icon: Book,
      color: "text-green-500",
      articles: ["Using the ebook reader", "Organizing your library", "Syncing across devices", "Offline reading"],
    },
    {
      id: "billing",
      title: "Billing & Subscriptions",
      icon: CreditCard,
      color: "text-yellow-500",
      articles: ["Managing your subscription", "Payment methods", "Billing issues", "Cancellation and refunds"],
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: Settings,
      color: "text-purple-500",
      articles: [
        "Troubleshooting reading issues",
        "App not working properly",
        "Download problems",
        "Account access issues",
      ],
    },
  ]

  const faqs = [
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription at any time from your account settings. Go to 'Manage Subscription' and click 'Cancel Subscription'. You'll continue to have access until the end of your billing period.",
      category: "billing",
    },
    {
      question: "Can I read books offline?",
      answer:
        "Yes! All our ebooks can be downloaded for offline reading. Simply tap the download button on any book in your library. Downloaded books will be available even without an internet connection.",
      category: "reading",
    },
    {
      question: "How many devices can I use?",
      answer:
        "You can access your EbookHub account on unlimited devices. Your reading progress, bookmarks, and library will sync automatically across all your devices.",
      category: "technical",
    },
    {
      question: "What formats do you support?",
      answer:
        "We support PDF, EPUB, and MOBI formats. Most of our books are available in multiple formats so you can choose what works best for your device.",
      category: "technical",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 30-day money-back guarantee for all subscriptions. If you're not satisfied, contact our support team for a full refund.",
      category: "billing",
    },
    {
      question: "How do I change my reading settings?",
      answer:
        "You can customize font size, theme, brightness, and other reading preferences in the reader settings menu. These settings will be saved and applied to all your books.",
      category: "reading",
    },
  ]

  const quickActions = [
    {
      title: "Start Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      action: "chat",
      available: true,
    },
    {
      title: "Schedule a Call",
      description: "Book a phone consultation",
      icon: Phone,
      action: "call",
      available: false,
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: Mail,
      action: "email",
      available: true,
    },
    {
      title: "Community Forum",
      description: "Connect with other readers",
      icon: Users,
      action: "forum",
      available: true,
    },
  ]

  const tutorials = [
    {
      title: "Getting Started with EbookHub",
      duration: "5 min",
      type: "video",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      title: "Advanced Reader Features",
      duration: "8 min",
      type: "video",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      title: "Managing Your Subscription",
      duration: "3 min",
      type: "guide",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b2becd]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, FAQs, and guides..."
              className="pl-10 py-3 bg-[#454e56] border-[#6c7983] text-white placeholder-[#b2becd] text-lg"
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className={`bg-[#2a2e35] border-[#454e56] hover:border-[#27AE60] transition-colors cursor-pointer ${
                !action.available ? "opacity-50" : ""
              }`}
            >
              <CardContent className="p-6 text-center">
                <action.icon className="w-8 h-8 text-[#27AE60] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-[#b2becd] text-sm mb-3">{action.description}</p>
                {action.available ? (
                  <Badge className="bg-green-500 text-white">Available</Badge>
                ) : (
                  <Badge variant="outline" className="border-[#454e56] text-[#b2becd]">
                    Coming Soon
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="bg-[#2a2e35] border border-[#454e56]">
            <TabsTrigger value="browse" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Browse Help
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              FAQ
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Contact Us
            </TabsTrigger>
          </TabsList>

          {/* Browse Help Tab */}
          <TabsContent value="browse" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpCategories.map((category) => (
                <Card key={category.id} className="bg-[#2a2e35] border-[#454e56]">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <category.icon className={`w-6 h-6 mr-3 ${category.color}`} />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.articles.map((article, index) => (
                        <Link
                          key={index}
                          href={`/help/article/${category.id}/${index}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-[#454e56] transition-colors group"
                        >
                          <span className="text-sm">{article}</span>
                          <ChevronRight className="w-4 h-4 text-[#b2becd] group-hover:text-white" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="border-b border-[#454e56] last:border-b-0 pb-4 last:pb-0">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full text-left flex items-center justify-between p-3 hover:bg-[#454e56] rounded-lg transition-colors"
                      >
                        <span className="font-medium">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronDown className="w-5 h-5 text-[#27AE60]" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-[#b2becd]" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-3 pb-3">
                          <p className="text-[#b2becd] leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="bg-[#2a2e35] border-[#454e56] hover:border-[#27AE60] transition-colors">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={tutorial.thumbnail || "/placeholder.svg"}
                        alt={tutorial.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-lg">
                        {tutorial.type === "video" ? (
                          <Video className="w-8 h-8 text-white" />
                        ) : (
                          <FileText className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <Badge className="absolute top-2 right-2 bg-[#27AE60] text-white">{tutorial.duration}</Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                      <Button className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">
                        {tutorial.type === "video" ? "Watch Video" : "Read Guide"}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="First Name" className="bg-[#454e56] border-[#6c7983] text-white" />
                      <Input placeholder="Last Name" className="bg-[#454e56] border-[#6c7983] text-white" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      className="bg-[#454e56] border border-[#6c7983] rounded-lg text-white"
                    />
                    <select className="w-full p-3 bg-[#454e56] border border-[#6c7983] rounded-lg text-white">
                      <option value="">Select a topic</option>
                      <option value="billing">Billing & Subscriptions</option>
                      <option value="technical">Technical Support</option>
                      <option value="reading">Reading & Library</option>
                      <option value="general">General Question</option>
                    </select>
                    <textarea
                      placeholder="Describe your issue or question..."
                      rows={6}
                      className="w-full p-3 bg-[#454e56] border border-[#6c7983] rounded-lg text-white placeholder-[#b2becd] resize-none"
                    />
                    <Button className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">Send Message</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card className="bg-[#2a2e35] border-[#454e56]">
                  <CardHeader>
                    <CardTitle>Other ways to reach us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-[#27AE60]" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-[#b2becd] text-sm">Available 24/7</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-[#27AE60]" />
                      <div>
                        <p className="font-medium">support@ebookhub.com</p>
                        <p className="text-[#b2becd] text-sm">We'll respond within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-[#27AE60]" />
                      <div>
                        <p className="font-medium">+1 (555) 123-4567</p>
                        <p className="text-[#b2becd] text-sm">Mon-Fri, 9AM-6PM EST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#2a2e35] border-[#454e56]">
                  <CardHeader>
                    <CardTitle>Response Times</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Live Chat</span>
                      <Badge className="bg-green-500 text-white">Instant</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Email Support</span>
                      <Badge className="bg-blue-500 text-white">&lt; 24 hours</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone Support</span>
                      <Badge className="bg-yellow-500 text-white">&lt; 2 hours</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
