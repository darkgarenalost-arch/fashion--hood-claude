export const fallbackBanners = [
  {
    title: "New Season, Main Character Energy",
    eyebrow: "Fresh drops for every plan",
    subtitle: "Kurtis, co-ords, denims and statement accessories made for the scroll-stopping wardrobe.",
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1800&q=85",
    cta: "Shop New Arrivals",
    link: "products/"
  },
  {
    title: "Red Hour Edit",
    eyebrow: "Limited festive-ready pieces",
    subtitle: "Luxury red accents, flattering fits and everyday prices designed for Indian wardrobes.",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1800&q=85",
    cta: "Explore Best Sellers",
    link: "products/?tag=best-seller"
  },
  {
    title: "Weekend Fits Are Live",
    eyebrow: "Comfort meets polish",
    subtitle: "Easy co-ord sets, relaxed denims and tops that move from reels to real life.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=85",
    cta: "Shop The Edit",
    link: "products/?category=co-ord-sets"
  }
];

export const categories = [
  { name: "Kurtis", slug: "kurtis", image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=900&q=80" },
  { name: "Denims", slug: "denims", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80" },
  { name: "Tops", slug: "tops", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80" },
  { name: "Co-ord Sets", slug: "co-ord-sets", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80" },
  { name: "Handbags", slug: "handbags", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80" },
  { name: "Light Jewellery", slug: "light-jewellery", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80" }
];

export const fallbackProducts = [
  {
    id: "fh-red-kurti",
    name: "Scarlet Muse Straight Kurti",
    slug: "scarlet-muse-straight-kurti",
    category: "kurtis",
    tags: ["new-arrival", "best-seller", "featured"],
    price: 1799,
    salePrice: 1299,
    stock: 32,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Red", "Black"],
    images: [
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "A sharp, feminine straight kurti with luxe red detailing, designed for day plans and dinner plans."
  },
  {
    id: "fh-denim-wide",
    name: "Midnight Wide Leg Denim",
    slug: "midnight-wide-leg-denim",
    category: "denims",
    tags: ["best-seller", "featured"],
    price: 2199,
    salePrice: 1599,
    stock: 24,
    sizes: ["26", "28", "30", "32", "34"],
    colors: ["Deep Blue", "Black"],
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "High-rise wide leg denim with an easy drape and clean finish for elevated casual looks."
  },
  {
    id: "fh-ivory-top",
    name: "Ivory Glow Satin Top",
    slug: "ivory-glow-satin-top",
    category: "tops",
    tags: ["new-arrival", "featured"],
    price: 1399,
    salePrice: 999,
    stock: 38,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Wine", "Black"],
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "Soft satin finish, flattering neckline and a polished shine for party-to-brunch styling."
  },
  {
    id: "fh-ruby-coord",
    name: "Ruby Hour Co-ord Set",
    slug: "ruby-hour-co-ord-set",
    category: "co-ord-sets",
    tags: ["new-arrival", "best-seller", "featured"],
    price: 2999,
    salePrice: 2199,
    stock: 18,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ruby", "Charcoal"],
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "A confidence-first matching set with fluid tailoring and a premium red mood."
  },
  {
    id: "fh-chain-bag",
    name: "Noir Chain Shoulder Bag",
    slug: "noir-chain-shoulder-bag",
    category: "handbags",
    tags: ["best-seller"],
    price: 1899,
    salePrice: 1399,
    stock: 41,
    sizes: ["One Size"],
    colors: ["Black", "Wine"],
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "Structured shoulder bag with a polished chain strap for everyday luxury."
  },
  {
    id: "fh-pearl-hoops",
    name: "Pearl Spark Mini Hoops",
    slug: "pearl-spark-mini-hoops",
    category: "light-jewellery",
    tags: ["new-arrival"],
    price: 899,
    salePrice: 599,
    stock: 56,
    sizes: ["One Size"],
    colors: ["Gold", "Rose Gold"],
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?auto=format&fit=crop&w=1000&q=85"
    ],
    description: "Lightweight hoops with pearl accents for soft shine without overdoing it."
  }
];

export const reviews = [
  { name: "Aarohi", city: "Mumbai", text: "The co-ord looked even better in real life. Packaging felt premium and COD was smooth.", rating: 5 },
  { name: "Mehak", city: "Delhi", text: "Loved the kurti fit. It feels dressy but still comfortable for college and dinners.", rating: 5 },
  { name: "Ishita", city: "Pune", text: "Fast delivery, clean finish and the handbag quality is honestly impressive for the price.", rating: 5 }
];

