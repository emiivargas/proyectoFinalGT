import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function SupabaseAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // { role: 'user'|'admin' }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        setProfile(data || null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };
    run();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        setProfile(data || null);
      } else {
        setProfile(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user: session?.user || null,
    profile,
    isAdmin: profile?.role === 'admin',
    loading,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
