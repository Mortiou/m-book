"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  MapPin,
  Globe,
  Calendar,
  BookOpen,
  Clock,
  Star,
  Users,
  MessageCircle,
  Settings,
  Share2,
  Trophy,
  Target,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfilePageProps {
  params: {
    userId: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [user, setUser] = useState<any>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserProfile()
  }, [params.userId])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/profile/${params.userId}`)
      const data = await response.json()
      setUser(data.user)
      setIsOwnProfile(data.isOwnProfile)
      setFriendshipStatus(data.friendshipStatus)
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFriendAction = async (action: string) => {
    try {
      await fetch("/api/social/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // Current user ID
          friendId: Number.parseInt(params.userId),
          action,
        }),
      })

      // Update friendship status
      switch (action) {
        case "send_request":
          setFriendshipStatus("pending")
          break
        case "accept_request":
          setFriendshipStatus("friends")
          break
        case "remove_friend":
          setFriendshipStatus(null)
          break
      }
    } catch (error) {
      console.error("Friend action failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27AE60] mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <Link href="/">
            <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const readingGoalProgress = (user.stats.booksReadThisMonth / user.profile.readingGoals.booksPerMonth) * 100

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-64 bg-gradient-to-r from-[#27AE60] to-[#2ecc71] relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Profile Info */}
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-20">
            {/* Avatar */}
            <Avatar className="w-32 h-32 border-4 border-[#2a2e35] bg-[#2a2e35]">
              <AvatarImage src={user.profile.avatar || "/placeholder.svg"} alt={user.firstName} />
              <AvatarFallback className="text-2xl font-bold bg-[#27AE60] text-white">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 pb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-[#b2becd] text-lg">@{user.username || user.email.split("@")[0]}</p>

                  {user.profile.bio && <p className="text-[#b2becd] mt-2 max-w-2xl">{user.profile.bio}</p>}

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#b2becd]">
                    {user.profile.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.profile.location}</span>
                      </div>
                    )}

                    {user.profile.website && (
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <a
                          href={user.profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#27AE60] hover:underline"
                        >
                          {user.profile.website}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(user.stats.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-4 md:mt-0">
                  {isOwnProfile ? (
                    <>
                      <Link href="/profile/edit">
                        <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                      <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </>
                  ) : (
                    <>
                      {friendshipStatus === null && (
                        <Button
                          onClick={() => handleFriendAction("send_request")}
                          className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Add Friend
                        </Button>
                      )}

                      {friendshipStatus === "pending" && (
                        <Button variant="outline" className="border-[#454e56] text-[#b2becd]" disabled>
                          <Clock className="w-4 h-4 mr-2" />
                          Request Sent
                        </Button>
                      )}

                      {friendshipStatus === "friends" && (
                        <Button
                          onClick={() => handleFriendAction("remove_friend")}
                          variant="outline"
                          className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Friends
                        </Button>
                      )}

                      <Button variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-[#27AE60] mx-auto mb-2" />
              <div className="text-2xl font-bold">{user.stats.booksRead}</div>
              <div className="text-[#b2becd] text-sm">Books Read</div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{Math.floor(user.stats.totalReadingTime / 60)}h</div>
              <div className="text-[#b2becd] text-sm">Reading Time</div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{user.stats.averageRating || "4.2"}</div>
              <div className="text-[#b2becd] text-sm">Avg Rating</div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{user.stats.readingStreak}</div>
              <div className="text-[#b2becd] text-sm">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="bg-[#2a2e35] border border-[#454e56]">
            <TabsTrigger value="activity" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Activity
            </TabsTrigger>
            <TabsTrigger value="library" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Library
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
              Goals
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger value="friends" className="data-[state=active]:bg-[#27AE60] data-[state=active]:text-white">
                Friends
              </TabsTrigger>
            )}
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "finished", book: "The Art of Web Development", time: "2 hours ago" },
                    { type: "review", book: "Digital Marketing Mastery", rating: 5, time: "1 day ago" },
                    { type: "started", book: "AI and Machine Learning", time: "3 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-[#454e56] rounded-lg">
                      <div className="w-10 h-10 bg-[#27AE60] rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {activity.type === "finished" && `Finished reading "${activity.book}"`}
                          {activity.type === "review" && `Reviewed "${activity.book}"`}
                          {activity.type === "started" && `Started reading "${activity.book}"`}
                        </p>
                        <p className="text-[#b2becd] text-sm">{activity.time}</p>
                      </div>
                      {activity.type === "review" && (
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= (activity.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-[#454e56]"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-[#27AE60]" />
                    Monthly Reading Goal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#27AE60]">{user.stats.booksReadThisMonth || 0}</div>
                    <div className="text-[#b2becd]">of {user.profile.readingGoals.booksPerMonth} books</div>
                  </div>

                  <Progress value={readingGoalProgress} className="w-full" />

                  <div className="text-center text-sm text-[#b2becd]">
                    {readingGoalProgress >= 100
                      ? "Goal achieved! 🎉"
                      : `${Math.ceil(user.profile.readingGoals.booksPerMonth - (user.stats.booksReadThisMonth || 0))} books to go`}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#2a2e35] border-[#454e56]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                    Reading Streak
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">{user.stats.readingStreak}</div>
                    <div className="text-[#b2becd]">days in a row</div>
                  </div>

                  <div className="text-center text-sm text-[#b2becd]">
                    {user.stats.readingStreak > 0
                      ? "Keep it up! Read today to maintain your streak."
                      : "Start a new reading streak today!"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
        </Tabs>
      </div>
    </div>
  )
}
