// Global type declarations

// Add mockUserData to Window interface
interface Window {
  mockUserData?: {
    id: number;
    username: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    level?: number;
    points?: number;
    preferences?: {
      gender?: 'male' | 'female' | 'other';
      theme?: 'light' | 'dark';
    };
  };
}