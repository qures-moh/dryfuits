export const CATEGORIES = [
  { id: 'all', name: 'All Dry Fruits', icon: 'Sparkles' },
  { id: 'buckets', name: 'Gift Buckets & Hampers', icon: 'Gift' },
  { id: 'nuts', name: 'Premium Nuts', icon: 'Nut' },
  { id: 'dates-figs', name: 'Dates & Dried Figs', icon: 'Sun' },
  { id: 'berries-raisins', name: 'Berries & Raisins', icon: 'Heart' },
  { id: 'spices-seeds', name: 'Spices & Super Seeds', icon: 'Flame' }
];

export const PRODUCTS = [
  {
    id: 'prod-bucket-1',
    name: 'Royal Heritage Wooden Bucket',
    brand: 'GOLDEN HARVEST',
    category: 'buckets',
    isBucket: true,
    badge: 'Best Seller',
    inStock: true,
    rating: 4.9,
    reviewsCount: 342,
    shortDesc: 'Handcrafted rustic pine bucket loaded with luxury compartments of jumbo dry fruits.',
    description: 'An opulent festive presentation featuring a hand-carved rustic pine bucket bound with copper hoops and golden satin ribbon. Packed with California Almonds, Kashmiri Walnuts, Salted Pistachios, Whole Cashews, and Medjool Dates.',
    image: '/images/bucket_hamper.jpg',
    gallery: [
      '/images/bucket_hamper.jpg',
      '/images/hamper_basket.jpg',
      '/images/brass_platter.jpg'
    ],
    basePrice: 1050,
    weightOptions: [
      { label: '500gm Classic Bucket', weight: '500gm', price: 1050, serves: 'Serves 2-3' },
      { label: '750gm Deluxe Bucket', weight: '750gm', price: 1450, serves: 'Serves 3-4' },
      { label: '1kg Royal Bucket', weight: '1kg', price: 1890, serves: 'Festive VIP' }
    ],
    origin: 'Kashmir & California Harvest',
    storage: 'Keep in cool dry place, vacuum sealed inner jars',
    nutrition: { calories: '560 kcal', protein: '19.5g', healthyFats: '48g', carbs: '22g', fiber: '9.2g' },
    benefits: ['Handcrafted Keepsake Wooden Bucket', 'Triple Nitrogen Sealed', 'High in Omega 3 & Antioxidants', 'Complimentary Greeting Card']
  },
  {
    id: 'prod-bucket-2',
    name: 'Festive Cane Woven Hamper Bucket',
    brand: 'GOLDEN HARVEST',
    category: 'buckets',
    isBucket: true,
    badge: 'Eco Friendly',
    inStock: true,
    rating: 4.8,
    reviewsCount: 189,
    shortDesc: 'Eco-friendly handwoven willow basket loaded with 4 gourmet dry fruit jars & honey.',
    description: 'Natural wicker cane hamper bucket includes four air-tight glass jars packed with roasted cashews, golden almonds, Turkish sun-dried figs, and dried cranberries alongside raw organic honey.',
    image: '/images/hamper_basket.jpg',
    gallery: [
      '/images/hamper_basket.jpg',
      '/images/bucket_hamper.jpg'
    ],
    basePrice: 990,
    weightOptions: [
      { label: '500gm Artisan Basket', weight: '500gm', price: 990, serves: 'Serves 2-3' },
      { label: '750gm Premium Basket', weight: '750gm', price: 1450, serves: 'Serves 3-4' },
      { label: '1kg Grand Basket', weight: '1kg', price: 1890, serves: 'Festive Family' }
    ],
    origin: 'Handcrafted Bamboo with Global Harvest',
    storage: 'Reusable cane basket with airtight jars',
    nutrition: { calories: '530 kcal', protein: '17g', healthyFats: '42g', carbs: '28g', fiber: '8.5g' },
    benefits: ['Reusable Handwoven Bamboo Basket', 'Zero Single-Use Plastic', 'Immunity Booster Assortment', 'Silk Ribbon Finish']
  },
  {
    id: 'prod-bucket-3',
    name: 'Imperial Brass & Velvet Platter Bucket',
    brand: 'GOLDEN HARVEST',
    category: 'buckets',
    isBucket: true,
    badge: 'Royal Gift',
    inStock: true,
    rating: 5.0,
    reviewsCount: 96,
    shortDesc: 'Royal etched brass platter divided into sections filled with 6 rare dry fruit selections.',
    description: 'An heirloom keepsake brass-finish engraved metal platter featuring modular sections containing Mamra Almonds, Kashmiri Walnuts, Pistachios, Medjool Dates, Figs, and Jumbo Cashews.',
    image: '/images/brass_platter.jpg',
    gallery: [
      '/images/brass_platter.jpg',
      '/images/bucket_hamper.jpg'
    ],
    basePrice: 1250,
    weightOptions: [
      { label: '500gm Imperial Set', weight: '500gm', price: 1250, serves: 'Luxury Gifting' },
      { label: '750gm Sovereign Set', weight: '750gm', price: 1790, serves: 'Festive Platter' },
      { label: '1kg Royal Platter', weight: '1kg', price: 2350, serves: 'VIP Corporate' }
    ],
    origin: 'Moradabad Artisan Metalcraft & Premium Harvest',
    storage: 'Hermetically sealed sections',
    nutrition: { calories: '575 kcal', protein: '20g', healthyFats: '50g', carbs: '20g', fiber: '10g' },
    benefits: ['Heirloom Keepsake Brass Platter', 'Jumbo Grade Nuts', 'Luxury Velvet Presentation Bag', 'Gift Certificate Included']
  },
  {
    id: 'prod-almonds',
    name: 'California Jumbo Nonpareil Almonds',
    brand: 'GOLDEN HARVEST',
    category: 'nuts',
    isBucket: false,
    badge: 'Popular',
    inStock: true,
    rating: 4.9,
    reviewsCount: 512,
    shortDesc: 'Extra-crunchy, sweet nonpareil whole almonds bursting with natural Vitamin E.',
    description: '100% natural, handpicked nonpareil California almonds known for their uniform shape, golden skin, and distinct buttery crunch. Perfect for daily soaking, morning snacking, or blending into almond milk.',
    image: '/images/almonds.jpg',
    gallery: [
      '/images/almonds.jpg',
      '/images/hero.jpg'
    ],
    basePrice: 540,
    weightOptions: [
      { label: '500gm Vacuum Pack', weight: '500gm', price: 540, serves: 'Family Pack' },
      { label: '750gm Deluxe Pack', weight: '750gm', price: 780, serves: 'Monthly Routine' },
      { label: '1kg Mega Saver', weight: '1kg', price: 980, serves: 'Monthly Pantry' }
    ],
    origin: 'Central Valley, California',
    storage: 'Resealable zipper pouch',
    nutrition: { calories: '579 kcal', protein: '21.2g', healthyFats: '49.9g', carbs: '21.6g', fiber: '12.5g' },
    benefits: ['High Vitamin E for Radiant Skin', 'Supports Memory & Brain Stamina', 'Zero Cholesterol', '100% Raw & Unrefined']
  },
  {
    id: 'prod-cashews',
    name: 'King Size W-180 Whole Cashews',
    brand: 'GOLDEN HARVEST',
    category: 'nuts',
    isBucket: false,
    badge: 'King Size',
    inStock: true,
    rating: 4.9,
    reviewsCount: 388,
    shortDesc: 'The largest jumbo W-180 grade cashews with melt-in-mouth creaminess and zero bitter skin.',
    description: 'Globally recognized as the "King of Cashews", the W-180 grading signifies the highest calibre. Exceptionally large, buttery, and naturally sweet without oil roasting.',
    image: '/images/cashews.jpg',
    gallery: [
      '/images/cashews.jpg',
      '/images/hero.jpg'
    ],
    basePrice: 650,
    weightOptions: [
      { label: '500gm Pack', weight: '500gm', price: 650, serves: 'Family Value' },
      { label: '750gm Deluxe Pack', weight: '750gm', price: 940, serves: 'Party Pack' },
      { label: '1kg Master Pack', weight: '1kg', price: 1200, serves: 'Pantry Bulk' }
    ],
    origin: 'Goa Coastal Groves, India',
    storage: 'Vacuum packed nitrogen pouch',
    nutrition: { calories: '553 kcal', protein: '18.2g', healthyFats: '43.8g', carbs: '30.2g', fiber: '3.3g' },
    benefits: ['Rich Creamy Texture', 'Abundant in Zinc & Magnesium', 'Strengthens Bones & Joints', 'Zero Added Oil']
  },
  {
    id: 'prod-pistachios',
    name: 'Roasted Salted Emerald Pistachios',
    brand: 'GOLDEN HARVEST',
    category: 'nuts',
    isBucket: false,
    badge: 'Crunchy',
    inStock: true,
    rating: 4.8,
    reviewsCount: 420,
    shortDesc: 'Slow-roasted in Himalayan pink rock salt with easy-to-crack naturally open shells.',
    description: 'Crisp batch-roasted Iranian pistachios seasoned with mineral-rich Himalayan pink salt. Naturally split pods reveal plump, vibrant green emerald kernels packed with heart-healthy fats.',
    image: '/images/pistachios.jpg',
    gallery: [
      '/images/pistachios.jpg',
      '/images/hero.jpg'
    ],
    basePrice: 620,
    weightOptions: [
      { label: '500gm Pack', weight: '500gm', price: 620, serves: 'Party Pack' },
      { label: '750gm Deluxe Pack', weight: '750gm', price: 890, serves: 'Family Value' },
      { label: '1kg Mega Tub', weight: '1kg', price: 1150, serves: 'Bulk Saver' }
    ],
    origin: 'Middle Eastern Valleys',
    storage: 'Airtight container',
    nutrition: { calories: '562 kcal', protein: '20.3g', healthyFats: '45.3g', carbs: '27.2g', fiber: '10.6g' },
    benefits: ['High Protein Low Calorie Nut', 'Supports Healthy Heart', 'Roasted with Himalayan Salt', 'Naturally Split Pods']
  },
  {
    id: 'prod-walnuts',
    name: 'Kashmiri Snow White Walnut Halves',
    brand: 'GOLDEN HARVEST',
    category: 'nuts',
    isBucket: false,
    badge: 'Brain Booster',
    inStock: true,
    rating: 4.8,
    reviewsCount: 295,
    shortDesc: 'Cold-climate organic walnut halves with natural light amber color and mild buttery sweetness.',
    description: 'Harvested from high-altitude Kashmiri valleys, these half-kernel walnuts are naturally dried without chemical bleaching. Rich in natural plant-based Omega-3 ALA.',
    image: '/images/walnuts.jpg',
    gallery: [
      '/images/walnuts.jpg',
      '/images/hero.jpg'
    ],
    basePrice: 560,
    weightOptions: [
      { label: '500gm Pouch', weight: '500gm', price: 560, serves: 'Daily Breakfast' },
      { label: '750gm Deluxe Pack', weight: '750gm', price: 790, serves: 'Memory Snack' },
      { label: '1kg Mega Pack', weight: '1kg', price: 990, serves: 'Best Value' }
    ],
    origin: 'Pahalgam, Kashmir Valley',
    storage: 'Resealable stand-up zipper pouch',
    nutrition: { calories: '654 kcal', protein: '15.2g', healthyFats: '65.2g', carbs: '13.7g', fiber: '6.7g' },
    benefits: ['Top Source of Plant Omega-3', 'Brain Memory & Cognitive Vitality', 'Non-Bitter Tender Halves', 'Zero Chemical Bleach']
  },
  {
    id: 'prod-dates',
    name: 'Royal Medjool King Dates',
    brand: 'GOLDEN HARVEST',
    category: 'dates-figs',
    isBucket: false,
    badge: 'Caramel Sweet',
    inStock: true,
    rating: 4.9,
    reviewsCount: 460,
    shortDesc: 'Soft, plump, caramel-like organic Medjool dates with melt-in-the-mouth texture.',
    description: 'Known as the "Fruit of Kings", our Medjool dates are hand-harvested at peak ripeness. Naturally sweet with deep notes of honey and brown sugar without added syrup.',
    image: '/images/dates.jpg',
    gallery: [
      '/images/dates.jpg',
      '/images/hero.jpg'
    ],
    basePrice: 350,
    weightOptions: [
      { label: '500gm Family Pack', weight: '500gm', price: 350, serves: 'Sweet Tooth' },
      { label: '750gm Deluxe Pack', weight: '750gm', price: 510, serves: 'Dessert Ready' },
      { label: '1kg Bulk Box', weight: '1kg', price: 650, serves: 'Holiday Supply' }
    ],
    origin: 'Jordan River Valley',
    storage: 'Refrigerate for chewy caramel texture',
    nutrition: { calories: '277 kcal', protein: '1.8g', healthyFats: '0.2g', carbs: '75g', fiber: '7g' },
    benefits: ['Natural Pre-Workout Energy', 'Rich in Potassium & Iron', 'Natural Sugar Substitute', 'Zero Chemical Preservatives']
  },
  {
    id: 'prod-figs',
    name: 'Sun-Dried Turkish Golden Figs',
    brand: 'GOLDEN HARVEST',
    category: 'dates-figs',
    isBucket: false,
    badge: 'High Fiber',
    inStock: true,
    rating: 4.7,
    reviewsCount: 210,
    shortDesc: 'String-tied sun-ripened Turkish figs with delightful crunch from internal seeds.',
    description: 'Sun-drenched Mediterranean figs string-dried on ropes in mountain air. High dietary fiber content assists digestive balance, while natural calcium strengthens bones.',
    image: '/images/figs.jpg',
    gallery: [
      '/images/figs.jpg',
      '/images/hero.jpg'
    ],
    basePrice: 680,
    weightOptions: [
      { label: '500gm Double Ring', weight: '500gm', price: 680, serves: 'Daily Routine' },
      { label: '750gm Deluxe Ring', weight: '750gm', price: 980, serves: 'Traditional Pack' },
      { label: '1kg Mega Pouch', weight: '1kg', price: 1250, serves: 'Best Value' }
    ],
    origin: 'Aydin Valley, Turkey',
    storage: 'Cool dry pantry',
    nutrition: { calories: '249 kcal', protein: '3.3g', healthyFats: '0.9g', carbs: '63.9g', fiber: '9.8g' },
    benefits: ['High Fiber for Healthy Digestion', 'Natural Bioavailable Calcium', 'Soft Chewy Texture', 'Hand Strung on Cotton Ropes']
  },
  {
    id: 'prod-raisins',
    name: 'Afghan Long Green Raisins',
    brand: 'GOLDEN HARVEST',
    category: 'berries-raisins',
    isBucket: false,
    badge: 'Natural Sweet',
    inStock: true,
    rating: 4.7,
    reviewsCount: 178,
    shortDesc: 'Slender, seedless Afghan emerald raisins dried in traditional shade chambers.',
    description: 'Long green seedless raisins from Herat, Afghanistan. Known for delicate jade color, gentle sweetness, and juicy tender bite. Dried in traditional mud chambers without sulfur bleaching.',
    image: '/images/raisins.jpg',
    gallery: [
      '/images/raisins.jpg',
      '/images/hero.jpg'
    ],
    basePrice: 300,
    weightOptions: [
      { label: '500gm Pack', weight: '500gm', price: 300, serves: 'Regular' },
      { label: '750gm Deluxe Pack', weight: '750gm', price: 440, serves: 'Snack Pack' },
      { label: '1kg Pack', weight: '1kg', price: 580, serves: 'Bulk Pantry' }
    ],
    origin: 'Herat, Afghanistan',
    storage: 'Cool dry airtight jar',
    nutrition: { calories: '299 kcal', protein: '3.1g', healthyFats: '0.5g', carbs: '79g', fiber: '3.7g' },
    benefits: ['Shade-Dried Without Sulfur Bleach', 'High Iron Helps Haemoglobin', 'Naturally Sweet Flavor', '100% Seedless & Soft']
  },
  {
    id: 'prod-cardamom',
    name: 'Idukki Whole Green Cardamom (8mm+)',
    brand: 'GOLDEN HARVEST',
    category: 'spices-seeds',
    isBucket: false,
    badge: 'Aroma King',
    inStock: true,
    rating: 4.9,
    reviewsCount: 310,
    shortDesc: 'Bold 8mm+ emerald green cardamom pods directly from Kerala spice hills.',
    description: 'Jumbo 8mm bold green cardamom pods harvested in the mist-clad hills of Idukki, Kerala. Intense natural aroma and high essential oil content without artificial green dye.',
    image: '/images/cardamom.jpg',
    gallery: [
      '/images/cardamom.jpg',
      '/images/hero.jpg'
    ],
    basePrice: 1650,
    weightOptions: [
      { label: '500gm Pack', weight: '500gm', price: 1650, serves: 'Value Pack' },
      { label: '750gm Deluxe Pack', weight: '750gm', price: 2400, serves: 'Spice Rack' },
      { label: '1kg Mega Pouch', weight: '1kg', price: 3100, serves: 'Kitchen Favorite' }
    ],
    origin: 'Idukki Hills, Kerala',
    storage: 'Airtight glass bottle',
    nutrition: { calories: '311 kcal', protein: '10.8g', healthyFats: '6.7g', carbs: '68g', fiber: '28g' },
    benefits: ['Bold 8mm+ Natural Pods', 'Zero Artificial Color', 'Intense Aroma & High Oil', 'Digestive Aid & Mouth Freshener']
  },
  {
    id: 'prod-superseed',
    name: 'Roasted 7-Seeds & Dry Fruits Supermix',
    brand: 'GOLDEN HARVEST',
    category: 'spices-seeds',
    isBucket: false,
    badge: 'Superfood',
    inStock: true,
    rating: 4.8,
    reviewsCount: 220,
    shortDesc: 'Crunchy blend of chia, pumpkin, sunflower, watermelon seeds, almonds & cranberries.',
    description: 'Lightly roasted with Himalayan pink salt. Provides clean plant protein, dietary fiber, zinc, and healthy fats without sugar spikes.',
    image: '/images/superseeds.jpg',
    gallery: [
      '/images/superseeds.jpg',
      '/images/hero.jpg'
    ],
    basePrice: 360,
    weightOptions: [
      { label: '500gm Pack', weight: '500gm', price: 360, serves: 'Monthly Mix' },
      { label: '750gm Deluxe Pack', weight: '750gm', price: 520, serves: 'Snack Pack' },
      { label: '1kg Mega Pouch', weight: '1kg', price: 680, serves: 'Fitness Refill' }
    ],
    origin: 'House Curated Blend',
    storage: 'Resealable stand-up zipper',
    nutrition: { calories: '512 kcal', protein: '22g', healthyFats: '38g', carbs: '24g', fiber: '14g' },
    benefits: ['High Zinc & Plant Protein', 'Zero Sugar Spike', 'Roasted with Rock Salt', 'Great on Oats & Salads']
  }
];

