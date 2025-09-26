const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const SocietyRent = require('../models/SocietyRent'); // Path to your SocietyRent model

router.post('/add-society-rent', async (req, res) => {
    try {
        const { name, facilities, one_bhk_rent, two_bhk_rent, three_bhk_rent, mapLocation, mainImage, otherImages } = req.body;

        // console.log('req.body==>', req.body);


        if (!name || !facilities || !one_bhk_rent || !two_bhk_rent || !three_bhk_rent || !mapLocation || !mainImage) {
            return res.status(400).json({ message: 'All required fields must be filled!' });
        }


        // Create a new SocietyRent instance
        const newSocietyRent = new SocietyRent({
            name,
            facilities,
            one_bhk_rent,
            two_bhk_rent,
            three_bhk_rent,
            mapLocation,
            mainImage: '',
            otherImages: [],
        });



        // Save to get the MongoDB _id
        const savedSocietyRent = await newSocietyRent.save();



        console.log('SocietyRent saved with ID:', savedSocietyRent._id);




        // Create a folder for this societyRent instance
        const societyFolderPath = path.join(__dirname, '..', 'uploads', 'societyRent', savedSocietyRent._id.toString());
        if (!fs.existsSync(societyFolderPath)) {
            fs.mkdirSync(societyFolderPath, { recursive: true });
        }


        console.log('6')

        // Save the main image
        const mainImageName = `main_${Date.now()}.jpg`;
        const mainImagePath = path.join(societyFolderPath, mainImageName);
        const mainImageBuffer = Buffer.from(mainImage.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        fs.writeFileSync(mainImagePath, mainImageBuffer);

        // Save the other images
        const otherImagePaths = [];
        if (otherImages) {
            const parsedOtherImages = JSON.parse(otherImages);
            for (let i = 0; i < parsedOtherImages.length; i++) {
                const imageBase64 = parsedOtherImages[i];
                const imageName = `other_${i + 1}_${Date.now()}.jpg`;
                const imagePath = path.join(societyFolderPath, imageName);
                const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                fs.writeFileSync(imagePath, imageBuffer);

                otherImagePaths.push(imageName);
            }
        }
        // Update image paths in the database
        savedSocietyRent.mainImage = mainImageName;
        savedSocietyRent.otherImages = otherImagePaths;

        // Save the updated SocietyRent with the image paths
        await savedSocietyRent.save();

        res.status(201).json({ message: 'Society Rent added successfully!', societyRent: savedSocietyRent });
    } catch (error) {
        console.error('Error adding society rent:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/update-society-rent/:id', async (req, res) => {
    try {
        const societyId = req.params.id;
        const { name, facilities, one_bhk_rent, two_bhk_rent, three_bhk_rent, mapLocation } = req.body;

        // Find the society by ID
        const society = await SocietyRent.findById(societyId);

        if (!society) {
            return res.status(404).json({ status: 404, message: 'Society not found' });
        }

        // Update only the fields that are provided in the request
        if (name) society.name = name;
        if (facilities) society.facilities = facilities;
        if (one_bhk_rent) society.one_bhk_rent = one_bhk_rent;
        if (two_bhk_rent) society.two_bhk_rent = two_bhk_rent;
        if (three_bhk_rent) society.three_bhk_rent = three_bhk_rent;
        if (mapLocation) society.mapLocation = mapLocation;

        // Save the updated society
        const updatedSociety = await society.save();

        res.status(200).json({ message: 'Society updated successfully', society: updatedSociety });
    } catch (error) {
        console.error('Error updating society rent:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/all-societies', async (req, res) => {
    try {
        // Get page and limit from query parameters
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch societies with pagination
        const societies = await SocietyRent.find()
            .skip(skip)
            .limit(limit);

        if (societies.length === 0) {
            return res.status(404).json({ message: 'No societies found' });
        }

        // Get total count of societies for pagination
        const totalSocieties = await SocietyRent.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalSocieties / limit);

        // Return paginated response
        res.status(200).json({
            message: 'Societies retrieved successfully',
            societies,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalSocieties,
                itemsPerPage: limit,
            },
        });
    } catch (error) {
        console.error('Error fetching societies:', error);
        res.status(500).json({ message: 'Failed to fetch societies. Please try again later.' });
    }
});

router.get('/get-rent-society/:id', async (req, res) => {
    try {
        const societyId = req.params.id;
        const society = await SocietyRent.findById(societyId); // Fetch society rent by ID from MongoDB

        if (!society) {
            return res.status(404).json({ status: 404, message: 'Society not found' });
        }

        res.status(200).json(society);
    } catch (error) {
        console.error('Error fetching society by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.delete('/delete-rent-society/:id', async (req, res) => {
    try {
        const societyId = req.params.id;

        // Find and delete the society by ID
        const deletedSociety = await SocietyRent.findByIdAndDelete(societyId);

        if (!deletedSociety) {
            return res.status(404).json({ status: 400, message: 'Society not found' });
        }

        res.status(200).json({ status: 200, message: 'Society deleted successfully' });
    } catch (error) {
        console.error('Error deleting society:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
