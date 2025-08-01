import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    // Fixed: removed 'er' from createTransporter
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send subsidy status update email
export async function sendSubsidyStatusEmail({
  to,
  name,
  applicationId,
  subsidyType,
  status,
  reviewDate,
  rejectionReason,
  adminNotes,
}) {
  // Create transporter instance
  const transporter = createTransporter();

  const getStatusInfo = (status) => {
    switch (status) {
      case "approved":
        return {
          color: "#27ae60",
          icon: "✅",
          title: "Application Approved!",
          message:
            "Congratulations! Your subsidy application has been approved.",
          bgColor: "#d4edda",
        };
      case "rejected":
        return {
          color: "#e74c3c",
          icon: "❌",
          title: "Application Update",
          message: "Unfortunately, your subsidy application has been rejected.",
          bgColor: "#f8d7da",
        };
      case "under_review":
        return {
          color: "#f39c12",
          icon: "🔍",
          title: "Application Under Review",
          message:
            "Your subsidy application is currently being reviewed by our team.",
          bgColor: "#fff3cd",
        };
      default:
        return {
          color: "#3498db",
          icon: "📋",
          title: "Application Status Update",
          message:
            "There has been an update to your subsidy application status.",
          bgColor: "#d1ecf1",
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  const mailOptions = {
    from: `"Government Subsidy Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${statusInfo.icon} Subsidy Application Update - ${statusInfo.title}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
          <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
            🏛️
          </div>
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Government Subsidy Portal</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Official Notification</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 22px;">Hello ${name},</h2>
          
          <!-- Status Banner -->
          <div style="background: ${
            statusInfo.bgColor
          }; border-left: 4px solid ${
      statusInfo.color
    }; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 24px; margin-right: 10px;">${
                statusInfo.icon
              }</span>
              <h3 style="color: ${
                statusInfo.color
              }; margin: 0; font-size: 18px;">${statusInfo.title}</h3>
            </div>
            <p style="margin: 0; color: #495057; font-size: 16px; line-height: 1.5;">${
              statusInfo.message
            }</p>
          </div>

          <!-- Application Details -->
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">📋 Application Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6c757d; font-weight: 600; width: 40%;">Application ID:</td>
                <td style="padding: 8px 0; color: #495057; font-family: 'Courier New', monospace; background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${applicationId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Subsidy Type:</td>
                <td style="padding: 8px 0; color: #495057;">${subsidyType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Current Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background: ${
                    statusInfo.color
                  }; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${status}</span>
                </td>
              </tr>
              ${
                reviewDate
                  ? `
              <tr>
                <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Review Date:</td>
                <td style="padding: 8px 0; color: #495057;">${new Date(
                  reviewDate
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</td>
              </tr>
              `
                  : ""
              }
            </table>
          </div>

          ${
            rejectionReason
              ? `
          <!-- Rejection Reason -->
          <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #e53e3e; margin: 0 0 10px 0; font-size: 16px;">❗ Reason for Rejection:</h4>
            <p style="margin: 0; color: #744210; line-height: 1.6;">${rejectionReason}</p>
          </div>
          `
              : ""
          }

          ${
            adminNotes
              ? `
          <!-- Admin Notes -->
          <div style="background: #f0f8ff; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #0c5460; margin: 0 0 10px 0; font-size: 16px;">📝 Additional Notes:</h4>
            <p style="margin: 0; color: #0c5460; line-height: 1.6;">${adminNotes}</p>
          </div>
          `
              : ""
          }

          <!-- Next Steps -->
          <div style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #4a5568; margin: 0 0 15px 0; font-size: 16px;">🎯 What's Next?</h4>
            ${
              status === "approved"
                ? `
              <ul style="color: #4a5568; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>You will receive further instructions about benefit distribution</li>
                <li>Keep your application ID for future reference</li>
                <li>Contact us if you have any questions about the process</li>
              </ul>
            `
                : status === "rejected"
                ? `
              <ul style="color: #4a5568; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>You may reapply after addressing the rejection reasons</li>
                <li>Contact our support team for clarification if needed</li>
                <li>Review the eligibility criteria before reapplying</li>
              </ul>
            `
                : `
              <ul style="color: #4a5568; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Your application is being carefully reviewed</li>
                <li>We will notify you once a decision is made</li>
                <li>No action is required from your side at this time</li>
              </ul>
            `
            }
          </div>

          <!-- Contact Info -->
          <div style="text-align: center; padding: 20px 0; border-top: 2px solid #e9ecef; margin-top: 30px;">
            <p style="color: #6c757d; margin: 0 0 10px 0; font-size: 14px;">
              📞 Need Help? Contact our support team
            </p>
            <p style="color: #6c757d; margin: 0; font-size: 14px;">
              Email: support@subsidyportal.gov | Phone: +94-11-234-5678
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; margin: 0; font-size: 12px;">
            This is an automated notification from the Government Subsidy Portal.<br>
            Please do not reply to this email. For inquiries, use our official contact channels.
          </p>
          <div style="margin-top: 15px;">
            <span style="color: #adb5bd; font-size: 12px;">
              © ${new Date().getFullYear()} Government Subsidy Portal. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
