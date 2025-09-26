const express = require('express');
const Requirement = require('../models/Requirement');
const nodemailer = require('nodemailer');

const router = express.Router();

// POST API to create a requirement
router.post('/requirements', async (req, res) => {
  const { name, mobileNumber, email, requirement, gender, purpose } = req.body;

  // Validate required fields
  if (!name || !mobileNumber || !email || !requirement) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    // Create a new Requirement instance
    const newRequirement = new Requirement({ name, mobileNumber, email, requirement ,  gender, purpose});
    await newRequirement.save();


    // Respond to the client with success message
    res.status(201).json({ message: 'Requirement created successfully!', data: newRequirement });

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net', // Use the correct SMTP server
      port: 465, // SSL port for secure connection
      secure: true, // Set to true for SSL
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
      debug: true, // Debugging info for troubleshooting
      logger: true, // Log transport activity
    });

    // Email options
    const mailOptions = {
      from: '"Placezio Estate" <info@placezioestate.com>', // Sender address
      to: email, // Recipient address
      subject: 'Your Property Requirement Submission',
      html: `
          <html>
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
              <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #2d5d3b;">Thank You for Submitting Your Requirement!</h2>
                <p>Dear ${name},</p>
                <p>We have received your property requirement and will contact you shortly to discuss further details.</p>
                <p><strong>Your Requirement:</strong> ${requirement}</p>
                <p><strong>Contact Details:</strong></p>
                <ul>
                  <li>Mobile Number: ${mobileNumber}</li>
                  <li>Email: ${email}</li>
                </ul>
                <p>Our team will get in touch with you soon.</p>
                <p>Thank you for choosing Placezio Estate!</p>
                <footer style="margin-top: 20px; font-size: 12px; color: #777;">
                  <p>Placezio Estate | Designed for Living, Built for You</p>
                  <p>If you have any questions, feel free to contact us at <a href="mailto:info@placezioestate.com" style="color: #2d5d3b;">info@placezioestate.com</a></p>
                  <p>&copy; ${new Date().getFullYear()} Placezio Estate. All rights reserved.</p>
                </footer>
              </div>
            </body>
          </html>
        `, // HTML content of the email
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);


  } catch (error) {
    console.error('Error creating requirement:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/requirements', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the current page from the query, default to 1
  const limit = 20; // Set the number of items per page
  const skip = (page - 1) * limit; // Calculate how many items to skip

  try {
    // Get the total count of requirements
    const totalItems = await Requirement.countDocuments();

    // Fetch the requirements for the current page
    const requirements = await Requirement.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      message: 'Requirements fetched successfully',
      data: requirements,
      totalItems: totalItems, // Include total items for pagination
      page: page,
      limit: limit,
    });
  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
