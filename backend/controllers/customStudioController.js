const CustomStudioItem = require("../models/CustomStudioItem");

const DEFAULT_CONTAINERS = [
  {
    type: "container",
    name: "Artisan Rustic Pine Bucket",
    material: "Natural Himalayan Pine with Vintage Copper Hoops",
    capacity: "Fits 4-6 dry fruit selections",
    price: 450,
    image: "/images/bucket_hamper.jpg",
    badge: "Most Popular",
    sortOrder: 1,
  },
  {
    type: "container",
    name: "Handwoven Cane Hamper Basket",
    material: "Natural Wicker Bamboo with Leather Clasps",
    capacity: "Fits 3-4 dry fruit selections",
    price: 350,
    image: "/images/hamper_basket.jpg",
    badge: "Eco Friendly",
    sortOrder: 2,
  },
  {
    type: "container",
    name: "Imperial Embossed Brass Platter",
    material: "Heavy Etched Brass with Velvet Divider Trim",
    capacity: "Fits 4-6 dry fruit selections",
    price: 850,
    image: "/images/brass_platter.jpg",
    badge: "Royal Luxury",
    sortOrder: 3,
  },
  {
    type: "container",
    name: "Regal Emerald Keepsake Chest",
    material: "Artisan Box with Golden Metallic Lock",
    capacity: "Fits 4 dry fruit selections",
    price: 550,
    image: "/images/bucket_hamper.jpg",
    badge: "Festive Classic",
    sortOrder: 4,
  },
];

const DEFAULT_FILLERS = [
  { type: "filler", name: "California Jumbo Almonds (150g)", price: 160, category: "Nuts", icon: "🌰", weight: 150, sortOrder: 1 },
  { type: "filler", name: "King W180 Cashews (150g)", price: 190, category: "Nuts", icon: "🥜", weight: 150, sortOrder: 2 },
  { type: "filler", name: "Roasted Salted Pistachios (150g)", price: 180, category: "Nuts", icon: "🟢", weight: 150, sortOrder: 3 },
  { type: "filler", name: "Kashmiri Walnut Halves (150g)", price: 170, category: "Nuts", icon: "🧠", weight: 150, sortOrder: 4 },
  { type: "filler", name: "Royal Medjool Dates (150g)", price: 130, category: "Dates & Figs", icon: "🌴", weight: 150, sortOrder: 5 },
  { type: "filler", name: "Turkish Sun-Dried Figs (150g)", price: 195, category: "Dates & Figs", icon: "🍯", weight: 150, sortOrder: 6 },
  { type: "filler", name: "Afghan Green Raisins (150g)", price: 95, category: "Berries", icon: "🍇", weight: 150, sortOrder: 7 },
  { type: "filler", name: "Idukki Green Cardamom (50g)", price: 180, category: "Spices", icon: "🌿", weight: 50, sortOrder: 8 },
];

const DEFAULT_RIBBONS = [
  { type: "ribbon", name: "Royal Golden Satin Ribbon", price: 0, color: "#eab308", sortOrder: 1 },
  { type: "ribbon", name: "Festive Crimson Velvet Ribbon", price: 40, color: "#dc2626", sortOrder: 2 },
  { type: "ribbon", name: "Heritage Emerald Green Ribbon", price: 40, color: "#16a34a", sortOrder: 3 },
  { type: "ribbon", name: "Eco Jute Twine & Card", price: 25, color: "#b45309", sortOrder: 4 },
];

// Seed default items if collection is empty
const seedStudioDefaults = async () => {
  const count = await CustomStudioItem.countDocuments();
  if (count === 0) {
    const allDefaults = [...DEFAULT_CONTAINERS, ...DEFAULT_FILLERS, ...DEFAULT_RIBBONS];
    await CustomStudioItem.insertMany(allDefaults);
    console.log("Seeded default Custom Studio items.");
  }
};

exports.getStudioItems = async (req, res) => {
  try {
    await seedStudioDefaults();

    const items = await CustomStudioItem.find().sort({ sortOrder: 1, createdAt: 1 });

    const containers = items.filter((i) => i.type === "container");
    const fillers = items.filter((i) => i.type === "filler");
    const ribbons = items.filter((i) => i.type === "ribbon");

    return res.json({
      containers,
      fillers,
      ribbons,
      items,
    });
  } catch (error) {
    console.error("Get Custom Studio items error:", error);
    return res.status(500).json({ message: "Failed to load Custom Studio items" });
  }
};

exports.createStudioItem = async (req, res) => {
  try {
    const { type, name, price, material, capacity, image, badge, category, icon, weight, color, inStock, sortOrder } = req.body;

    if (!type || !["container", "filler", "ribbon"].includes(type)) {
      return res.status(400).json({ message: "Valid type (container, filler, ribbon) is required" });
    }

    if (!name?.trim()) {
      return res.status(400).json({ message: "Item name is required" });
    }

    const item = await CustomStudioItem.create({
      type,
      name: name.trim(),
      price: Number(price) >= 0 ? Number(price) : 0,
      material: material?.trim() || "",
      capacity: capacity?.trim() || "",
      image: image?.trim() || "/images/bucket_hamper.jpg",
      badge: badge?.trim() || "",
      category: category?.trim() || "Nuts",
      icon: icon?.trim() || "🌰",
      weight: Number(weight) || 150,
      color: color?.trim() || "#eab308",
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      sortOrder: Number(sortOrder) || 0,
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error("Create Custom Studio item error:", error);
    return res.status(400).json({ message: error.message || "Failed to create item" });
  }
};

exports.updateStudioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, material, capacity, image, badge, category, icon, weight, color, inStock, sortOrder } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (price !== undefined) updateData.price = Number(price);
    if (material !== undefined) updateData.material = material.trim();
    if (capacity !== undefined) updateData.capacity = capacity.trim();
    if (image !== undefined) updateData.image = image.trim();
    if (badge !== undefined) updateData.badge = badge.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (icon !== undefined) updateData.icon = icon.trim();
    if (weight !== undefined) updateData.weight = Number(weight);
    if (color !== undefined) updateData.color = color.trim();
    if (inStock !== undefined) updateData.inStock = Boolean(inStock);
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);

    const item = await CustomStudioItem.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ message: "Custom Studio item not found" });
    }

    return res.json(item);
  } catch (error) {
    console.error("Update Custom Studio item error:", error);
    return res.status(400).json({ message: error.message || "Failed to update item" });
  }
};

exports.deleteStudioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CustomStudioItem.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Custom Studio item not found" });
    }

    return res.json({ message: "Item deleted successfully", id });
  } catch (error) {
    console.error("Delete Custom Studio item error:", error);
    return res.status(500).json({ message: "Failed to delete item" });
  }
};
