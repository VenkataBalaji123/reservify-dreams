
export interface Movie {
  id: string;
  title: string;
  description: string | null;
  language_id: string | null;
  category_id: string | null;
  duration: number | null;
  rating: number | null;
  release_date: string | null;
  image_url: string | null;
  base_price: number;
  status: string | null;
}

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface MovieCategory {
  id: string;
  name: string;
}
