/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import toast from "react-hot-toast";
import app from "../firebase/firebase.config";
import useAxios from "../hooks/useAxios";

const auth = getAuth(app);
export const ContextData = createContext(null);

const AuthContext = ({ children }) => {
  const axiosCommon = useAxios();
  const [user, setUser] = useState(null);
  const [whoMe, setWhoMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save user data to backend
  const saveUserToBackend = async (userData) => {
    try {
      const { data } = await axiosCommon.post("/register", userData);
      return data;
    } catch (error) {
      console.error("Error saving user to backend:", error?.response?.data?.message || error.message);
      toast.error("Failed to register user.");
      throw error;
    }
  };

  // Create a new user
  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, `${email}@gmail.com`, password);
      const { user: firebaseUser } = userCredential;

      const userPayload = {
        uid: firebaseUser.uid,
        username: email,
        email: `${email}@gmail.com`,
        createdAt: new Date().toISOString(),
        status: "inactive",
        balance: 0,
        role: "user",
      };

      // Save user data to the backend
      await saveUserToBackend(userPayload);
      profileUpdate(email)
      
      return userCredential;
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error.message);
      toast.error("Error during registration.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const profileUpdate = async (name) => {
    setLoading(true);
    await updateProfile(auth.currentUser, {
      displayName: name,
    
    });
    window.location.reload()
  };

  // User sign-in
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, `${email}@gmail.com`, password);
      
      return userCredential;
    } catch (error) {
      console.error("Error signing in:", error?.response?.data?.message || error.message);
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User logout
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      toast.success("Logged out successfully.");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error?.response?.data?.message || error.message);
      toast.error("Logout failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const deleteUser = async (uid) => {
    setLoading(true);
    try {
      const response = await axiosCommon.delete(`/delete-user/${uid}`);
      console.log("User deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user info
  const myInfo = async (userEmail) => {
    try {
      const { data } = await axiosCommon.get(`/me/${userEmail}`);
      setWhoMe(data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        await myInfo(currentUser.email);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosCommon]);

  // Context value
  const contextData = {
    createUser,
    signIn,
    logOut,
    user,
    loading,
    deleteUser,
    whoMe,
    myInfo,
  };

  return <ContextData.Provider value={contextData}>{children}</ContextData.Provider>;
};

export default AuthContext;
