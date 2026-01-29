import { transporter } from "../../transporter";

const sender = process.env.NODEMAILER_EMAIL;

export async function sendAdminVerificationEmail({
  to,
  subject,
  url,
}: {
  to: string;
  subject: string;
  url: string;
}) {
  await transporter.sendMail({
    from: "rsa22027@gmail.com",
    to,
    replyTo: sender,
    subject,
    html: `
    <!DOCTYPE html>
            <body>
                <p>${url}</p>
            </body>
    `,
  });
}
