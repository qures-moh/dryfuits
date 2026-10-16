require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    let admin = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (admin) {
      admin.password = "123456";
      await admin.save();
      console.log("Admin password updated successfully for admin@gmail.com to 123456");
    } else {
      admin = await Admin.create({
        name: "Golden Harvest Admin",
        email: "admin@gmail.com",
        password: "123456",
      });
      console.log("Admin created successfully:", admin.email);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();