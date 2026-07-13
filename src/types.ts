export enum MenuCategory {
  SNIADANIA = "sniadania",
  OBIADY = "obiady",
  CIASTKA = "ciastka",
  KAWY = "kawy",
  NAPOJE = "napoje"
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceEur: number;
  pricePln: number;
  category: MenuCategory;
  tags: string[];
  imageUrl: string;
}

export interface FacebookPost {
  id: string;
  date: string;
  content: string;
  category: string;
  imgUrl: string;
  facebookUrl: string;
  isRealSync: boolean;
}

export interface CafeReview {
  author: string;
  rating: number;
  text: string;
  date: string;
  source: "Facebook" | "Google";
}
