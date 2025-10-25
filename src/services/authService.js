import { setUserToStorage, removeUserFromStorage, getUserFromStorage } from '../utils/helpers';

// Enhanced mock database with more users
const mockUsers = [
  {
    id: 1,
    email: 'admin@neighborhood.com',
    password: 'admin123',
    userType: 'admin',
    firstName: 'System',
    lastName: 'Administrator',
    phone: '+267-123-4567',
    address: 'System Administration',
    isApproved: true,
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    email: 'security@neighborhood.com',
    password: 'security123',
    userType: 'security',
    firstName: 'John',
    lastName: 'Security',
    phone: '+267-234-5678',
    address: 'Security Quarters',
    isApproved: true,
    createdAt: '2024-01-02'
  },
  {
    id: 3,
    email: 'member@neighborhood.com',
    password: 'member123',
    userType: 'member',
    firstName: 'Jane',
    lastName: 'Member',
    phone: '+267-345-6789',
    address: '123 Community Street, Gaborone',
    isApproved: true,
    createdAt: '2024-01-03'
  },
  {
    id: 4,
    email: 'test@example.com',
    password: 'test123',
    userType: 'member',
    firstName: 'Test',
    lastName: 'User',
    phone: '+267-456-7890',
    address: '456 Test Avenue, Francistown',
    isApproved: false,
    createdAt: '2024-01-04'
  }
];

// Store registered users separately
let registeredUsers = [...mockUsers];

export const authService = {
  login: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      if (!user.isApproved) {
        return { 
          success: false, 
          message: 'Your account is pending administrator approval. Please try again later.' 
        };
      }
      
      const userData = {
        id: user.id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };
      
      setUserToStorage(userData);
      return { success: true, user: userData };
    }
    
    return { success: false, message: 'Invalid email or password' };
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already exists
    const existingUser = registeredUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    // Create new user (pending approval)
    const newUser = {
      id: registeredUsers.length + 1,
      email: userData.email,
      password: userData.password,
      userType: userData.userType,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      address: userData.address || 'Not specified',
      isApproved: false, // All new registrations require admin approval
      createdAt: new Date().toISOString()
    };
    
    registeredUsers.push(newUser);
    
    console.log('New user registered (pending approval):', newUser);
    
    return { 
      success: true, 
      message: 'Registration submitted successfully! Your account is pending administrator approval. You will receive an email when your account is activated.' 
    };
  },

  logout: () => {
    removeUserFromStorage();
  },

  getCurrentUser: () => {
    return getUserFromStorage();
  },

  isAuthenticated: () => {
    const user = getUserFromStorage();
    return !!(user && user.isAuthenticated);
  },

  // For demo purposes - approve a user
  approveUser: (email) => {
    const user = registeredUsers.find(u => u.email === email);
    if (user) {
      user.isApproved = true;
      return true;
    }
    return false;
  },

  // Get all users (for admin)
  getUsers: () => {
    return registeredUsers;
  }
};