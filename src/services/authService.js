import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      // Validate password strength
      const passwordError = validatePassword(userData.password);
      if (passwordError) {
        return { success: false, message: passwordError };
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Create user document in Firestore
      const userDoc = {
        uid: user.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        userType: userData.userType,
        address: userData.address || '',
        status: 'active',
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        displayName: `${userData.firstName} ${userData.lastName}`
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);

      // Send email verification (skip for admin if you want, but keeping it for all)
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-success`,
        handleCodeInApp: false
      });

      // Sign out user immediately after registration
      await signOut(auth);

      return { 
        success: true, 
        message: 'Registration successful! Please check your email to verify your account. You must verify your email before you can login.',
        user: userDoc
      };

    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please use a different email or login.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message || 'Registration failed. Please try again.';
      }
      
      return { success: false, message: errorMessage };
    }
  },

  // Login user - NO email verification required for admin
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore first to check user type
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        await signOut(auth);
        return { success: false, message: 'User data not found. Please contact support.' };
      }

      const userData = userDoc.data();

      // Skip email verification check for admin users
      if (!user.emailVerified && userData.userType !== 'admin') {
        await signOut(auth);
        return { 
          success: false, 
          message: 'Email not verified. Please verify your email before logging in.' 
        };
      }

      return { 
        success: true, 
        message: 'Login successful!',
        user: userData
      };

    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please register first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message || 'Login failed. Please try again.';
      }
      
      return { success: false, message: errorMessage };
    }
  },

  // Send password reset email
  forgotPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login?reset=true`,
        handleCodeInApp: false
      });
      return { 
        success: true, 
        message: 'Password reset email sent! Please check your inbox and follow the instructions.' 
      };
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message || 'Failed to send reset email. Please try again.';
      }
      
      return { success: false, message: errorMessage };
    }
  },

  // Check email verification status
  checkEmailVerification: async () => {
    try {
      await auth.currentUser?.reload();
      return auth.currentUser?.emailVerified || false;
    } catch (error) {
      console.error('Error checking email verification:', error);
      return false;
    }
  },

  // Resend verification email
  resendVerificationEmail: async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
          url: `${window.location.origin}/verify-success`,
          handleCodeInApp: false
        });
        return { 
          success: true, 
          message: 'Verification email sent! Please check your inbox.' 
        };
      }
      return { success: false, message: 'No user logged in.' };
    } catch (error) {
      console.error('Error resending verification email:', error);
      return { success: false, message: 'Failed to send verification email. Please try again.' };
    }
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return {
              ...userData,
              isAuthenticated: true,
              emailVerified: user.emailVerified
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed. Please try again.' };
    }
  },

  // Update user password
  updatePassword: async (newPassword) => {
    try {
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        return { success: false, message: passwordError };
      }

      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        return { success: true, message: 'Password updated successfully!' };
      }
      return { success: false, message: 'No user logged in.' };
    } catch (error) {
      console.error('Error updating password:', error);
      let errorMessage = 'Failed to update password. Please try again.';
      
      switch (error.code) {
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Please login again to change your password.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = error.message || 'Failed to update password. Please try again.';
      }
      
      return { success: false, message: errorMessage };
    }
  }
};

// Password validation function
const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return 'Password must contain at least one special character (@$!%*?&)';
  }
  
  return null;
};