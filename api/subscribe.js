// api/subscribe.js or server endpoint
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Newsletter subscription handler
const handleNewsletterSubscription = async (email) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFICATION_EMAIL,
    subject: '🔔 New NovaNexus Newsletter Subscription',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📧 New Newsletter Subscription</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0;">Subscription Details</h2>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>🌐 Source:</strong> Newsletter Popup</p>
          </div>
          
          <div style="background: #dcfce7; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #166534;"><strong>Action Required:</strong> Add this email to your newsletter list!</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>This notification was sent from NovaNexus website</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Contact form submission handler
const handleContactForm = async (formData) => {
  const transporter = createTransporter();
  const { name, email, company, message } = formData;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFICATION_EMAIL,
    subject: '💼 New Contact Form Submission - NovaNexus',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">💼 New Contact Form Submission</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0;">Contact Details</h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 8px 0;"><strong>👤 Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></p>
            ${company ? `<p style="margin: 8px 0;"><strong>🏢 Company:</strong> ${company}</p>` : ''}
            <p style="margin: 8px 0;"><strong>📅 Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #92400e;">💬 Message:</h3>
            <p style="margin: 0; color: #92400e; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;"><strong>Next Steps:</strong> Reply to this contact within 24 hours for best customer experience!</p>
          </div>
          
          <div style="text-align: center; margin-top: 25px;">
            <a href="mailto:${email}?subject=Re: Your inquiry about NovaNexus" 
               style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
              📧 Reply to ${name}
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>This notification was sent from NovaNexus contact form</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Main API handler (for Express.js)
const subscribeHandler = async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { email, name, company, message, type } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.NOTIFICATION_EMAIL) {
      console.error('Missing email configuration in environment variables');
      return res.status(500).json({ 
        success: false, 
        message: 'Email service not configured' 
      });
    }

    // Determine submission type and handle accordingly
    if (type === 'contact' || (name && message)) {
      // Contact form submission
      if (!name || !message) {
        return res.status(400).json({ 
          success: false, 
          message: 'Name and message are required for contact form' 
        });
      }

      await handleContactForm({ name, email, company, message });
      
      console.log('Contact form submitted:', { name, email, company: company || 'Not provided' });
      
      return res.status(200).json({ 
        success: true, 
        message: 'Contact form submitted successfully! We\'ll get back to you soon.' 
      });

    } else {
      // Newsletter subscription
      await handleNewsletterSubscription(email);
      
      console.log('Newsletter subscription:', email);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Successfully subscribed to newsletter!' 
      });
    }

  } catch (error) {
    console.error('Email service error:', error);
    
    // Handle specific email errors
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        success: false, 
        message: 'Email authentication failed. Please check your email configuration.' 
      });
    }
    
    if (error.code === 'ENOTFOUND') {
      return res.status(500).json({ 
        success: false, 
        message: 'Email service unavailable. Please try again later.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Failed to process your request. Please try again later.' 
    });
  }
};

// Export for different environments
module.exports = subscribeHandler;

// For ES6 modules (if needed)
// export default subscribeHandler;