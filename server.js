const express = require('express');
const connectDB = require('./config/db');
const requirementRoutes = require('./routes/requirementRoute');
const adminRoutes = require('./routes/adminRoute');
const sellPropertyRoute = require('./routes/sellPropertyRoute');
const societyRentRoutes = require('./routes/societyRentRoute'); // Import the Society Rent routes
const listPropertyRoute = require('./routes/listPropertyRoute'); // Import the Society Rent routes
const blogRoutes = require("./routes/blogRoutes");
const brokerRoutes = require("./routes/brokerRoutes");
const rentApartmentRoute = require('./routes/rentApartmentRoute')
const rentalRoutes = require('./routes/rentAggrementDraftRoute');

require('dotenv').config();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/media', express.static('./uploads'));

// Routes
app.use('/api', requirementRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/property', sellPropertyRoute);
app.use('/api/society-rent', societyRentRoutes);
app.use('/api/list-property', listPropertyRoute);
app.use("/api/blog", blogRoutes);
app.use("/api/brokers", brokerRoutes);
app.use("/api/rentApartment", rentApartmentRoute);

app.use('/api/rentals', rentalRoutes);




// Simple route to confirm the server is running
app.get('/', (req, res) => res.send('Placezio Estate Backend is running'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
