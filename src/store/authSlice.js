import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabaseClient';

// Helper: Fetch the custom profile (Role & Department)
const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
            full_name, 
            role, 
            department_id,
            departments ( name )
        `)
        .eq('id', userId)
        .single();
    
    if (error) {
        console.warn("Profile fetch warning:", error.message);
        return null; 
    }

    return {
        ...data,
        department_name: data.departments?.name || 'N/A', 
    };
}

// Thunk: Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // 2. Fetch the extra Profile Data (Role)
      const profile = await fetchUserProfile(data.user.id);
      
      if (!profile) {
          return rejectWithValue("Login successful, but User Profile (Role) is missing. Please contact Admin.");
      }
      
      // 3. Merge and return
      return { ...data.user, ...profile };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk: Restore Session (Page Reload)
export const loadUserSession = createAsyncThunk(
    'auth/loadUserSession',
    async (_, { rejectWithValue }) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { user: null, isAuthenticated: false };

            const profile = await fetchUserProfile(session.user.id);
            
            // If profile missing, we are authenticated but not authorized
            if (!profile) return { user: session.user, isAuthenticated: true, roleMissing: true };

            return { 
                user: { ...session.user, ...profile }, 
                isAuthenticated: true,
                roleMissing: false
            };
        } catch (error) {
            return rejectWithValue("Session invalid.");
        }
    }
);

// Thunk: Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await supabase.auth.signOut();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true, // Start true to prevent flash of login screen
    error: null,
    isAuthenticated: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Load Session
      .addCase(loadUserSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(loadUserSession.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;