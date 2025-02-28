interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<LoginResult>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<RegisterResult>;
  logout: () => void;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

interface RegisterResult {
  success: boolean;
  error?: string | Record<string, string[]>;
}

interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}
