const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const List_Property = require('../models/ListProperty'); // Updated model name
const nodemailer = require('nodemailer');
const sharp = require('sharp');


// Route to list your property
// router.post('/add', async (req, res) => {
//     try {
//         const { name, phoneNumber, email, location, message, propertyType, propertyImages } = req.body;

//         console.log('req.body==>', req.body)

//         // Validate input data
//         if (!name || !phoneNumber || !email || !location || !message) {
//             return res.status(400).json({ message: 'All fields are required!' });
//         }

//         // Create a new Property instance
//         const newProperty = new List_Property({
//             name,
//             phoneNumber,
//             email,
//             location,
//             message,
//             propertyType,
//             propertyImages: ['jdsl'], // This can be removed if not required
//         });

//         console.log('new property==>', newProperty)

//         // Create a folder to store property images
//         const propertyFolderPath = path.join(__dirname, '..', 'uploads', 'properties', newProperty._id.toString());
//         if (!fs.existsSync(propertyFolderPath)) {
//             fs.mkdirSync(propertyFolderPath, { recursive: true });
//         }

//         // Save property images
//         const imagePaths = [];
//         if (propertyImages && Array.isArray(propertyImages)) {
//             for (let i = 0; i < propertyImages.length; i++) {
//                 const imageBase64 = propertyImages[i];
//                 const imageName = `property_${i + 1}_${Date.now()}.jpg`;
//                 const imagePath = path.join(propertyFolderPath, imageName);
//                 const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
//                 fs.writeFileSync(imagePath, imageBuffer);
//                 imagePaths.push(imageName);
//             }
//         }

//         // Add the image paths to the property object
//         newProperty.propertyImages = imagePaths;

//         // Save the new property to the database
//         const savedProperty = await newProperty.save();

//         // Set up Nodemailer transporter
//         const transporter = nodemailer.createTransport({
//             host: 'smtpout.secureserver.net', // Use the correct SMTP server
//             port: 465, // SSL port for secure connection
//             secure: true, // Set to true for SSL
//             auth: {
//                 user: process.env.EMAIL_USER, // Your email address
//                 pass: process.env.EMAIL_PASSWORD, // Your email password
//             },
//             debug: true, // Debugging info for troubleshooting
//             logger: true, // Log transport activity
//         });



//         const mailOptions = {
//             from: '"Placezio Estate" <info@placezioestate.com>', // Sender address
//             to: email, // Recipient address
//             subject: 'Your Property Listing on Placezio Estate',
//             html: `
//               <html>
//     <head>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 margin: 0;
//                 padding: 0;
//                 background-color: #f4f4f4;
//             }
//             .container {
//                 width: 100%;
//                 max-width: 600px;
//                 margin: 0 auto;
//                 padding: 20px;
//                 background-color: #ffffff;
//                 border-radius: 8px;
//                 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//             }
//             .header {
//                 text-align: center;
//                 padding: 20px 0;
//                 background-color: #2d5d3b;
//                 color: #ffffff;
//                 border-radius: 8px 8px 0 0;
//             }
//             .header img {
//                 width: 120px;
//                 height: 120px;
//                 border-radius: 50%;
//             }
//             .content {
//                 padding: 20px;
//                 font-size: 16px;
//                 color: #333;
//             }
//             .content p {
//                 line-height: 1.5;
//             }
//             .property-details {
//                 margin-top: 20px;
//                 background-color: #f9f9f9;
//                 padding: 15px;
//                 border-radius: 5px;
//             }
//             .property-details div {
//                 margin-bottom: 12px;
//             }
//             .property-details label {
//                 font-weight: bold;
//                 color: #2d5d3b;
//             }
//             .footer {
//                 text-align: center;
//                 font-size: 14px;
//                 margin-top: 30px;
//                 color: #777;
//                 border-top: 1px solid #ddd;
//                 padding-top: 15px;
//             }
//             .footer a {
//                 color: #2d5d3b;
//                 text-decoration: none;
//             }
//             .button {
//                 display: inline-block;
//                 padding: 12px 25px;
//                 background-color: #54BD95;
//                 color: white;
//                 text-decoration: none;
//                 border-radius: 5px;
//                 margin-top: 20px;
//                 font-weight: bold;
//                 text-align: center;
//             }
//             .button:hover {
//                 background-color: #468f6e;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="container">
//             <div class="header">
//                 <img src="https://i.imgur.com/vWqstSi.png" alt="Placezio Estate Logo">
//                 <h1>Thank You for Listing Your Property with Us!</h1>
//             </div>
//             <div class="content">
//                 <p>Dear ${name},</p>
//                 <p>We sincerely appreciate you choosing Placezio Estate to list your property. Our team will contact you soon for further steps. Below are the details of your listing:</p>

