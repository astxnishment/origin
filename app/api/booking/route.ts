import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      brand,
      model,
      repair,
      estimatedPrice,
      estimatedTime,
      warranty,
      date,
      time,
      issue,
    } = await req.json();

    // Validate required fields
    if (!name || !email || !phone || !brand || !model || !repair || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const deviceLine = `${brand} ${model}`;
    const repairLine = repair + (estimatedPrice ? ` — ${estimatedPrice}` : "");

    // Format the booking details for email
    const bookingDate = new Date(date).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const emailBody = `
      <h2>Booking Confirmation</h2>
      <p>Hi ${name},</p>
      <p>Your repair booking has been confirmed. Here are the details:</p>

      <h3>Booking Details</h3>
      <ul>
        <li><strong>Device:</strong> ${deviceLine}</li>
        <li><strong>Repair:</strong> ${repairLine}</li>
        ${estimatedTime ? `<li><strong>Estimated time:</strong> ${estimatedTime}</li>` : ""}
        ${warranty ? `<li><strong>Warranty:</strong> ${warranty}</li>` : ""}
        <li><strong>Date:</strong> ${bookingDate}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Issue:</strong> ${issue || "To be diagnosed"}</li>
      </ul>
      <p style="font-size:13px;color:#666;">Estimated price is confirmed after a free in-store inspection.</p>

      <h3>What to Expect</h3>
      <ol>
        <li>Come to our location: 76 Cookridge Street, Leeds, LS2 8GL</li>
        <li>Our technician will diagnose your device (free)</li>
        <li>We'll confirm the final price before any work starts</li>
        <li>Repair completed with 12-month warranty</li>
      </ol>

      <p><strong>Contact:</strong> 07768426754</p>
      <p><strong>Hours:</strong> Mon-Sat: 9am-6pm | Sun: Closed</p>

      <p>If you need to reschedule or have any questions, call us at 07768426754.</p>

      <p>Thanks for choosing Origin Repairs!</p>
    `;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    const customerEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Origin Repairs <noreply@originrepairs.co.uk>",
        to: email,
        subject: `Booking Confirmed - ${date} at ${time}`,
        html: emailBody,
      }),
    });

    if (!customerEmailRes.ok) {
      const error = await customerEmailRes.text();
      console.error("Failed to send customer email:", error);
    }

    // Send notification to business
    const businessEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Origin Repairs <noreply@originrepairs.co.uk>",
        to: "tech@originrepairs.co.uk",
        subject: `New Booking: ${deviceLine} on ${date}`,
        html: `
          <h2>New Booking Received</h2>
          <p><strong>Customer:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Device:</strong> ${deviceLine}</p>
          <p><strong>Repair:</strong> ${repairLine}</p>
          ${estimatedTime ? `<p><strong>Estimated time:</strong> ${estimatedTime}</p>` : ""}
          <p><strong>Date:</strong> ${bookingDate}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Issue:</strong> ${issue || "To be diagnosed"}</p>
        `,
      }),
    });

    if (!businessEmailRes.ok) {
      const error = await businessEmailRes.text();
      console.error("Failed to send business email:", error);
    }

    // Return success
    return NextResponse.json({
      ok: true,
      message: "Booking confirmed",
    });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
