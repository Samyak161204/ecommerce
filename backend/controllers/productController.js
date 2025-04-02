import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/ProductModel.js";

// Function to add product
const addProduct = async (req, res) => {
  try {
      console.log("Received product data:", req.body);
      console.log("Received files:", req.files);

      const { name, description, price, category, subCategory, bestseller, sizes } = req.body;

      // Validate required fields
      if (!name || name.trim() === "") {
          return res.status(400).json({ success: false, message: "Product name is required" });
      }
      if (!description || description.trim() === "") {
          return res.status(400).json({ success: false, message: "Product description is required" });
      }
      if (!price) {
          return res.status(400).json({ success: false, message: "Product price is required" });
      }
      if (!category || !subCategory) {
          return res.status(400).json({ success: false, message: "Category and Subcategory are required" });
      }
      if (!sizes || sizes.trim() === "" || JSON.parse(sizes).length === 0) {
          return res.status(400).json({ success: false, message: "At least one size must be selected" });
      }

      // Parse sizes and bestseller flag
      const parsedSizes = JSON.parse(sizes);
      const parsedBestseller = JSON.parse(bestseller);
      const parsedPrice = parseFloat(price);

      // Validate price (Must be a positive number)
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
          return res.status(400).json({ success: false, message: "Price must be a positive number" });
      }

      // Validate image upload
      if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({ success: false, message: "At least one product image is required" });
      }

      // Upload images to Cloudinary
      let imageUrls = [];
      try {
          const imageFiles = Object.values(req.files).flat(); // Flatten in case multiple images exist in different fields
          const uploadedImages = await Promise.all(
              imageFiles.map(async (file) => {
                  const uploadedResponse = await cloudinary.uploader.upload(file.path, { folder: "products" });
                  return uploadedResponse.secure_url;
              })
          );
          imageUrls = uploadedImages;
      } catch (uploadError) {
          console.error("Cloudinary Upload Error:", uploadError);
          return res.status(500).json({ success: false, message: "Image upload failed" });
      }

      // Create new product
      const newProduct = new productModel({
          name,
          description,
          price: parsedPrice,
          category,
          subCategory,
          bestseller: parsedBestseller,
          sizes: parsedSizes,
          image: imageUrls, // Ensure all images are stored in MongoDB
          date: Date.now(),
      });

      // Save to database
      await newProduct.save();
      return res.status(201).json({ success: true, message: "Product added successfully!", product: newProduct });
  } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ success: false, message: "Failed to add product", error: error.message });
  }
};

// Function to list all products
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve products", error: error.message });
  }
};

// Function to remove a product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    
    // Check if product exists
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Remove product
    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed successfully!" });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, message: "Failed to remove product", error: error.message });
  }
};

// Function to get a single product by ID
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    // Fetch product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve product", error: error.message });
  }
};

export { listProduct, addProduct, removeProduct, singleProduct };
