import nodemailer from 'nodemailer';
import { ApiResponse } from '@/types/ApiResponse';
import VerificationEmail from '../../emails/verificationEmails'; // This returns React component

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // 1. Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ritikroshanyadav9696@gmail.com",
        pass: "lxwzwkegnhsaleal", // Replace with Gmail App Password
      },
    });

    // Import ReactDOMServer only on the server
    const ReactDOMServer = await import('react-dom/server');

    // 2. Render the React email component to HTML
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      VerificationEmail({ username, otp: verifyCode })
    );

    // 3. Send email
    const info = await transporter.sendMail({
      from: '"Mystery App" <ritikroshanyadav9696@gmail.com>',
      to: email,
      subject: 'Mystery Message Verification Code',
      html: htmlContent,
    });

    console.log('Message sent:', info.messageId);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
