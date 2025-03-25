import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// Create the context
const AuthContext = createContext(null);

// Default userData object with standardized keys
const defaultUserData = {
  serviceUrl: "http://103.168.19.35/iStWebPublic/iStreamsSmartPublic.asmx",
  organization: null,
  clientURL: null,
  doConnectionParameter: null,
  currentUserLogin: null,
  currentUserName: null,
  currentUserEmpNo: null,
  currentUserImageData: "null",
};

export const AuthProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // auth only stores token and email for authentication
  const [auth, setAuth] = useState(() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      return storedAuth ? JSON.parse(storedAuth) : { token: null, email: null };
    } catch (error) {
      console.error("Error parsing stored auth:", error);
      return { token: null, email: null };
    }
  });

  // userData stores extended user information
  const [userData, setUserData] = useState(() => {
    try {
      const storedUserData = localStorage.getItem("userData");
      return storedUserData ? JSON.parse(storedUserData) : defaultUserData;
    } catch (error) {
      console.error("Error parsing stored userData:", error);
      return defaultUserData;
    }
  });

  // Optionally, sync state from localStorage on mount
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      const storedUserData = localStorage.getItem("userData");
      if (storedAuth) {
        setAuth(JSON.parse(storedAuth));
      }
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error("Error parsing stored data:", error);
    }
  }, []);

  // Memoized login function: expects data to have token, email, and other user details
  const login = useCallback((data) => {
    // Set minimal authentication data
    const authData = { token: data.token, email: data.email };
    setAuth(authData);
    localStorage.setItem("auth", JSON.stringify(authData));

    // Merge new user details with the default userData structure
    const newUserData = { ...defaultUserData, ...data };
    // Remove token and email if they exist in newUserData to avoid redundancy
    delete newUserData.token;
    delete newUserData.email;

    setUserData(newUserData);
    localStorage.setItem("userData", JSON.stringify(newUserData));
  }, []);

  // Memoized logout function: resets auth and userData
  const logout = useCallback(() => {
    setAuth({ token: null, email: null });
    setUserData(defaultUserData);
    localStorage.removeItem("auth");
    localStorage.removeItem("userData");
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, userData, setUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