//                 <div class="property-details">
//                     <div><label>Property Type:</label> ${propertyType}</div>
//                     <div><label>Property Location:</label> ${location}</div>
//                     <div><label>Phone Number:</label> ${phoneNumber}</div>
//                     <div><label>Email:</label> ${email}</div>
//                     <div><label>Message:</label> ${message}</div>
//                 </div>



//                 <a href="https://placezioestate.com" class="button">Visit Placezio Estate</a>
//             </div>
//             <div class="footer">
//                 <p>Placezio Estate | Designed for Living, Built for You</p>
//                 <p>If you have any questions, feel free to contact us at <a href="mailto:info@placezioestate.com">info@placezioestate.com</a></p>
//                 <p>&copy; ${new Date().getFullYear()} Placezio Estate. All rights reserved.</p>
//             </div>
//         </div>
//     </body>
// </html>

//             `, // HTML body content
//         };


//         // await transporter.sendMail(mailOptions);

//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.messageId);


//         res.status(201).json({ message: 'Property listed successfully!', property: savedProperty });
//     } catch (error) {
//         console.error('Error listing property:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });





// Route to list your property
router.post('/add', async (req, res) => {
    try {
        const { name, phoneNumber, email, location, message, propertyType, propertyImages } = req.body;

        console.log('req.body==>', req.body);

        // Validate input data
        if (!name || !phoneNumber || !email || !location || !message) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Create a new Property instance
        const newProperty = new List_Property({
            name,
            phoneNumber,
            email,
            location,
            message,
            propertyType,
            propertyImages: [],
        });

        console.log('new property==>', newProperty);

        // Create a folder to store property images
        const propertyFolderPath = path.join(__dirname, '..', 'uploads', 'properties', newProperty._id.toString());
        if (!fs.existsSync(propertyFolderPath)) {
            fs.mkdirSync(propertyFolderPath, { recursive: true });
        }

        // Save and compress property images using Sharp
        const imagePaths = [];
        if (propertyImages && Array.isArray(propertyImages)) {
            for (let i = 0; i < propertyImages.length; i++) {
                const imageBase64 = propertyImages[i];
                const imageName = `property_${i + 1}_${Date.now()}.webp`; // Save as .webp for better compression
                const imagePath = path.join(propertyFolderPath, imageName);

                // Convert Base64 to Buffer and Compress
                const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                await sharp(imageBuffer)
                    .resize(800) // Resize width to 800px (height auto)
                    .toFormat('webp', { quality: 70 }) // Convert to WebP with 70% quality
                    .toFile(imagePath);

                imagePaths.push(imageName);
            }
        }

        // Add compressed image paths to the property object
        newProperty.propertyImages = imagePaths;

        // Save the new property to the database
        const savedProperty = await newProperty.save();

        // Set up Nodemailer transporter
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

        const mailOptions = {
            from: '"Placezio Estate" <info@placezioestate.com>',
            to: email,
            subject: 'Your Property Listing on Placezio Estate',
            html: `
              <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 20px 0;
                background-color: #2d5d3b;
                color: #ffffff;
                border-radius: 8px 8px 0 0;
            }
            .header img {
                width: 120px;
                height: 120px;
                border-radius: 50%;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
            }
            .content p {
                line-height: 1.5;
            }
            .property-details {
                margin-top: 20px;
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
            }
            .property-details div {
                margin-bottom: 12px;
            }
            .property-details label {
                font-weight: bold;
                color: #2d5d3b;
            }
            .footer {
                text-align: center;
                font-size: 14px;
                margin-top: 30px;
                color: #777;
                border-top: 1px solid #ddd;
                padding-top: 15px;
            }
            .footer a {
                color: #2d5d3b;
                text-decoration: none;
            }
            .button {
                display: inline-block;
                padding: 12px 25px;
                background-color: #54BD95;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                font-weight: bold;
                text-align: center;
            }
            .button:hover {
                background-color: #468f6e;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://i.imgur.com/vWqstSi.png" alt="Placezio Estate Logo">
                <h1>Thank You for Listing Your Property with Us!</h1>
            </div>
            <div class="content">
                <p>Dear ${name},</p>
                <p>We sincerely appreciate you choosing Placezio Estate to list your property. Our team will contact you soon for further steps. Below are the details of your listing:</p>

                <div class="property-details">
                    <div><label>Property Type:</label> ${propertyType}</div>
                    <div><label>Property Location:</label> ${location}</div>
                    <div><label>Phone Number:</label> ${phoneNumber}</div>
                    <div><label>Email:</label> ${email}</div>
                    <div><label>Message:</label> ${message}</div>
                </div>

                <a href="https://placezioestate.com" class="button">Visit Placezio Estate</a>
            </div>
            <div class="footer">
                <p>Placezio Estate | Designed for Living, Built for You</p>
                <p>If you have any questions, feel free to contact us at <a href="mailto:info@placezioestate.com">info@placezioestate.com</a></p>
                <p>&copy; ${new Date().getFullYear()} Placezio Estate. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>
            `,
        };

        // Send email notification
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);

        res.status(201).json({ message: 'Property listed successfully!', property: savedProperty });
    } catch (error) {
        console.error('Error listing property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




router.get('/all-properties', async (req, res) => {
    try {
        // Get page and limit parameters from query string
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

        // Calculate the number of documents to skip based on page and limit
        const skip = (page - 1) * limit;

        // Fetch properties with pagination and sort by latest first
        const properties = await List_Property.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by latest created date (descending)

        // Get the total number of properties to calculate the total pages
        const totalProperties = await List_Property.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalProperties / limit);

        // Check if no properties are found
        if (properties.length === 0) {
            return res.status(404).json({ message: 'No properties found' });
        }

        // Respond with the properties and pagination information
        res.status(200).json({
            message: 'Properties retrieved successfully',
            properties,
            pagination: {
                totalProperties,
                totalPages,
                currentPage: page,
                itemsPerPage: limit,
            },
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Failed to fetch properties. Please try again later.' });
    }
});

// Route to get property details by ID
router.get('/property/:id', async (req, res) => {
    try {
        const propertyId = req.params.id;
        const property = await List_Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json({
            message: "Property found successfully", property: property
        });
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to delete a listed property by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const propertyId = req.params.id;

        // Fetch the property from the database
        const property = await List_Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Delete property images from the server
        const propertyFolderPath = path.join(__dirname, '..', 'uploads', 'properties', property._id.toString());

        if (fs.existsSync(propertyFolderPath)) {
            const files = fs.readdirSync(propertyFolderPath);

            // Remove each image file
            files.forEach(file => {
                const filePath = path.join(propertyFolderPath, file);
                fs.unlinkSync(filePath); // Delete the image file
            });

            // Remove the property folder itself
            fs.rmdirSync(propertyFolderPath, { recursive: true });
        }

        // Delete the property from the database
        await List_Property.findByIdAndDelete(propertyId);

        res.status(200).json({ message: 'Property and its images deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
