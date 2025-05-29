import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, template, data } = await request.json()

    // Mock email service - replace with actual service (SendGrid, Mailgun, etc.)
    const emailTemplates = {
      purchase_confirmation: {
        subject: "Your Ebook Purchase Confirmation",
        html: `
          <h2>Thank you for your purchase!</h2>
          <p>Hi ${data.customerName},</p>
          <p>Your purchase of "${data.bookTitle}" has been confirmed.</p>
          <p>You can download your ebook from your dashboard.</p>
          <a href="${data.downloadLink}">Download Now</a>
        `,
      },
      download_ready: {
        subject: "Your Ebook is Ready for Download",
        html: `
          <h2>Your ebook is ready!</h2>
          <p>Hi ${data.customerName},</p>
          <p>"${data.bookTitle}" is now available for download.</p>
          <a href="${data.downloadLink}">Download Now</a>
        `,
      },
    }

    const emailTemplate = emailTemplates[template as keyof typeof emailTemplates]

    // Simulate email sending
    const emailId = `email_${Math.random().toString(36).substr(2, 9)}`

    console.log("Email sent:", {
      id: emailId,
      to,
      subject: emailTemplate.subject,
      template,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      emailId,
      message: "Email sent successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
