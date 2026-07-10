import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, device, issue } = await req.json();

    // Validate required fields
    if (!name || !email || !issue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Send confirmation to customer
    const customerEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Origin Repairs <noreply@originrepairs.co.uk>",
        to: email,
        subject: "Message received — Origin Repairs",
        html: `
          <h2>Thanks for getting in touch!</h2>
          <p>Hi ${name},</p>
          <p>We received your message and will get back to you within 1 hour during business hours.</p>
          <h3>Your message:</h3>
          <p>${device ? `<strong>Device:</strong> ${device}<br />` : ""}</p>
          <p><strong>Issue:</strong> ${issue}</p>
          <p>If your issue is urgent, call us: <a href="tel:+447768426754"><strong>+44 7768 426754</strong></a></p>
          <p>Thanks,<br />Origin Repairs</p>
        `,
      }),
    });

    if (!customerEmailRes.ok) {
      const error = await customerEmailRes.text();
      console.error("Failed to send customer email:", error);
    }

    // Send to business
    const businessEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Origin Repairs <noreply@originrepairs.co.uk>",
        to: "tech@originrepairs.co.uk",
        subject: `New inquiry from ${name}`,
        html: `
          <h2>New Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          ${device ? `<p><strong>Device:</strong> ${device}</p>` : ""}
          <p><strong>Issue:</strong> ${issue}</p>
        `,
      }),
    });

    if (!businessEmailRes.ok) {
      const error = await businessEmailRes.text();
      console.error("Failed to send business email:", error);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
