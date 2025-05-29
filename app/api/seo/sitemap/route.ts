import { NextResponse } from "next/server"

export async function GET() {
  // Generate dynamic sitemap for SEO
  const baseUrl = "https://ebookhub.com" // Replace with actual domain

  const staticPages = ["", "/search", "/about", "/contact", "/privacy", "/terms"]

  // Mock book IDs - in production, fetch from database
  const bookIds = [1, 2, 3, 4, 5]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`,
    )
    .join("")}
  ${bookIds
    .map(
      (id) => `
  <url>
    <loc>${baseUrl}/book/${id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`,
    )
    .join("")}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
