
// This file is used as a placeholder for the Supabase client integration
// All database operations have been removed for local development

// Create a mock client that doesn't actually connect to Supabase
const mockClient = {
  // Add any mock methods here if needed by the application
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  storage: {
    // Add any mock storage methods here if needed
  }
};

export const supabase = mockClient;
