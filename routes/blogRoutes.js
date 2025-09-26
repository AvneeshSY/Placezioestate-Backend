const express = require("express");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const router = express.Router();
const Blog = require("../models/Blog");


// router.post("/create-blog", async (req, res) => {
//   try {
//     const { title, content, featureImages, metaTitle, metaDescription } = req.body;

//     if (!title || !content || !featureImages || featureImages.length === 0) {
//       return res.status(400).json({ success: false, message: "All fields are required!" });
//     }

//     let slug = slugify(title, { lower: true, strict: true });

//     const blogFolderPath = path.join(__dirname, "..", "uploads", "blogs", `${slug}`);
//     if (!fs.existsSync(blogFolderPath)) {
//       fs.mkdirSync(blogFolderPath, { recursive: true });
//     }

//     const imagePaths = [];
//     for (let i = 0; i < featureImages.length; i++) {
//       const base64Data = featureImages[i].replace(/^data:image\/\w+;base64,/, "");
//       const imageName = `image_${i + 1}_${Date.now()}.jpg`;
//       const imagePath = path.join(blogFolderPath, imageName);
//       fs.writeFileSync(imagePath, Buffer.from(base64Data, "base64"));

//       imagePaths.push(imageName);
//     }

//     const newBlog = new Blog({
//       title,
//       content,
//       featureImages: imagePaths,
//       metaTitle,
//       metaDescription,
//     });

//     await newBlog.save();
//     res.status(201).json({ success: true, blog: newBlog });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });




router.post("/create-blog", async (req, res) => {
  try {
    const { title, content, featureImages, metaTitle, metaDescription } = req.body;

    if (!title || !content || !featureImages || featureImages.length === 0) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    let slug = slugify(title, { lower: true, strict: true });

    // Create the blog entry first to generate the _id
    const newBlog = new Blog({
      title,
      content,
      featureImages: [], // Will be updated after images are saved
      metaTitle,
      metaDescription,
    });

    const savedBlog = await newBlog.save(); // Save to generate _id
    const blogId = savedBlog._id.toString(); // Get the unique blog ID

    console.log('blogId==>', blogId)

    // Create a folder for storing images
    const blogFolderPath = path.join(__dirname, "..", "uploads", "blogs", blogId);
    if (!fs.existsSync(blogFolderPath)) {
      fs.mkdirSync(blogFolderPath, { recursive: true });
    }

    // Save images with the blog ID
    const imagePaths = [];
    for (let i = 0; i < featureImages.length; i++) {
      const base64Data = featureImages[i].replace(/^data:image\/\w+;base64,/, "");
      const imageName = `${blogId}_image_${i + 1}.jpg`; // Save image with blog ID
      const imagePath = path.join(blogFolderPath, imageName);
      fs.writeFileSync(imagePath, Buffer.from(base64Data, "base64"));

      imagePaths.push(imageName);
    }

    // Update blog with image paths
    savedBlog.featureImages = imagePaths;
    await savedBlog.save();

    res.status(201).json({ success: true, blog: savedBlog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;



router.get("/blogs", async (req, res) => {
  try {
    let { page, limit } = req.query;
    
    // Convert page & limit to numbers and set defaults if not provided
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10; // Default: 10 blogs per page

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Fetch blogs with pagination and sorting
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get the total count of blogs
    const totalBlogs = await Blog.countDocuments();

    res.status(200).json({
      success: true,
      blogs,
      totalBlogs,
      totalPages: Math.ceil(totalBlogs / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



router.get("/blogs/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/blogs/:id", async (req, res) => {
  try {
    const { title, content, featureImages, metaTitle, metaDescription } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, featureImages, metaTitle, metaDescription, slug: slugify(title, { lower: true, strict: true }) },
      { new: true }
    );

    if (!updatedBlog) return res.status(404).json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.delete("/blogs/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
