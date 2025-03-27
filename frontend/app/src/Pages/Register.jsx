import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RegisterImg from "../assets/register.png";
import { createUser, login } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

export default function Register({ setSocket }) {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const handleRegister = async (formData) => {
    try {
      const clientData = {
        username: formData.clientName,
        data_url: formData.data_path,
        password: formData.password,
      };

      const res = await createUser(clientData);

      if (res.status >= 200 && res.status < 300) {
        alert("User created successfully");
        reset();
        setIsLogin(true); // Switch to login form after successful registration
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      alert(errorMessage);
    }
  };

  const toggleForm = () => setIsLogin(!isLogin);

  const password = watch("password");

  return (
    <div className="flex flex-col items-center justify-center sm:flex-row sm:space-x-12 my-12">
      <div className="sm:block w-1/4 max-w-md">
        <img src={RegisterImg} alt="FedClient" className="w-full h-auto" />
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </h1>

        {isLogin ? (
          <LoginForm navigate={navigate} />
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit(handleRegister)}>
            <div>
              <label className="block text-sm font-medium">Client Name:</label>
              <input
                type="text"
                className={`w-full p-2 border rounded ${
                  errors.clientName ? "border-red-500" : "border-gray-300"
                }`}
                {...register("clientName", {
                  required: "Client Name is required",
                })}
              />
              {errors.clientName && (
                <p className="text-red-500 text-xs">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Data Path:</label>
              <input
                type="text"
                className={`w-full p-2 border rounded ${
                  errors.data_path ? "border-red-500" : "border-gray-300"
                }`}
                {...register("data_path", {
                  required: "Data Path is required",
                })}
              />
              {errors.data_path && (
                <p className="text-red-500 text-xs">
                  {errors.data_path.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Password:</label>
              <input
                type="password"
                className={`w-full p-2 border rounded ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Confirm Password:
              </label>
              <input
                type="password"
                className={`w-full p-2 border rounded ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        <p
          className="mt-4 text-blue-500 cursor-pointer text-center"
          onClick={toggleForm}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

const LoginForm = ({ navigate }) => {
  const { login: authLogin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleLogin = async (formData) => {
    try {
      const credentials = {
        username: formData.clientName,
        password: formData.password,
      };

      const response = await login(credentials);

      // Validate response structure
      if (!response.data?.access_token) {
        throw new Error("Invalid server response");
      }

      authLogin({
        ...response.data,
        username: formData.clientName,
      });

      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Login failed. Please check your credentials";
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Client Name:</label>
        <input
          type="text"
          className={`w-full p-2 border rounded ${
            errors.clientName ? "border-red-500" : "border-gray-300"
          }`}
          {...register("clientName", {
            required: "Client Name is required",
          })}
        />
        {errors.clientName && (
          <p className="text-red-500 text-xs">{errors.clientName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Password:</label>
        <input
          type="password"
          className={`w-full p-2 border rounded ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useGlobalData } from "../GlobalContext";
// import axios from "axios";
// import RegisterImg from "../assets/register.png";
// import { createUser, getMe, login } from "../services/authService";
// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

// const register_client_URL = process.env.REACT_APP_REGISTER_CLIENT_URL;
// export default function Register({ setSocket }) {
//   const { GlobalData, setGlobalData } = useGlobalData();
//   const [isLogin, setIsLogin] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const onSubmit = async (formData) => {
//     const clientData = {
//       username: formData.clientName,
//       data_url: formData.data_path,
//       password: formData.password,
//     };

//     try {
//       const res = await createUser(clientData);
//       if (res.status === 201) {
//         alert("User created successfully");
//         reset();
//         setIsLogin(true);
//       } else {
//         console.error("Failed to submit the request:", res);
//       }
//     } catch (error) {
//       if (error.response?.data?.detail) {
//         alert(error.response.data.detail);
//       }
//       console.error("Error submitting the request:", error);
//     }
//   };

//   const toggleForm = () => {
//     setIsLogin((prevIsLogin) => !prevIsLogin);
//   };

//   const password = watch("password");

//   return (
//     <div className="flex flex-col items-center justify-center sm:flex-row sm:space-x-12 my-12">
//       {/* Left Side - Image */}
//       <div className="sm:block w-1/4 max-w-md">
//         <img src={RegisterImg} alt="FedClient" className="w-full h-auto" />
//       </div>

//       {/* Right Side - Form */}
//       <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
//         <h1 className="text-2xl font-bold text-center mb-6">
//           {isLogin ? "Login" : "Register"}
//         </h1>

//         {isLogin ? (
//           <LoginForm />
//         ) : (
//           <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
//             <div>
//               <label className="block text-sm font-medium">Client Name:</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded"
//                 {...register("clientName", { required: true })}
//               />
//               {errors.clientName && (
//                 <p className="text-red-500 text-xs">Client Name is required.</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium">Data Path:</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded"
//                 {...register("data_path", { required: true })}
//               />
//               {errors.data_path && (
//                 <p className="text-red-500 text-xs">Data Path is required.</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium">Password:</label>
//               <input
//                 type="password"
//                 className="w-full p-2 border rounded"
//                 {...register("password", { required: true, minLength: 6 })}
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-xs">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium">
//                 Confirm Password:
//               </label>
//               <input
//                 type="password"
//                 className="w-full p-2 border rounded"
//                 {...register("confirmPassword", {
//                   required: true,
//                   validate: (value) =>
//                     value === password || "Passwords do not match",
//                 })}
//               />
//               {errors.confirmPassword && (
//                 <p className="text-red-500 text-xs">
//                   {errors.confirmPassword.message}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               Register
//             </button>
//           </form>
//         )}

//         <p
//           className="mt-4 text-blue-500 cursor-pointer text-center"
//           onClick={toggleForm}
//         >
//           {isLogin
//             ? "Don't have an account? Register"
//             : "Already have an account? Login"}
//         </p>
//       </div>
//     </div>
//   );
// }

// const LoginForm = () => {
//   const { login: loginContext, api } = useAuth();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (formData) => {
//     try {
//       const response = await login({
//         username: formData.clientName,
//         password: formData.password,
//       });
//       loginContext(response.data);
//       await getMe(api);
//     } catch (error) {
//       if (error.response?.status === 400) {
//         alert(error.response.data.detail);
//       }
//     }
//   };

//   return (
//     <form
//       className="flex flex-col items-center w-full max-w-md mt-6 space-y-4"
//       onSubmit={handleSubmit(onSubmit)}
//     >
//       <div className="w-full">
//         <label className="block text-sm font-medium">Client Name:</label>
//         <input
//           type="text"
//           className="w-full p-2 border rounded"
//           {...register("clientName", { required: true })}
//         />
//         {errors.clientName && (
//           <p className="text-red-500 text-xs">Client Name is required.</p>
//         )}
//       </div>

//       <div className="w-full">
//         <label className="block text-sm font-medium">Password:</label>
//         <input
//           type="password"
//           className="w-full p-2 border rounded"
//           {...register("password", { required: true, minLength: 6 })}
//         />
//         {errors.password && (
//           <p className="text-red-500 text-xs">{errors.password.message}</p>
//         )}
//       </div>

//       <button
//         type="submit"
//         className="w-full px-4 py-2 bg-green-500 text-white rounded"
//       >
//         Login
//       </button>
//     </form>
//   );
// };
