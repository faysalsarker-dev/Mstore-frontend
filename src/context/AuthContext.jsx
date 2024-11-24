/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import toast from "react-hot-toast";
import app from "../firebase/firebase.config";
import useAxios from "../hooks/useAxios";

const auth = getAuth(app);

export const ContextData = createContext(null);

const AuthContext = ({ children }) => {
  const axiosCommon = useAxios();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


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


  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;

      const userPayload = {
        uid: firebaseUser.uid,
        username: email,
        createdAt: new Date().toISOString(),
        status: "inactive",
        balance: 0,
        role: "user",
      };

      // Save user data to the backend
      await saveUserToBackend(userPayload);

      toast.success("User registered successfully!");
      return userCredential;
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error.message);
      toast.error("Error during registration.");
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      return userCredential;
    } catch (error) {
      console.error("Error signing in:", error?.response?.data?.message || error.message);
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

 
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await axiosCommon.post("/logout"); // Notify backend about the logout
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

  const deleteUser = async (uid) => {
    try {
      setLoading(true);

      // Make a request to the backend to delete the user
      const response = await axiosCommon.delete(`/delete-user/${uid}`);
      console.log('User deleted successfully:', response.data);

    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        // try {
        //   const { email } = currentUser;
        //   const { data } = await axiosCommon.post("/jwt", { email }); // Obtain JWT token
        //   localStorage.setItem("token", data.token); // Save token securely
        //   toast.success("Session restored successfully.");
        // } catch (error) {
        //   console.error("Error during token retrieval:", error?.response?.data?.message || error.message);
        //   toast.error("Failed to restore session.");
        // }
      } else {
        setUser(null);
        localStorage.removeItem("token"); // Remove token on logout
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
    deleteUser
  };

  return <ContextData.Provider value={contextData}>{children}</ContextData.Provider>;
};

export default AuthContext;
