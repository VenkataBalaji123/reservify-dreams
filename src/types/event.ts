
export interface Event {
  id: string;
  name: string;
  description: string;
  event_type: string;
  location: string;
  start_date: string;
  end_date: string;
  base_price: number;
  max_price: number | null;
  image_url: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
}

export interface WishlistItem {
  id: string;
  item_id: string;
  item_type: 'event' | 'flight' | 'movie' | 'train';
  created_at: string;
}