export const BUCKET_CONTAINERS = [
  {
    id: 'pine-wood',
    name: 'Artisan Rustic Pine Bucket',
    material: 'Natural Himalayan Pine with Vintage Copper Hoops',
    capacity: 'Fits 4-6 dry fruit selections',
    price: 450,
    image: '/images/bucket_hamper.jpg',
    badge: 'Most Popular'
  },
  {
    id: 'woven-cane',
    name: 'Handwoven Cane Hamper Basket',
    material: 'Natural Wicker Bamboo with Leather Clasps',
    capacity: 'Fits 3-4 dry fruit selections',
    price: 350,
    image: '/images/hamper_basket.jpg',
    badge: 'Eco Friendly'
  },
  {
    id: 'brass-platter',
    name: 'Imperial Embossed Brass Platter',
    material: 'Heavy Etched Brass with Velvet Divider Trim',
    capacity: 'Fits 4-6 dry fruit selections',
    price: 850,
    image: '/images/brass_platter.jpg',
    badge: 'Royal Luxury'
  },
  {
    id: 'velvet-chest',
    name: 'Regal Emerald Keepsake Chest',
    material: 'Artisan Box with Golden Metallic Lock',
    capacity: 'Fits 4 dry fruit selections',
    price: 550,
    image: '/images/bucket_hamper.jpg',
    badge: 'Festive Classic'
  }
];

