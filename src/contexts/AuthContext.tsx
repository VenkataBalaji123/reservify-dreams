
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileType {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_premium?: boolean;
  premium_type?: string;
  premium_expiry?: string;
  phone?: string;
  date_of_birth?: string;
  updated_at?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  profile: ProfileType | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signUp: async () => ({ data: null, error: new Error('Not implemented') }),
  signIn: async () => ({ data: null, error: new Error('Not implemented') }),
  signOut: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Use setTimeout to prevent potential deadlock with Supabase client
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        console.log('Profile found:', data);
        
        if (data.is_premium && data.premium_expiry) {
          const now = new Date();
          const expiryDate = new Date(data.premium_expiry);
          
          if (now > expiryDate) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                is_premium: false,
                premium_type: null,
                premium_expiry: null
              })
              .eq('id', userId);
              
            if (updateError) {
              console.error('Error updating expired premium status:', updateError);
            } else {
              data.is_premium = false;
              data.premium_type = null;
              data.premium_expiry = null;
            }
          }
        }
        
        setProfile(data);
        return;
      }

      console.log('Profile not found on first attempt, retrying after delay...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: retryData, error: retryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (retryError) {
        console.error('Error in second profile fetch attempt:', retryError);
        return;
      }

      if (retryData) {
        console.log('Profile found on retry:', retryData);
        setProfile(retryData);
      } else {
        console.error('Profile not found after second attempt');
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('Signing up user with data:', { email, userData });
      
      // Pass userData directly to options.data so it's correctly stored in raw_user_meta_data
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: window.location.origin + '/signin',
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { data: null, error };
      }

      console.log('Signup successful:', data);
      return { data, error: null };
    } catch (error: any) {
      console.error('Error in signUp function:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error };
      }

      console.log("Sign in successful:", data);
      return { data, error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      toast.success('Successfully signed out!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      console.log('Updating profile with data:', data);

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      setProfile({ ...profile, ...data });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
