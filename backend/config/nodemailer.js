import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('📧 Email service connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Email service connection failed:', error);
    return false;
  }
};

// Send email function
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"ApniEstate" <${process.env.EMAIL}>`,
      to: to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email send failed:', error);
    throw new Error('Failed to send email');
  }
};

// Email templates
export const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to ApniEstate! 🏠',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to ApniEstate, ${name}! 🎉</h2>
        <p>Thank you for joining our real estate platform. We're excited to help you find your perfect property!</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>Browse thousands of properties</li>
          <li>Schedule property viewings</li>
          <li>Get AI-powered property recommendations</li>
          <li>Save your favorite listings</li>
        </ul>
        <p>Happy house hunting! 🏡</p>
        <br>
        <p>Best regards,<br>The ApniEstate Team</p>
      </div>
    `
  }),

  passwordReset: (resetLink) => ({
    subject: 'Reset Your ApniEstate Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetLink}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <br>
        <p>Best regards,<br>The ApniEstate Team</p>
      </div>
    `
  }),

  appointmentConfirmation: (appointment) => ({
    subject: 'Appointment Confirmed - ApniEstate',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Appointment Confirmed! ✅</h2>
        <p>Your property viewing appointment has been confirmed:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Property:</strong> ${appointment.propertyTitle}</p>
          <p><strong>Date:</strong> ${appointment.date}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Location:</strong> ${appointment.location}</p>
        </div>
        <p>We'll see you there! If you need to reschedule, please contact us.</p>
        <br>
        <p>Best regards,<br>The ApniEstate Team</p>
      </div>
    `
  })
};

export default transporter;
