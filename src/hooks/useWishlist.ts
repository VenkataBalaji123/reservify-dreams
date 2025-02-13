
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WishlistItem } from '@/types/event';
import { toast } from 'sonner';

export const useWishlist = (itemId: string, itemType: 'event' | 'flight' | 'movie' | 'train') => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkWishlist = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .single();

      setIsInWishlist(!!data);
      setIsLoading(false);
    };

    checkWishlist();
  }, [itemId, itemType]);

  const toggleWishlist = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Please sign in to manage wishlist');
      return;
    }

    if (isInWishlist) {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', session.user.id)
        .eq('item_id', itemId)
        .eq('item_type', itemType);

      if (!error) {
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      }
    } else {
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: session.user.id,
          item_id: itemId,
          item_type: itemType
        });

      if (!error) {
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    }
  };

  return { isInWishlist, isLoading, toggleWishlist };
};
