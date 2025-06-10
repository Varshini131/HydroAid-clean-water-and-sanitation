import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseKey, isSupabaseConfigured } from "./config.js";

// Initialize Supabase client with explicit session storage
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        storageKey: "hydroaid-auth-token",
        storage: window.localStorage,
      },
    })
  : null;

// Auth state management
export const checkAuth = async () => {
  if (!supabase) {
    console.warn(
      "Supabase not configured. Please set up your Supabase project."
    );
    return { user: null, session: null };
  }

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;

    // Debug logging
    console.log("Current session:", session);

    if (session) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      console.log("Current user:", user);
      return { user, session };
    }

    return { user: null, session: null };
  } catch (error) {
    console.error("Auth check error:", error);
    return { user: null, session: null };
  }
};

// Sign up function
export const signUp = async (email, password) => {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

// Sign in function
export const signIn = async (email, password) => {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Debug logging
    console.log("Sign in successful:", data);

    // Verify session was created
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("Session after sign in:", session);

    return data;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

// Sign out function
export const signOut = async () => {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// Auth state change listener
export const onAuthStateChange = (callback) => {
  if (!supabase) {
    console.warn("Supabase not configured");
    return () => {}; // Return empty unsubscribe function
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return subscription.unsubscribe;
};

// Redirect if not authenticated
export const requireAuth = async () => {
  const { user, session } = await checkAuth();
  const currentPath = window.location.pathname;

  // Debug logging
  console.log("Auth check:", { user, session, currentPath });

  // List of public pages that don't require authentication
  const publicPages = ["/", "/index.html", "/login.html", "/signup.html"];
  const isPublicPage = publicPages.some(
    (page) => currentPath === page || currentPath.endsWith(page)
  );

  // If user is not authenticated and trying to access a protected page
  if (!user && !isPublicPage) {
    console.log("Redirecting to login: User not authenticated");
    window.location.href = "/login.html";
    return false;
  }

  // If user is authenticated and trying to access login/signup, redirect to dashboard
  if (
    user &&
    (currentPath.includes("login") || currentPath.includes("signup"))
  ) {
    console.log("Redirecting to dashboard: User already authenticated");
    window.location.href = "/dashboard.html";
    return true;
  }

  return !!user;
};

// Initialize auth state for protected pages
export const initAuthState = async () => {
  const { user } = await checkAuth();

  // Set up logout button if present
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut();
        window.location.href = "/index.html";
      } catch (error) {
        console.error("Logout error:", error);
      }
    });
  }

  // Display user email if element exists
  const userEmailElement = document.getElementById("userEmail");
  if (userEmailElement && user) {
    userEmailElement.textContent = user.email;
  }

  return user;
};

// Set up auth state change listener for all pages
if (typeof window !== "undefined") {
  // Only set up listener if we're in the browser
  onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      // Redirect to home page on sign out
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes("index") &&
        !currentPath.includes("login") &&
        !currentPath.includes("signup")
      ) {
        window.location.href = "/index.html";
      }
    }
  });
}