export const DRY_FRUIT_FILLERS = [
  { id: 'fill-almonds', name: 'California Jumbo Almonds (150g)', price: 160, category: 'Nuts', icon: '🌰' },
  { id: 'fill-cashews', name: 'King W180 Cashews (150g)', price: 190, category: 'Nuts', icon: '🥜' },
  { id: 'fill-pistachios', name: 'Roasted Salted Pistachios (150g)', price: 180, category: 'Nuts', icon: '🟢' },
  { id: 'fill-walnuts', name: 'Kashmiri Walnut Halves (150g)', price: 170, category: 'Nuts', icon: '🧠' },
  { id: 'fill-dates', name: 'Royal Medjool Dates (150g)', price: 130, category: 'Dates & Figs', icon: '🌴' },
  { id: 'fill-figs', name: 'Turkish Sun-Dried Figs (150g)', price: 195, category: 'Dates & Figs', icon: '🍯' },
  { id: 'fill-raisins', name: 'Afghan Green Raisins (150g)', price: 95, category: 'Berries', icon: '🍇' },
  { id: 'fill-cardamom', name: 'Idukki Green Cardamom (50g)', price: 180, category: 'Spices', icon: '🌿' }
];

export const GIFT_RIBBONS = [
  { id: 'gold-satin', name: 'Royal Golden Satin Ribbon', color: '#eab308', cost: 0 },
  { id: 'crimson-velvet', name: 'Festive Crimson Velvet Ribbon', color: '#dc2626', cost: 40 },
  { id: 'emerald-silk', name: 'Heritage Emerald Green Ribbon', color: '#16a34a', cost: 40 },
  { id: 'rustic-twine', name: 'Eco Jute Twine & Card', color: '#b45309', cost: 25 }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aarav Singhania',
    role: 'Corporate Executive, Mumbai',
    rating: 5,
    comment: 'Ordered 25 Royal Heritage Wooden Buckets for Diwali corporate clients. Every single recipient called me to praise the packaging craftsmanship and giant cashew size! Unbeatable presentation.',
    date: '2 days ago',
    verified: true
  },
  {
    id: 2,
    name: 'Pooja Sharma',
    role: 'Verified Buyer, Delhi',
    rating: 5,
    comment: 'The custom bucket builder was so easy and delightful. Built a customized basket with Medjool dates, Turkish figs, and California almonds for my mother. Freshness is 10/10.',
    date: '1 week ago',
    verified: true
  },
  {
    id: 3,
    name: 'Dr. Kabir & Meera Patel',
    role: 'Health Food Enthusiasts, Ahmedabad',
    rating: 5,
    comment: 'Most store-bought walnuts smell old, but Golden Harvest walnuts are pristine, snow-white, and naturally buttery sweet. The vacuum seal really preserves the fresh orchard crunch.',
    date: '2 weeks ago',
    verified: true
  }
];

export const FAQ_ITEMS = [
  {
    q: 'How are your dry fruits kept fresh during shipping?',
    a: 'Every single nut and dried fruit batch is vacuum packed with inert nitrogen flushing to eliminate oxygen, moisture, and pests. They arrive as crisp as the day they left the orchard.'
  },
  {
    q: 'Can I add a personalized gift message to my Dry Fruit Bucket?',
    a: 'Yes! When customizing or ordering any Bucket or Hamper, you can type a custom gift message which we print on an embossed gold foil greeting card free of charge.'
  },
  {
    q: 'What is the shelf life of the dry fruits?',
    a: 'In their sealed vacuum packaging, our dry fruits stay fresh for up to 9-12 months. Once opened, transfer to an airtight container in a cool, dry place.'
  },
  {
    q: 'Do you offer bulk orders for weddings and corporate events?',
    a: 'Yes, we provide wholesale customized branding, custom laser engraved buckets, and tailored dry fruit combinations for weddings and corporate orders.'
  }
];
