// import "../../App.css";
// import { useContext, useState } from "react";
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// import { LoginContext } from "../../context/LoginContext";
// import { login } from "../../apis/backend";
// import Login1 from "./Login1";

// interface DecodedToken {
//   sub?: string;
//   role?: string;
//   exp?: number;
//   username?: string;
//   email?: string;
//   [key: string]: any;
// }

// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser, setIsLoggedIn, setLoading } = useContext(LoginContext);

//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const [error, setError] = useState("");

//   const getCookie = (name: string): string | null => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");

//     try {
//       console.log("Payload sending to backend:", formData);

//       const success = await login(formData);
//       console.log("Login response:", success);

//       if (!success) {
//         setError("Invalid username or password.");
//         return;
//       }

//       // Wait a bit to ensure cookie is set
//       const jwt =
//         getCookie("jwt") ||
//         getCookie("access_token") ||
//         getCookie("token") ||
//         "";

//       if (!jwt) {
//         setError("Token not found after login.");
//         console.error("No JWT found in cookies.");
//         return;
//       }

//       console.log("JWT found:", jwt);

//       // Decode JWT
//       let decoded: DecodedToken;
//       try {
//         decoded = jwtDecode<DecodedToken>(jwt);
//         console.log("Decoded JWT:", decoded);
//       } catch (err) {
//         console.error("Failed to decode JWT:", err);
//         setError("Error decoding token.");
//         return;
//       }

//       // Extract role — fallback to "student" if not provided
//       const role =
//         decoded.resource_access?.["backend-api"]?.roles?.[0] === "admin" ? "admin" : "student";
//         console.log("role :" , role);

//       // Update context
//       setUser({
//         email_id: decoded.preferred_name || decoded.email || formData.username,
//         password: formData.password,
//         role:role,
//       });

//       setIsLoggedIn(true);

//       // Navigate based on role
//       if (role === "admin") navigate("/batch_config");
//       else if (role === "student") navigate("/upload");
//       else setError("Role not recognized in token.");

//     } catch (err) {
//       console.error("Error during login:", err);
//       setError("An error occurred during login.");
//     }
//   };

//   return (
//     <Login1
//       formData={formData}
//       setFormData={setFormData}
//       error={error}
//       setError={setError}
//       handleSubmit={handleSubmit}
//     />
//   );
// };

// export default Login;

// src/components/Login/Login.tsx
// import {jwtDecode} from "jwt-decode";
// import { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { LoginContext, User } from "../../context/LoginContext";
// import { login } from "../../apis/backend";

// interface DecodedToken {
//   preferred_name?: string;
//   email?: string;
//   resource_access?: any;
//   [key: string]: any;
// }

// const Login = () => {
//   const navigate = useNavigate();
//   const { setUser, setIsLoggedIn, setLoading } = useContext(LoginContext);
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");

//   const getCookie = (name: string): string | null => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     const success = await login(formData);
//     if (!success) {
//       setError("Invalid credentials");
//       return;
//     }

//     const token =
//       getCookie("jwt") || getCookie("access_token") || getCookie("token");
//     if (!token) {
//       setError("Token not found");
//       return;
//     }

//     const decoded = jwtDecode<DecodedToken>(token);

//     // Explicitly assert the role to match your union type
//     const role: "admin" | "student" =
//       decoded.resource_access?.["backend-api"]?.roles?.[0] === "admin"
//         ? "admin"
//         : "student";

//     // ✅ Type-safe user object
//     const newUser: User = {
//       email_id: decoded.preferred_name || decoded.email || formData.username,
//       password: formData.password,
//       role: role,
//     };

//     // ✅ This now matches your LoginContext typing perfectly
//     setUser(newUser);
//     setIsLoggedIn(true);
//     setLoading(false);

//     localStorage.setItem("user", JSON.stringify(newUser));
//     localStorage.setItem("isLoggedIn", "true");

//     // redirect
//     navigate(role === "admin" ? "/batch_config" : "/upload");
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={formData.username}
//         onChange={(e) =>
//           setFormData({ ...formData, username: e.target.value })
//         }
//         placeholder="Username"
//       />
//       <input
//         type="password"
//         value={formData.password}
//         onChange={(e) =>
//           setFormData({ ...formData, password: e.target.value })
//         }
//         placeholder="Password"
//       />
//       <button type="submit">Login</button>
//       {error && <div style={{ color: "red" }}>{error}</div>}
//     </form>
//   );
// };

// export default Login;


import "../../App.css";
import { jwtDecode } from "jwt-decode";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext, User } from "../../context/LoginContext";
import { login } from "../../apis/backend";
import Login1 from "./Login1";

interface DecodedToken {
  preferred_name?: string;
  email?: string;
  resource_access?: any;
  [key: string]: any;
}

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn, setLoading } = useContext(LoginContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Helper function to get cookie value by name
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  // Handle login submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Payload sending to backend:", formData);

      const success = await login(formData);
      console.log("Login response:", success);

      if (!success) {
        setError("Invalid username or password.");
        return;
      }

      // Check cookies for JWT
      const token =
        getCookie("jwt") || getCookie("access_token") || getCookie("token");

      if (!token) {
        setError("Token not found after login.");
        console.error("No JWT found in cookies.");
        return;
      }

      // Decode JWT
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("Decoded JWT:", decoded);

      // Extract role safely
      const role: "admin" | "student" =
        decoded.resource_access?.["backend-api"]?.roles?.[0] === "admin"
          ? "admin"
          : "student";

      console.log("Role:", role);

      // Create new user object matching context type
      const newUser: User = {
        email_id: decoded.preferred_name || decoded.email || formData.username,
        password: formData.password,
        role: role,
      };

      // Update context
      setUser(newUser);
      setIsLoggedIn(true);
      setLoading(false);

      // Persist user info in localStorage
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("isLoggedIn", "true");

      // Navigate by role
      navigate(role === "admin" ? "/batch_config" : "/upload");
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred during login.");
    }
  };

  // ✅ Render Login1 and pass all props to it
  return (
    <Login1
      formData={formData}
      setFormData={setFormData}
      error={error}
      setError={setError}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;


