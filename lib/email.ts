import { Resend } from "resend";
import QRCode from "qrcode";
import { uploadToImageKit } from "./imagekit"

const resend = new Resend(process.env.RESEND_API_KEY);

interface RegistrationEmailData {
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventDate: Date;
  eventVenue: string;
  qrCode: string;
  registrationId: string;
  eventId: string
}

export async function sendRegistrationConfirmationEmail(
  data: RegistrationEmailData
) {
  try {

    // Create check-in URL for QR code
    const checkInUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/events/${data.eventId}/check-in?verify=${data.qrCode}`
    
    // Generate QR code as buffer
    const qrBuffer = await QRCode.toBuffer(checkInUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      });

      // Upload QR code to ImageKit
    const qrImageResult = await uploadToImageKit(qrBuffer, `qr-${data.registrationId}.png`, `qr-codes/${data.eventId}/`)

    const { data: emailData, error } = await resend.emails.send({
      // from: "College Events <noreply@collegeevents.com>",
      from: "College Events <noreply@cosatc.com>",
      to: [data.userEmail],
      subject: `Registration Confirmed: ${data.eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .qr-section { text-align: center; margin: 30px 0; padding: 20px; background: white; border-radius: 10px; border: 2px dashed #667eea; }
              .event-details { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
              .detail-label { font-weight: bold; color: #667eea; }
              .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
              .qr-image { max-width: 250px; height: auto; border: 1px solid #ddd; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Registration Confirmed!</h1>
                <p>You're all set for ${data.eventTitle}</p>
              </div>
              
              <div class="content">
                <p>Hi ${data.userName},</p>
                <p>Great news! Your registration for <strong>${data.eventTitle}</strong> has been confirmed.</p>
                
                <div class="event-details">
                  <h3>📅 Event Details</h3>
                  <div class="detail-row">
                    <span class="detail-label">Event:</span>
                    <span>${data.eventTitle}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Date & Time:</span>
                    <span>${new Date(data.eventDate).toLocaleString()}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Venue:</span>
                    <span>${data.eventVenue}d</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Registration ID:</span>
                    <span>${data.qrCode}</span>
                  </div>
                </div>

                <div class="qr-section">
                  <h3>📱 Your Entry QR Code</h3>
                  <p>Show this QR code at the event entrance for quick check-in:</p>
                  <img src="${qrImageResult.url}" alt="QR Code for Event Check-in" class="qr-image" />
                  <p><strong>Registration Code: ${data.qrCode}</strong></p>
                  <p style="font-size: 12px; color: #666;">Save this email or take a screenshot of the QR code</p>
                  <p style="font-size: 12px; color: #666;">
                    <a href="${checkInUrl}" style="color: #667eea;">Click here if QR scanning doesn't work</a>
                  </p>
                </div>

                <div style="background: #e8f4fd; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <h4>📋 What to expect:</h4>
                  <ul>
                    <li>Arrive 15 minutes early for smooth check-in</li>
                    <li>Bring this QR code (digital or printed)</li>
                    <li>Have a valid ID ready if required</li>
                    <li>Follow event guidelines and dress code</li>
                  </ul>
                </div>

                <p>If you have any questions or need to make changes to your registration, please contact the event organizers.</p>
                
                <p>We're excited to see you at the event!</p>
                
                <p>Best regards,<br>The College Events Team</p>
              </div>
              
              <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>© 2024 College Event Management System. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw new Error("Failed to send email");
    }

    return { success: true, data: emailData, qrImageUrl: qrImageResult.url }
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw error;
  }
}

export async function sendEventUpdateEmail(
  userEmail: string,
  userName: string,
  eventTitle: string,
  updateMessage: string
) {
  try {
    const { data, error } = await resend.emails.send({
      // from: "College Events <noreply@collegeevents.com>",
      from: "College Events <noreply@cosatc.com>",
      to: [userEmail],
      subject: `Event Update: ${eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Event Update</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .update-box { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f5576c; }
              .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📢 Event Update</h1>
                <p>${eventTitle}</p>
              </div>
              
              <div class="content">
                <p>Hi ${userName},</p>
                <p>We have an important update regarding your registered event:</p>
                
                <div class="update-box">
                  <h3>Update Details:</h3>
                  <p>${updateMessage}</p>
                </div>

                <p>Please make note of this update and adjust your plans accordingly.</p>
                
                <p>If you have any questions, please contact the event organizers.</p>
                
                <p>Thank you for your understanding!</p>
                
                <p>Best regards,<br>The College Events Team</p>
              </div>
              
              <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>© 2024 College Event Management System. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw new Error("Failed to send email");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending update email:", error);
    throw error;
  }
}
