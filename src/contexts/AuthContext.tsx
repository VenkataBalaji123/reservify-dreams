
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
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
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and set up auth subscription
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
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
        .match({ id: userId })
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        console.log('Profile found:', data);
        
        // Check if premium membership is expired
        if (data.is_premium && data.premium_expiry) {
          const now = new Date();
          const expiryDate = new Date(data.premium_expiry);
          
          if (now > expiryDate) {
            // Premium membership has expired, update the profile
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                is_premium: false,
                premium_type: null,
                premium_expiry: null
              })
              .match({ id: userId });
              
            if (updateError) {
              console.error('Error updating expired premium status:', updateError);
            } else {
              // Update local state with expired status
              data.is_premium = false;
              data.premium_type = null;
              data.premium_expiry = null;
            }
          }
        }
        
        setProfile(data);
        return;
      }

      // If we get here, we'll try one more time after a short delay
      // This gives the trigger time to create the profile if it hasn't yet
      console.log('Profile not found on first attempt, retrying after delay...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: retryData, error: retryError } = await supabase
        .from('profiles')
        .select('*')
        .match({ id: userId })
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            date_of_birth: userData.dateOfBirth,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup successful:', data);
      
      // Note: the on_auth_user_created trigger will automatically
      // create a profile and assign a role to the new user

      toast.success('Registration successful! Please check your email for verification.');
      navigate('/signin');
    } catch (error: any) {
      console.error('Error in signUp function:', error);
      toast.error(error.message || 'An error occurred during signup');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Successfully signed in!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
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
        .match({ id: user.id });

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      // Update the local profile state
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
