export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  defaultImg: string;
  images?: string[];
  category: string;
  // category: string | Category;
  stock?: number;
  // variations?: ProductVariation[];
  featured?: boolean,
  visible?: boolean,
  deleted?: boolean,
  createdAt?: string;
  updatedAt?: string;
}

// export interface ProductVariation {
//   _id: string;
//   name: string;
//   price?: number;
//   stock?: number;
// }

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductsResponse {
  message: string;
  data: Product[];
}

export interface ProductResponse {
  message: string;
  data: Product;
}

export interface CategoriesResponse {
  message: string;
  data: Category[];
}
