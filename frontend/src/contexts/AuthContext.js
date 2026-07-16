import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // User roles
  const ROLES = {
    ADMIN: 'admin',
    LAWYER: 'lawyer',
    USER: 'user'
  };

  // Mock user database (in production, this would be from a backend)
  const mockUsers = [
    {
      id: 1,
      email: 'admin@legalaid.com',
      password: 'admin123',
      role: ROLES.ADMIN,
      name: 'System Administrator',
      permissions: ['manage_users', 'manage_content', 'view_analytics', 'manage_ai_models']
    },
    {
      id: 2,
      email: 'lawyer@legalaid.com',
      password: 'lawyer123',
      role: ROLES.LAWYER,
      name: 'Legal Expert',
      specialization: 'Civil Law',
      permissions: ['review_queries', 'manage_resources', 'handle_escalations']
    },
    {
      id: 3,
      email: 'user@legalaid.com',
      password: 'user123',
      role: ROLES.USER,
      name: 'John Doe',
      permissions: ['access_chatbot', 'download_templates', 'book_consultation']
    }
  ];

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('auth_user');
    const savedToken = localStorage.getItem('auth_token');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock database
      const foundUser = mockUsers.find(
        user => user.email === email && user.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Remove password from user object for security
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Generate mock JWT token
      const token = btoa(JSON.stringify({ 
        userId: foundUser.id, 
        role: foundUser.role,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));

      // Save to localStorage
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('auth_token', token);

      setUser(userWithoutPassword);
      setIsAuthenticated(true);

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => hasRole(ROLES.ADMIN);
  const isLawyer = () => hasRole(ROLES.LAWYER);
  const isUser = () => hasRole(ROLES.USER);

  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would create a new user in the database
      const newUser = {
        id: Date.now(),
        email: userData.email,
        role: ROLES.USER, // Default role for new registrations
        name: userData.name,
        permissions: ['access_chatbot', 'download_templates', 'book_consultation']
      };

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...updatedData };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateProfile,
    hasPermission,
    hasRole,
    isAdmin,
    isLawyer,
    isUser,
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
