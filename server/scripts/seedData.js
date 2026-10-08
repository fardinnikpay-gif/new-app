import { makeSlug } from "../src/utils/slugify.js";

export const CATEGORY_NAMES = ["men", "women", "kids"];

const SIZE_SETS = {
  top: ["S", "M", "L", "XL"],
  waist: ["28", "30", "32", "34"],
  kids: ["4Y", "6Y", "8Y", "10Y"],
};

// [title, brand, category, price, discountPrice, isFeatured, sizeSet, colors, lowStock?]
// Sizes are UPPERCASE and colors lowercase, same normalization as the product validator (step 15)
const PRODUCTS = [
  ["Classic Oxford Shirt", "Northwind", "men", 59.9, 49.9, true, "top", ["white", "blue"]],
  ["Slim Fit Chinos", "Urban Loom", "men", 69.9, null, false, "waist", ["beige", "navy"]],
  ["Merino Crew Sweater", "Kestrel", "men", 89, 74.5, true, "top", ["grey", "navy", "green"]],
  ["Everyday Cotton T-Shirt", "Maple & Co", "men", 19.9, null, false, "top", ["white", "black", "grey"]],
  ["Straight Leg Jeans", "Urban Loom", "men", 79.9, 64.9, false, "waist", ["blue", "black"]],
  ["Water-Resistant Parka", "Kestrel", "men", 169, 139, true, "top", ["black", "olive"]],
  ["Linen Summer Shirt", "Northwind", "men", 54.9, null, false, "top", ["white", "beige"]],
  ["Fleece Zip Hoodie", "Bluebird", "men", 64.9, null, false, "top", ["grey", "navy"], true],
  ["Tailored Wool Blazer", "Northwind", "men", 189, 159, true, "top", ["grey", "navy"]],
  ["Jogger Sweatpants", "Maple & Co", "men", 39.9, null, false, "waist", ["black", "grey"]],
  ["Floral Wrap Dress", "Bluebird", "women", 79.9, 59.9, true, "top", ["red", "green"]],
  ["High-Waist Skinny Jeans", "Urban Loom", "women", 74.9, null, false, "waist", ["blue", "black"]],
  ["Cashmere Blend Cardigan", "Kestrel", "women", 129, 109, true, "top", ["beige", "grey"]],
  ["Silk Touch Blouse", "Northwind", "women", 62.9, null, false, "top", ["white", "pink"]],
  ["Pleated Midi Skirt", "Maple & Co", "women", 54.9, 44.9, false, "waist", ["black", "olive"]],
  ["Quilted Winter Coat", "Kestrel", "women", 179, null, true, "top", ["black", "navy"]],
  ["Ribbed Knit Top", "Bluebird", "women", 24.9, null, false, "top", ["white", "black", "pink"]],
  ["Wide Leg Trousers", "Urban Loom", "women", 69.9, 55.9, false, "waist", ["beige", "black"]],
  ["Linen Jumpsuit", "Northwind", "women", 94.9, null, false, "top", ["olive", "white"]],
  ["Cozy Fleece Pullover", "Maple & Co", "women", 49.9, null, false, "top", ["pink", "grey"]],
  ["Kids Rainbow T-Shirt", "Bluebird", "kids", 14.9, null, true, "kids", ["white", "yellow"]],
  ["Kids Denim Overalls", "Urban Loom", "kids", 39.9, 32.9, false, "kids", ["blue"]],
  ["Kids Hooded Raincoat", "Kestrel", "kids", 44.9, null, true, "kids", ["yellow", "red"]],
  ["Kids Cotton Pajama Set", "Maple & Co", "kids", 24.9, 19.9, false, "kids", ["blue", "pink"]],
  ["Kids Puffer Jacket", "Kestrel", "kids", 69.9, null, false, "kids", ["navy", "red"]],
  ["Kids Jogger Pants", "Bluebird", "kids", 22.9, null, false, "kids", ["grey", "black"]],
  ["Kids Striped Polo", "Northwind", "kids", 18.9, null, false, "kids", ["navy", "white"]],
  ["Kids Knit Sweater", "Maple & Co", "kids", 29.9, 24.9, false, "kids", ["green", "grey"]],
  ["Kids Summer Shorts", "Bluebird", "kids", 16.9, null, false, "kids", ["blue", "beige"], true],
  ["Kids Dino Hoodie", "Urban Loom", "kids", 34.9, null, true, "kids", ["green", "grey"]],
];

// Deterministic stock (3..18) so every seed run produces the same data
const buildVariants = (productIndex, sizeSet, colors, lowStock) => {
  const variants = SIZE_SETS[sizeSet].flatMap((size, s) =>
    colors.map((color, c) => ({
      size,
      color,
      stock: ((productIndex * 7 + (s * colors.length + c) * 5) % 16) + 3,
    }))
  );
  // Low-stock products have a total stock of 2, so the dashboard's lowStockProducts has data
  return lowStock ? variants.slice(0, 2).map((v) => ({ ...v, stock: 1 })) : variants;
};

const buildImages = (slug) =>
  [1, 2].map((n) => ({
    url: `https://picsum.photos/seed/${slug}-${n}/600/800`, // placeholder photos, not Cloudinary
    publicId: `seed/${slug}-${n}`,
  }));

export const buildProducts = (categoryIds) =>
  PRODUCTS.map((row, index) => {
    const [title, brand, category, price, discountPrice, isFeatured, sizeSet, colors, lowStock] = row;
    const slug = makeSlug(title);
    return {
      title,
      slug,
      brand,
      description: `${title} from ${brand}. Soft, durable fabric designed for everyday comfort and an easy fit.`,
      category: categoryIds[category],
      price,
      discountPrice: discountPrice ?? undefined,
      images: buildImages(slug),
      variants: buildVariants(index, sizeSet, colors, lowStock),
      isActive: true,
      isFeatured,
    };
  });

export const buildCoupons = () => {
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  // No maxUses = unlimited
  return [
    { code: "WELCOME10", type: "percent", value: 10, minOrder: 0 },
    { code: "SAVE20", type: "fixed", value: 20, minOrder: 100, maxUses: 100 },
    { code: "SUMMER25", type: "percent", value: 25, minOrder: 150, maxUses: 50 },
  ].map((coupon) => ({ ...coupon, usedCount: 0, isActive: true, expiresAt }));
};