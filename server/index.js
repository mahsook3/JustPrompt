const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5050;
const mongodbUri = process.env.MONGODB_URI;

app.use(cors());

mongoose
  .connect(mongodbUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const justPromptSchema = new mongoose.Schema({
  darkMode: Boolean,
  color: String,
  uniqueID: String,
  header: {
    headerTemplateID: String,
    companyName: String,
    logoUrl: String,
    menuItems: [{ label: String, link: String }],
    actionButton: { label: String, link: String },
  },
  hero: {
    heroTemplateID: String,
    topic: String,
    title: String,
    para: String,
    buttons: [{ text: String, link: String }],
    imageUrl: String,
  },
  features: {
    featuresTemplateID: String,
    title: String,
    description: String,
    items: [
      {
        iconClass: String,
        bgColor: String,
        title: String,
        description: String,
      },
    ],
  },
  products: {
    productsTemplateID: String,
    list: [
      {
        imageSrc: String,
        title: String,
        description: String,
        price: String,
        bgColor: String,
        btnColor: String,
      },
    ],
  },
  teamMembers: {
    teamMembersTemplateID: String,
    Members: [{ name: String, imageUrl: String, role: String }],
  },
  callToAction: {
    callToActionTemplateID: String,
    heading: String,
    subheading: String,
    buttonText: String,
    buttonText1: String,
  },
  footer: {
    footerTemplateID: String,
    companyName: String,
    companyDescription1: String,
    companyDescription2: String,
    contactsTitle: String,
    phoneLabel: String,
    phone: String,
    emailLabel: String,
    email: String,
    addressLabel: String,
    address: String,
    socialTitle: String,
    socialDescription: String,
    copyright: String,
    faq: String,
    privacyPolicy: String,
    termsAndConditions: String,
    icons: {
      company: String,
      twitter: String,
      instagram: String,
      facebook: String,
    },
  },
});

const justPrompt = mongoose.model("justPrompt", justPromptSchema);

app.use(express.json());

app.post("/api/justprompt", async (req, res) => {
  try {
    const newjustPrompt = new justPrompt(req.body);
    const savedjustPrompt = await newjustPrompt.save();
    res.status(201).json(savedjustPrompt);
  } catch (error) {
    console.error("Error saving justPrompt data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/justprompt", async (req, res) => {
  try {
    const data = await justPrompt.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching justPrompt data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/justprompt/:uniqueID", async (req, res) => {
  try {
    const { uniqueID } = req.params;
    const data = await justPrompt.findOne({ uniqueID });
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    console.error("Error fetching justPrompt data by uniqueID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
