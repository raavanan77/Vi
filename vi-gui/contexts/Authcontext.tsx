  "use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get<User>('http://localhost:8000/auth/user/');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);
  
  const fetchUser = async (): Promise<void> => {
    try {
      const response = await axios.get<User>('http://localhost:8000/auth/user/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setUser(response.data);
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      setLoading(false);
    };
  
    const login = async (username: string, password: string): Promise<LoginResult> => {
      try {
        const response = await axios.post<AuthResponse>('http://localhost:8000/auth/login/', {
          username,
          password
        });
        
        // Store token in secure HTTP-only cookie (done by backend)
        // Store user in state
        setUser(response.data.user);
        
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }
    };
  
  const register = async (
    username: string, 
    email: string, 
    password: string
  ): Promise<RegisterResult> => {
    try {
      const response = await axios.post<AuthResponse>('http://localhost:8000/auth/register/', {
        username,
        email,
        password
      });
      
      return { success: true };
    } catch (error) {
    return {
      success: false,
      error: 'An error occurred'
    };
  }
};
  
const logout = async () => {
  try {
    // Call logout endpoint to clear cookie
    await axios.post('/api/auth/logout');
    setUser(null);
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
  
  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
  
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    router.push('/login');
  }
  
  return <>{children}</>;
};