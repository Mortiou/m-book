"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, ImageIcon, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function UploadEbookPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    category: "",
    tags: "",
    isbn: "",
    language: "English",
    pages: "",
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    const uploadFormData = new FormData()
    uploadFormData.append("file", selectedFile)
    uploadFormData.append("cover", coverImage || "")
    Object.entries(formData).forEach(([key, value]) => {
      uploadFormData.append(key, value)
    })

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/ebooks/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const result = await response.json()

      clearInterval(progressInterval)
      setUploadProgress(100)

      setTimeout(() => {
        setUploadComplete(true)
        setIsUploading(false)
      }, 500)
    } catch (error) {
      console.error("Upload failed:", error)
      setIsUploading(false)
    }
  }

  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-[#191d2b] text-white flex items-center justify-center p-4">
        <Card className="bg-[#2a2e35] border-[#454e56] max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Upload Complete!</h2>
            <p className="text-[#b2becd] mb-6">Your ebook has been uploaded successfully and is now under review.</p>
            <div className="space-y-3">
              <Button
                onClick={() => (window.location.href = "/admin")}
                className="w-full bg-[#27AE60] hover:bg-[#27AE60]/90 text-white"
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => {
                  setUploadComplete(false)
                  setSelectedFile(null)
                  setCoverImage(null)
                  setFormData({
                    title: "",
                    author: "",
                    description: "",
                    price: "",
                    category: "",
                    tags: "",
                    isbn: "",
                    language: "English",
                    pages: "",
                  })
                }}
                variant="outline"
                className="w-full border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
              >
                Upload Another Book
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#191d2b] text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload New Ebook</h1>
          <p className="text-[#b2becd]">Add a new ebook to your catalog</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload */}
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Ebook File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-[#454e56] rounded-lg p-8 text-center">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="w-12 h-12 text-[#27AE60] mx-auto" />
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-[#b2becd]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedFile(null)}
                        className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 text-[#454e56] mx-auto" />
                      <p>Drop your ebook file here or click to browse</p>
                      <p className="text-sm text-[#b2becd]">Supports PDF, EPUB, MOBI</p>
                      <input
                        type="file"
                        accept=".pdf,.epub,.mobi"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="ebook-file"
                      />
                      <Label htmlFor="ebook-file">
                        <Button type="button" className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white">
                          Choose File
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>

                {/* Cover Image Upload */}
                <div>
                  <Label className="text-white mb-2 block">Cover Image</Label>
                  <div className="border-2 border-dashed border-[#454e56] rounded-lg p-4 text-center">
                    {coverImage ? (
                      <div className="space-y-2">
                        <ImageIcon className="w-8 h-8 text-[#27AE60] mx-auto" />
                        <p className="text-sm">{coverImage.name}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCoverImage(null)}
                          className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverSelect}
                          className="hidden"
                          id="cover-image"
                        />
                        <Label htmlFor="cover-image">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]"
                          >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Upload Cover
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Details */}
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-[#454e56] border-[#6c7983] text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author" className="text-white">
                    Author *
                  </Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="bg-[#454e56] border-[#6c7983] text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#454e56] border-[#6c7983] text-white"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-white">
                      Price ($) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-[#454e56] border-[#6c7983] text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pages" className="text-white">
                      Pages
                    </Label>
                    <Input
                      id="pages"
                      type="number"
                      value={formData.pages}
                      onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                      className="bg-[#454e56] border-[#6c7983] text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category" className="text-white">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-[#454e56] border-[#6c7983] text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-white">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    placeholder="web development, javascript, react"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="bg-[#454e56] border-[#6c7983] text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="isbn" className="text-white">
                      ISBN
                    </Label>
                    <Input
                      id="isbn"
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className="bg-[#454e56] border-[#6c7983] text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="language" className="text-white">
                      Language
                    </Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger className="bg-[#454e56] border-[#6c7983] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <Card className="bg-[#2a2e35] border-[#454e56]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Uploading ebook...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" className="border-[#454e56] text-[#b2becd] hover:bg-[#454e56]">
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="bg-[#27AE60] hover:bg-[#27AE60]/90 text-white"
            >
              {isUploading ? "Uploading..." : "Publish Ebook"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
