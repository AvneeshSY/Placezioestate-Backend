const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const RentApartment = require('../models/RentApartment')
const Society = require('../models/SocietyRent');
const sharp = require("sharp");


// router.post('/add', async (req, res) => {
//     try {
//         const { societyId, societyName, furnished, bhk, facilities, address, mapLocation, price, description, mainImage, otherImages } = req.body;

//         if (!societyId || !societyName || !furnished || !bhk || !facilities || !address || !mapLocation || !price || !description || !mainImage) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // Create new RentApartment instance without storing images yet
//         const rentApartment = new RentApartment({
//             societyId,
//             societyName,
//             furnished,
//             bhk,
//             facilities,
//             address,
//             mapLocation,
//             price,
//             description,
//             mainImage: 'a', // Temporary placeholder
//             otherImages: [],
//         });

//         // Save to DB first to generate _id
//         await rentApartment.save();

//         // Create folder for apartment images
//         const apartmentFolderPath = path.join(__dirname, '..', 'uploads', 'rent_apartments', rentApartment._id.toString());
//         if (!fs.existsSync(apartmentFolderPath)) {
//             fs.mkdirSync(apartmentFolderPath, { recursive: true });
//         }

//         // Save main image
//         const mainImageName = `main_${Date.now()}.jpg`;
//         const mainImagePath = path.join(apartmentFolderPath, mainImageName);
//         const base64MainImage = mainImage.replace(/^data:image\/\w+;base64,/, '');
//         fs.writeFileSync(mainImagePath, Buffer.from(base64MainImage, 'base64'));

//         // Save other images
//         let otherImagePaths = [];
//         if (otherImages) {
//             const parsedOtherImages = JSON.parse(otherImages); // Ensure it's an array
//             for (let i = 0; i < parsedOtherImages.length; i++) {
//                 const imageBase64 = parsedOtherImages[i];
//                 const imageName = `other_${i + 1}_${Date.now()}.jpg`;
//                 const imagePath = path.join(apartmentFolderPath, imageName);
//                 fs.writeFileSync(imagePath, Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64'));
//                 otherImagePaths.push(imageName);
//             }
//         }

//         // Update RentApartment with actual image paths
//         rentApartment.mainImage = mainImageName;
//         rentApartment.otherImages = otherImagePaths;
//         await rentApartment.save();

//         res.status(201).json({ message: 'Rent Apartment created successfully', rentApartment });
//     } catch (error) {
//         console.error('Error adding rent apartment:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


