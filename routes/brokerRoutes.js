const express = require("express");
const Broker = require("../models/Broker");
const nodemailer = require("nodemailer");
const router = express.Router();


const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    debug: true,
    logger: true,
});

// POST: Add a new broker
router.post("/add", async (req, res) => {

    try {
        const { name, number, email, workingArea, experience, sellRent, commercialResidentials } = req.body;
        console.log("data form algent form",req.body)

        if (!name || !number  || !workingArea || !experience || !sellRent || !commercialResidentials) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        console.log("data form algent below form",req.body)


        const broker = new Broker({ name, number, email, workingArea, experience, sellRent, commercialResidentials });


        await broker.save();

        // If email is provided, send a welcome email
        if (broker.email) {
            const mailOptions = {
                from: '"Placezio Estate" <info@placezioestate.com>',
                to: email,
                subject: 'Welcome to Placezio Estate Partnership',
                html: `
                  <html>
                  <head>
                      <style>
                          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
                          .container { max-width: 600px; margin: 20px auto; padding: 20px; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                          .header { text-align: center; padding: 20px; background: #2d5d3b; color: #fff; border-radius: 8px 8px 0 0; }
                          .content { padding: 20px; font-size: 16px; color: #333; }
                          .footer { text-align: center; font-size: 14px; margin-top: 30px; color: #777; border-top: 1px solid #ddd; padding-top: 15px; }
                          .button { display: inline-block; padding: 12px 25px; background: #54BD95; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
                          .button:hover { background: #468f6e; }
                      </style>
                  </head>
                  <body>
                      <div class="container">
                          <div class="header">
                              <h1>Welcome to Placezio Estate Partnership!</h1>
                          </div>
                          <div class="content">
                              <p>Dear ${name},</p>
                              <p>Congratulations on taking a great step by joining Placezio Estate as a partner broker. We are excited to collaborate with you and help you connect with clients efficiently.</p>
                              <p>We believe that our platform will provide you with valuable opportunities to grow your business.</p>
                              <a href="https://placezioestate.com" class="button">Visit Placezio Estate</a>
                          </div>
                          <div class="footer">
                              <p>Placezio Estate | Your Trusted Real Estate Partner</p>
                              <p>If you have any questions, contact us at <a href="mailto:info@placezioestate.com">info@placezioestate.com</a></p>
                              <p>&copy; ${new Date().getFullYear()} Placezio Estate. All rights reserved.</p>
                          </div>
                      </div>
                  </body>
                  </html>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Email Error:", error);
                } else {
                    console.log("Email sent:", info.response);
                }
            });
        }

        res.status(201).json({ success: true, message: "Broker added successfully", broker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// GET: Retrieve all brokers (latest first) with pagination
router.get("/all", async (req, res) => {
    try {
        let { page, limit } = req.query;

        // Convert page & limit to numbers and set defaults
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const skip = (page - 1) * limit;

        // Fetch brokers with sorting and pagination
        const brokers = await Broker.find()
            .sort({ createdAt: -1 }) // Latest first
            .skip(skip) // Skip previous pages
            .limit(limit); // Limit the number of brokers per page

        // Get total count for pagination metadata
        const totalBrokers = await Broker.countDocuments();

        res.status(200).json({
            success: true,
            brokers,
            totalBrokers,
            totalPages: Math.ceil(totalBrokers / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



// PUT: Update a broker by ID
router.put("/update/:id", async (req, res) => {
    try {
        const updatedBroker = await Broker.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBroker) return res.status(404).json({ success: false, message: "Broker not found" });

        res.status(200).json({ success: true, message: "Broker updated successfully", updatedBroker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE: Remove a broker by ID
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedBroker = await Broker.findByIdAndDelete(req.params.id);
        if (!deletedBroker) return res.status(404).json({ success: false, message: "Broker not found" });
        res.status(200).json({ success: true, message: "Broker deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
