export interface ProductVariation {
  _id?: string;
  colorName: string;
  colorValue: string;
  defaultImage: string;
  variationImgs: string[];
  isDefault: boolean;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  variations: ProductVariation[];
  featured?: boolean;
  visible?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  // Computed properties for backward compatibility
  defaultImg?: string;
  images?: string[];
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface ProductsResponse {
  message: string;
  data: Product[];
}

export interface ProductResponse {
  message: string;
  data: Product | Product[] | null;
}

export interface CategoriesResponse {
  message: string;
  data: Category[];
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Helper function to get default image from variations
export function getProductDefaultImage(product: Product): string {
  const defaultVariation = product.variations?.find(v => v.isDefault);
  return defaultVariation?.defaultImage || product.variations?.[0]?.defaultImage || 'https://via.placeholder.com/300?text=No+Image';
}

// Helper function to get all images from variations
export function getProductImages(product: Product): string[] {
  if (!product.variations || product.variations.length === 0) {
    return [];
  }
  
  const allImages: string[] = [];
  product.variations.forEach(variation => {
    if (variation.defaultImage) {
      allImages.push(variation.defaultImage);
    }
    if (variation.variationImgs) {
      allImages.push(...variation.variationImgs);
    }
  });
  
  return allImages;
}