router.post("/add", async (req, res) => {
    try {
        const { societyId, societyName, furnished, bhk, facilities, address, mapLocation, price, description, mainImage, otherImages } = req.body;

        if (!societyId || !societyName || !furnished || !bhk || !facilities || !address || !mapLocation || !price || !description || !mainImage) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new RentApartment instance without storing images yet
        const rentApartment = new RentApartment({
            societyId,
            societyName,
            furnished,
            bhk,
            facilities,
            address,
            mapLocation,
            price,
            description,
            mainImage: "", // Placeholder
            otherImages: [],
        });

        // Save to DB first to generate _id
        await rentApartment.save();

        // Create folder for apartment images
        const apartmentFolderPath = path.join(__dirname, "..", "uploads", "rent_apartments", rentApartment._id.toString());
        if (!fs.existsSync(apartmentFolderPath)) {
            fs.mkdirSync(apartmentFolderPath, { recursive: true });
        }

        // Process and Save Main Image
        const mainImageName = `main_${Date.now()}.webp`; // Save as WebP for better compression
        const mainImagePath = path.join(apartmentFolderPath, mainImageName);
        const mainImageBuffer = Buffer.from(mainImage.replace(/^data:image\/\w+;base64,/, ""), "base64");

        await sharp(mainImageBuffer)
            .resize(800) // Resize to 800px width, auto height
            .toFormat("webp", { quality: 75 }) // Convert to WebP with 75% quality
            .toFile(mainImagePath);

        // Process and Save Other Images
        let otherImagePaths = [];
        if (otherImages) {
            const parsedOtherImages = JSON.parse(otherImages); 
            for (let i = 0; i < parsedOtherImages.length; i++) {
                const imageBase64 = parsedOtherImages[i];
                const imageName = `other_${i + 1}_${Date.now()}.webp`;
                const imagePath = path.join(apartmentFolderPath, imageName);
                const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");

                await sharp(imageBuffer)
                    .resize(600) // Resize to 600px width
                    .toFormat("webp", { quality: 70 }) // Convert to WebP with 70% quality
                    .toFile(imagePath);

                otherImagePaths.push(imageName);
            }
        }

        // Update RentApartment with actual image paths
        rentApartment.mainImage = mainImageName;
        rentApartment.otherImages = otherImagePaths;
        await rentApartment.save();

        res.status(201).json({ message: "Rent Apartment created successfully", rentApartment });
    } catch (error) {
        console.error("Error adding rent apartment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/rent-apartments', async (req, res) => {
    try {
        const { minPrice, maxPrice, bhk, page = 1, limit = 50 } = req.query;
        let filter = {};

        if (minPrice && maxPrice) {
            filter.price = { $gte: minPrice, $lte: maxPrice };
        }
        if (bhk) {
            filter.bhk = bhk;
        }

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const rentApartments = await RentApartment.find(filter)
            .sort({ createdAt: -1 }) // Sort by latest first
            .skip(skip)
            .limit(limitNumber);

        const totalApartments = await RentApartment.countDocuments(filter);
        const totalPages = Math.ceil(totalApartments / limitNumber);

        res.status(200).json({
            totalApartments,
            totalPages,
            currentPage: pageNumber,
            apartments: rentApartments,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/search", async (req, res) => {
    try {
        const { keyword } = req.query;

        console.log('Search Query:', req.query);

        if (!keyword) {
            return res.status(400).json({ message: "Keyword is required" });
        }

        const results = await RentApartment.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { societyName: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { address: { $regex: keyword, $options: "i" } } // Added address field
            ],
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/society/:societyId', async (req, res) => {
    try {
        const { societyId } = req.params;

        // Find the society details
        const society = await Society.findById(societyId);
        if (!society) {
            return res.status(404).json({ message: 'Society not found' });
        }

        const rentApartments = await RentApartment.find({ societyId });
        res.status(200).json({
            message: 'Success',
            society,
            rentApartments
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rentApartment = await RentApartment.findById(id);
        if (!rentApartment) {
            return res.status(404).json({ message: 'Rent Apartment not found' });
        }
        res.status(200).json(rentApartment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/update-rent-apartments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find the apartment
        let rentApartment = await RentApartment.findById(id);
        if (!rentApartment) {
            return res.status(404).json({ message: 'Rent Apartment not found' });
        }

        // Update fields (excluding images)
        Object.assign(rentApartment, updates);

        // Save updated apartment
        await rentApartment.save();
        res.status(200).json({ message: 'Rent Apartment updated successfully', rentApartment });
    } catch (error) {
        console.error('Error updating rent apartment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/delete-rent-apartments/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the apartment
        const rentApartment = await RentApartment.findById(id);
        if (!rentApartment) {
            return res.status(404).json({ message: 'Rent Apartment not found' });
        }

        // Delete images from file system
        const apartmentFolderPath = path.join(__dirname, '..', 'uploads', 'rent_apartments', id);
        if (fs.existsSync(apartmentFolderPath)) {
            fs.rmSync(apartmentFolderPath, { recursive: true, force: true }); // Deletes folder and all files
        }

        // Delete from database
        await RentApartment.findByIdAndDelete(id);

        res.status(200).json({ message: 'Rent Apartment deleted successfully' });
    } catch (error) {
        console.error('Error deleting rent apartment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;