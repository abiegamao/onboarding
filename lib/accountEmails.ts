import resend from "@/lib/resend"

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

export async function sendAccountActivatedEmail(params: {
    email: string
    firstName?: string
}) {
    const { email, firstName } = params
    const safeName = escapeHtml((firstName || "there").trim())
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"
    const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/dashboard`
        : "https://example.com/dashboard"

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Activated</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f7f4ec;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f7f4ec;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #eadfc8;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:0;background:linear-gradient(135deg,#b6954a,#d4b483);">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="padding:18px 24px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#ffffff;font-weight:700;">
                      MINESHA Onboarding
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px 8px 24px;">
                <p style="margin:0 0 10px 0;font-size:16px;line-height:24px;color:#374151;">Hi ${safeName},</p>
                <h1 style="margin:0 0 14px 0;font-family:Georgia,\"Times New Roman\",serif;font-size:30px;line-height:36px;color:#1f2937;font-weight:700;">Congratulations, your account is now active.</h1>
                <p style="margin:0 0 14px 0;font-size:15px;line-height:24px;color:#4b5563;">
                  You can now start your course and begin the Peace-Driven Leader journey.
                </p>
                <p style="margin:0 0 22px 0;font-size:15px;line-height:24px;color:#4b5563;">
                  Your dashboard is ready with your onboarding steps and progress tracker.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px 0;">
                  <tr>
                    <td align="center" bgcolor="#b6954a" style="border-radius:8px;">
                      <a href="${dashboardUrl}" style="display:inline-block;padding:12px 20px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Go to Dashboard</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 22px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #f0e6d3;border-radius:10px;background-color:#fcfaf5;">
                  <tr>
                    <td style="padding:12px 14px;font-size:13px;line-height:20px;color:#6b7280;">
                      Need help getting started? Reply to this email and our team will guide you.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px 24px 24px;border-top:1px solid #f5efe3;font-size:12px;line-height:18px;color:#9ca3af;">
                You are receiving this email because your account status was updated by the MINESHA team.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`

    const text = `Hi ${firstName || "there"},\n\nCongratulations, your account is now active.\nYou can now start your course and begin the Peace-Driven Leader journey.\n\nOpen your dashboard: ${dashboardUrl}\n\nIf you need help getting started, reply to this email.\n`

    const { error } = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: "Your account is now active",
        html,
        text,
    })

    if (error) {
        throw new Error(error.message || "Failed to send activation email")
    }
}
