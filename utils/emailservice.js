import nodemailers from "nodemailer";

const createTransporter = () => {
  return nodemailers.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export async function sendServiceConfirmationEmail({
  to,
  name,
  serviceType,
  applicationId,
  submittedDate,
}) {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Government Services" <${process.env.EMAIL_USER}>`,
    to,
    subject: `📩 Application Received - ${serviceType}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%); padding: 30px 20px; text-align: center;">
          <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
            📄
          </div>
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Government Services Portal</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Application Confirmation</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 22px;">Hello ${name},</h2>
          <p style="color: #495057; font-size: 16px; line-height: 1.6;">
            We have successfully received your application for the <strong>${serviceType}</strong> service.
          </p>

          <!-- Details -->
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">📋 Application Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6c757d; font-weight: 600; width: 40%;">Application ID:</td>
                <td style="padding: 8px 0; color: #495057; font-family: 'Courier New', monospace; background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${applicationId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Service Type:</td>
                <td style="padding: 8px 0; color: #495057;">${serviceType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Submitted Date:</td>
                <td style="padding: 8px 0; color: #495057;">${new Date(submittedDate).toLocaleDateString()}</td>
              </tr>
            </table>
          </div>

          <!-- Next Steps -->
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #4a5568; margin: 0 0 15px 0; font-size: 16px;">📢 What's Next?</h4>
            <ul style="color: #4a5568; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Our team will review your application shortly</li>
              <li>You will be notified of any status updates via email</li>
              <li>Use your Application ID for tracking and inquiries</li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div style="text-align: center; padding: 20px 0; border-top: 2px solid #e9ecef; margin-top: 30px;">
            <p style="color: #6c757d; margin: 0 0 10px 0; font-size: 14px;">
              📞 Need Help? Contact our support team
            </p>
            <p style="color: #6c757d; margin: 0; font-size: 14px;">
              Email: services@portal.gov | Phone: +94-11-999-8888
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; margin: 0; font-size: 12px;">
            This is an automated message from the Government Services Portal.<br>
            Please do not reply directly to this email.
          </p>
          <div style="margin-top: 15px;">
            <span style="color: #adb5bd; font-size: 12px;">
              © ${new Date().getFullYear()} Government Services Portal. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
