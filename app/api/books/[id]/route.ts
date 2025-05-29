import { type NextRequest, NextResponse } from "next/server"

const mockBookDetails = {
  1: {
    id: 1,
    title: "The Art of Web Development",
    author: "John Smith",
    authorBio:
      "John Smith is a senior software engineer with over 10 years of experience in web development. He has worked with major tech companies and contributed to numerous open-source projects.",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.8,
    reviewCount: 156,
    cover: "/placeholder.svg?height=400&width=300",
    category: "Programming",
    tags: ["web development", "javascript", "react", "frontend"],
    description:
      "Master modern web development with this comprehensive guide covering HTML, CSS, JavaScript, and popular frameworks like React, Vue, and Angular. This book provides practical examples, best practices, and real-world projects to help you become a proficient web developer.",
    fullDescription: `
      <h3>What You'll Learn</h3>
      <ul>
        <li>HTML5 semantic markup and accessibility</li>
        <li>Advanced CSS techniques and responsive design</li>
        <li>Modern JavaScript ES6+ features</li>
        <li>React.js fundamentals and advanced patterns</li>
        <li>State management with Redux and Context API</li>
        <li>API integration and data fetching</li>
        <li>Testing strategies and best practices</li>
        <li>Performance optimization techniques</li>
      </ul>
      
      <h3>Who This Book Is For</h3>
      <p>This book is perfect for beginners who want to start their web development journey, as well as intermediate developers looking to enhance their skills with modern frameworks and best practices.</p>
      
      <h3>Table of Contents</h3>
      <ol>
        <li>Introduction to Web Development</li>
        <li>HTML5 Fundamentals</li>
        <li>CSS3 and Responsive Design</li>
        <li>JavaScript Essentials</li>
        <li>React.js Getting Started</li>
        <li>Component Architecture</li>
        <li>State Management</li>
        <li>API Integration</li>
        <li>Testing and Debugging</li>
        <li>Deployment and Optimization</li>
      </ol>
    `,
    publishDate: "2024-01-15",
    pages: 450,
    language: "English",
    format: ["PDF", "EPUB"],
    isbn: "978-1234567890",
    publisher: "Tech Books Publishing",
    bestseller: true,
    featured: true,
    discount: 25,
    preview: {
      pages: 15,
      content: "Sample content from the first chapter...",
    },
    relatedBooks: [2, 3, 5],
    tableOfContents: [
      { chapter: 1, title: "Introduction to Web Development", page: 1 },
      { chapter: 2, title: "HTML5 Fundamentals", page: 25 },
      { chapter: 3, title: "CSS3 and Responsive Design", page: 65 },
      { chapter: 4, title: "JavaScript Essentials", page: 120 },
      { chapter: 5, title: "React.js Getting Started", page: 180 },
    ],
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const bookId = Number.parseInt(params.id)
  const book = mockBookDetails[bookId as keyof typeof mockBookDetails]

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 })
  }

  return NextResponse.json({ book })
}
