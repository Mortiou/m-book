"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Bookmark,
  List,
  ArrowLeft,
  Clock,
  Headphones,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AudiobookPlayerProps {
  params: {
    bookId: string
  }
}

export default function AudiobookPlayer({ params }: AudiobookPlayerProps) {
  const [audiobook, setAudiobook] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [showChapters, setShowChapters] = useState(false)
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    fetchAudiobook()
  }, [params.bookId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleTrackEnd)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleTrackEnd)
    }
  }, [])

  const fetchAudiobook = async () => {
    try {
      const response = await fetch(`/api/audiobooks?bookId=${params.bookId}`)
      const data = await response.json()
      setAudiobook(data.audiobooks[0])
    } catch (error) {
      console.error("Failed to fetch audiobook:", error)
    } finally {
      setLoading(false)
    }
  }

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = value[0]
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0]
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const changePlaybackSpeed = (speed: string) => {
    const audio = audioRef.current
    if (!audio) return

    const newSpeed = Number.parseFloat(speed)
    audio.playbackRate = newSpeed
    setPlaybackSpeed(newSpeed)
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.min(audio.currentTime + 30, duration)
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.max(audio.currentTime - 30, 0)
  }

  const handleTrackEnd = () => {
    setIsPlaying(false)
    // Auto-advance to next chapter if available
    if (currentChapter < audiobook.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1)
    }
  }

  const goToChapter = (chapterIndex: number) => {
    const audio = audioRef.current
    if (!audio || !audiobook) return

    const chapter = audiobook.chapters[chapterIndex]
    audio.currentTime = chapter.startTime
    setCurrentChapter(chapterIndex)
    setShowChapters(false)
  }

  const addBookmark = () => {
    const newBookmark = Math.floor(currentTime)
    setBookmarks([...bookmarks, newBookmark])
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27AE60] mx-auto mb-4"></div>
          <p>Loading audiobook...</p>
        </div>
      </div>
    )
  }

  if (!audiobook) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Audiobook Not Found</h1>
          <Link href="/">
            <Button className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">Back to Store</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      {/* Audio Element */}
      <audio ref={audioRef} src={audiobook.audioUrl} preload="metadata" />

      {/* Header */}
      <header className="bg-[#2a2e35] border-b border-[#454e56] p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={`/book/${audiobook.bookId}`}
            className="flex items-center space-x-2 text-[#b2becd] hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Book</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Headphones className="w-5 h-5 text-[#27AE60]" />
            <span className="font-semibold">Audiobook Player</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Book Info */}
        <div className="text-center mb-8">
          <Image
            src={audiobook.cover || "/placeholder.svg"}
            alt={audiobook.title}
            width={200}
            height={280}
            className="mx-auto rounded-lg shadow-lg mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{audiobook.title}</h1>
          <p className="text-[#b2becd] text-lg mb-1">by {audiobook.author}</p>
          <p className="text-[#b2becd]">Narrated by {audiobook.narrator}</p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-[#b2becd]">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{audiobook.duration}</span>
            </div>
            <div>•</div>
            <div>{audiobook.chapters.length} chapters</div>
          </div>
        </div>

        {/* Player Controls */}
        <Card className="bg-[#2a2e35] border-[#454e56] mb-6">
          <CardContent className="p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <Slider value={[currentTime]} onValueChange={handleSeek} max={duration} step={1} className="w-full" />
              <div className="flex justify-between text-sm text-[#b2becd] mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center space-x-6 mb-6">
              <Button
                onClick={skipBackward}
                variant="outline"
                size="sm"
                className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </Button>

              <Button
                onClick={skipForward}
                variant="outline"
                size="sm"
                className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center justify-between">
              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <Button onClick={toggleMute} variant="ghost" size="sm" className="text-[#b2becd] hover:bg-[#454e56]">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-24"
                />
              </div>

              {/* Playback Speed */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#b2becd]">Speed:</span>
                <Select value={playbackSpeed.toString()} onValueChange={changePlaybackSpeed}>
                  <SelectTrigger className="w-20 bg-[#454e56] border-[#6c7983] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={addBookmark}
                  variant="outline"
                  size="sm"
                  className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setShowChapters(!showChapters)}
                  variant="outline"
                  size="sm"
                  className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapters List */}
        {showChapters && (
          <Card className="bg-[#2a2e35] border-[#454e56] mb-6">
            <CardHeader>
              <CardTitle>Chapters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {audiobook.chapters.map((chapter: any, index: number) => (
                  <button
                    key={chapter.id}
                    onClick={() => goToChapter(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentChapter ? "bg-[#27AE60] text-white" : "hover:bg-[#454e56]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{chapter.title}</p>
                        <p className={`text-sm ${index === currentChapter ? "text-white/80" : "text-[#b2becd]"}`}>
                          Chapter {index + 1} • {formatTime(chapter.duration)}
                        </p>
                      </div>
                      <span className={`text-sm ${index === currentChapter ? "text-white/80" : "text-[#b2becd]"}`}>
                        {formatTime(chapter.startTime)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bookmarks */}
        {bookmarks.length > 0 && (
          <Card className="bg-[#2a2e35] border-[#454e56]">
            <CardHeader>
              <CardTitle>Bookmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bookmarks.map((bookmark, index) => (
                  <button
                    key={index}
                    onClick={() => handleSeek([bookmark])}
                    className="w-full text-left p-3 bg-[#454e56] rounded-lg hover:bg-[#6c7983] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>Bookmark {index + 1}</span>
                      <span className="text-[#b2becd]">{formatTime(bookmark)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
