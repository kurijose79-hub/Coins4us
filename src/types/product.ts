export interface Product {
  id: string;
  name: string;
  category: string;
  country?: string;
  year?: number | string;
  material?: string;
  condition?: string;
  price: number;
  currency?: string;
  stock?: number;
  description?: string;
  image: string;
  featured?: boolean;
}
