const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const SellProperty = require('../models/SellProperty');

router.post('/add-sell-property', async (req, res) => {
    try {
        const {
            mainImage,
            otherImages,
            propertyPrice,
            area,
            furnishedType,
            bhk,
            bed,
            bathroom,
            address,
            balcony,
            description
        } = req.body;

        console.log('request -====>', req.body);
        if (!mainImage || !propertyPrice || !area || !furnishedType || !bhk || !bed || !bathroom || !balcony || !description || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new SellProperty instance but do not save images yet
        const newSellProperty = new SellProperty({
            mainImage: 'a',
            otherImages: [],
            propertyPrice,
            area,
            furnishedType,
            bhk,
            bed,
            address,
            bathroom,
            balcony,
            description
        });

        // Save SellProperty to the database to generate the _id
        await newSellProperty.save();

        // Create a folder for the property using the _id
        const propertyFolderPath = path.join(__dirname, '..', 'uploads', 'properties', newSellProperty._id.toString());
        if (!fs.existsSync(propertyFolderPath)) {
            fs.mkdirSync(propertyFolderPath, { recursive: true });
        }

        // Save the main image
        const mainImageName = `main_${Date.now()}.jpg`;
        const mainImagePath = path.join(propertyFolderPath, mainImageName);
        const base64MainImage = mainImage.replace(/^data:image\/\w+;base64,/, '');
        const mainImageBuffer = Buffer.from(base64MainImage, 'base64');
        fs.writeFileSync(mainImagePath, mainImageBuffer);

        // Save other images (if provided)
        const otherImagePaths = [];
        if (otherImages) {
            const parsedOtherImages = JSON.parse(otherImages);
            for (let i = 0; i < parsedOtherImages.length; i++) {
                const imageBase64 = parsedOtherImages[i];
                const imageName = `other_${i + 1}_${Date.now()}.jpg`;
                const imagePath = path.join(propertyFolderPath, imageName);
                const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                fs.writeFileSync(imagePath, imageBuffer);
                otherImagePaths.push(imageName);
            }
        }

        // Update the SellProperty with the image paths
        newSellProperty.mainImage = mainImageName;
        newSellProperty.otherImages = otherImagePaths;

        // Save the updated SellProperty to the database
        await newSellProperty.save();

        // Return a response with the added property's info
        res.status(201).json({
            message: 'Property added successfully!',
            id: newSellProperty._id, property: newSellProperty,
        });
    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});






router.put('/update-sell-property', async (req, res) => {
    try {
        const { _id } = req.body;
        const {
            mainImage,
            otherImages,
            propertyPrice,
            area,
            furnishedType,
            bhk,
            bed,
            address,
            bathroom,
            balcony,
            description
        } = req.body;

        console.log('Updating property -====>', req.body);

        const property = await SellProperty.findById(_id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (propertyPrice) property.propertyPrice = propertyPrice;
        if (area) property.area = area;
        if (furnishedType) property.furnishedType = furnishedType;
        if (bhk) property.bhk = bhk;
        if (bed) property.bed = bed;
        if (bathroom) property.bathroom = bathroom;
        if (balcony) property.balcony = balcony;
        if (description) property.description = description;
        if(address) property.address = address

        const propertyFolderPath = path.join(__dirname, '..', 'uploads', 'properties', _id.toString());
        if (!fs.existsSync(propertyFolderPath)) {
            fs.mkdirSync(propertyFolderPath, { recursive: true });
        }

        if (mainImage) {
            const mainImageName = `main_${Date.now()}.jpg`;
            const mainImagePath = path.join(propertyFolderPath, mainImageName);
            const base64MainImage = mainImage.replace(/^data:image\/\w+;base64,/, '');
            const mainImageBuffer = Buffer.from(base64MainImage, 'base64');
            fs.writeFileSync(mainImagePath, mainImageBuffer);
            property.mainImage = mainImageName;
        }

        if (otherImages) {
            const parsedOtherImages = JSON.parse(otherImages);
            const otherImagePaths = [];
            for (let i = 0; i < parsedOtherImages.length; i++) {
                const imageBase64 = parsedOtherImages[i];
                const imageName = `other_${i + 1}_${Date.now()}.jpg`;
                const imagePath = path.join(propertyFolderPath, imageName);
                const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                fs.writeFileSync(imagePath, imageBuffer);
                otherImagePaths.push(imageName);
            }
            property.otherImages = otherImagePaths;
        }

        await property.save();

        res.status(200).json({
            message: 'Property updated successfully!',
            property,
        });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
});

// router.put('/update-sell-property', async (req, res) => {
//     try {
//         const { _id } = req.body;
//         const {
//             propertyPrice,
//             area,
//             furnishedType,
//             bhk,
//             bed,
//             bathroom,
//             balcony,
//             description
//         } = req.body;

//         console.log('Updating property -====>', req.body);

//         const property = await SellProperty.findById(_id);
//         if (!property) {
//             return res.status(404).json({ message: 'Property not found' });
//         }

//         if (propertyPrice) property.propertyPrice = propertyPrice;
//         if (area) property.area = area;
//         if (furnishedType) property.furnishedType = furnishedType;
//         if (bhk) property.bhk = bhk;
//         if (bed) property.bed = bed;
//         if (bathroom) property.bathroom = bathroom;
//         if (balcony) property.balcony = balcony;
//         if (description) property.description = description;

//         await property.save();

//         res.status(200).json({
//             message: 'Property updated successfully!',
//             property: { id: property._id, propertyPrice: property.propertyPrice, area: property.area },
//         });
//     } catch (error) {
//         console.error('Error updating property:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });




router.get('/get-all-sell-properties', async (req, res) => {
    try {
        const properties = await SellProperty.find();
        res.status(200).json({
            message: 'Properties fetched successfully!',
            properties,
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Fetch society by ID
router.get('/get-sell-property/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the society by ID
        const sellProperty = await SellProperty.findById(id);
        if (!sellProperty) {
            return res.status(404).json({ message: 'Society not found' });
        }

        // Return the society details
        res.status(200).json({
            message: 'Property fetched successfully!',
            sellProperty,
        });
    } catch (error) {
        console.error('Error fetching Property by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/delete-sell-property/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the property by ID
        const property = await SellProperty.findById(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Delete the property images from the file system
        const propertyFolderPath = path.join(__dirname, '..', 'uploads', 'properties', id.toString());

        // Check if the folder exists and remove the images
        if (fs.existsSync(propertyFolderPath)) {
            // Delete all files in the property folder
            const files = fs.readdirSync(propertyFolderPath);
            files.forEach(file => {
                const filePath = path.join(propertyFolderPath, file);
                fs.unlinkSync(filePath); // Remove the file
            });

            // Remove the property folder itself
            fs.rmdirSync(propertyFolderPath);
        }

        // Delete the property from the database
        await SellProperty.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Property and its images deleted successfully!',
        });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;