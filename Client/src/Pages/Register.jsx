import React from "react";
import { set, useForm } from "react-hook-form";
import { useGlobalData } from "../GlobalContext";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import RegisterImg from "../assets/register.png";
import { createUser, getMe, login } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const register_client_URL = process.env.REACT_APP_REGISTER_CLIENT_URL;
export default function Register({ setSocket }) {
  const { GlobalData, setGlobalData } = useGlobalData();
  const [showToast, setShowToast] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (formData) => {
    const clientData = {
      username: formData.clientName,
      data_url: formData.data_path,
      password: formData.password,
    };

    try {
      const res = await createUser(clientData)
      if (res.status === 201) {
        alert('User created successfully')

        reset()

        setIsLogin(true)
      } else {
        console.error("Failed to submit the request:", res);
      }
    } catch (error) {
      if (error.response.data.detail) {
        alert(error.response.data.detail)
      }

      console.error("Error submitting the request:", error);
    }
  };

  const toggleForm = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin); // Toggle between login and register
  };

  const password = watch('password')

  // const handleDeregistration = (event) => {
  //   event.preventDefault();
  //   if (GlobalData.ConnectionObject) GlobalData.ConnectionObject.close();
  //   setGlobalData({
  //     ...GlobalData,
  //     Client: {
  //       ...GlobalData.Client,
  //       ClientID: "",
  //       DataPath: "",
  //       Password: "",
  //     },
  //     ConnectionObject: null,
  //   });
  //   console.log("Deregistered:", GlobalData.ConnectionObject == null);
  // };

  // registration form
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>

      <h1>{isLogin ? "Login" : "Register"}</h1>

      {
        isLogin
          ? <LoginForm />
          : <form
            id="Registration-form"
            className="row d-flex justify-content-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="col-2 mt-5">
              <img src={RegisterImg} alt="FedClient" className="img-fluid" />
            </div>
            <div className="col-8">
              <div className="col-8">
                <label htmlFor="clientName" className="form-label">
                  Client Name:
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.clientName ? "is-invalid" : ""
                    }`}
                  id="clientName"
                  placeholder="Enter Client Name"
                  defaultValue={GlobalData.Client.ClientName}
                  {...register("clientName", { required: true })}
                />
                {errors.clientName && (
                  <div className="invalid-feedback">Client Name is required.</div>
                )}
              </div>
              <div className="col-8">
                <label htmlFor="data_path" className="form-label">
                  Data Path:
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.data_path ? "is-invalid" : ""}`}
                  id="data_path"
                  placeholder="Enter Data Path"
                  defaultValue={GlobalData.Client.DataPath}
                  {...register("data_path", { required: true })}
                />
                {errors.data_path && (
                  <div className="invalid-feedback">Data Path is required.</div>
                )}
              </div>
              <div className="col-8">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  id="password"
                  placeholder="Enter Password"
                  defaultValue={GlobalData.Client.Password}
                  {...register("password",
                    {
                      required: "Password is required.",
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long',
                      }
                    }
                  )}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password.message}</div>
                )}
              </div>

              <div className="col-8">
                <label htmlFor="password" className="form-label">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  id="confirm-password"
                  placeholder="Enter Password"
                  defaultValue={GlobalData.Client.Password}
                  {...register(
                    "confirmPassword",
                    {
                      required: "Confirm Password is required.",
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    }
                  )
                  }
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                )}
              </div>
              <div className="col-8 mt-5 d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-success mx-5 border border-primary"
                  id="liveToastBtn"
                >
                  Register
                </button>

                {/* <button
                type="button"
                className="btn btn-secondary mx-5 border border-primary"
                onClick={handleDeregistration}
              >
                Deregister
              </button> */}
              </div>
            </div>
          </form>
      }

      <a onClick={toggleForm} style={{ marginTop: "20px", cursor: "pointer", color: "#0077ff" }}>
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </a>
    </div>
  );
}

const LoginForm = () => {
  const { GlobalData, setGlobalData } = useGlobalData();
  const { login: loginContext, api } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (formdata) => {
    login({ username: formdata.clientName, password: formdata.password })
      .then((response) => {
        loginContext(response.data)
        getMe(api)
          .then(console.log)
          .catch(console.log)
      })
      .catch(error => {
        if (error.response.status == 400) {
          alert(error.response.data.detail)
        }
      })
  }

  return <form
    className="row d-flex justify-content-center"
    onSubmit={handleSubmit(onSubmit)}
  >

    <div className="col-8 mt-5" style={{ width: "20rem" }}>
      <div className="">
        <label htmlFor="clientName" className="form-label">
          Client Name:
        </label>

        <input
          type="text"
          className={`form-control ${errors.clientName ? "is-invalid" : ""}`}
          id="clientName"
          placeholder="Enter Client Name"
          defaultValue={GlobalData.Client.ClientName}
          {...register("clientName", { required: true })}
        />
        {errors.clientName && (
          <div className="invalid-feedback">Client Name is required.</div>
        )}
      </div>

      <div className="">
        <label htmlFor="password" className="form-label">
          Password:
        </label>
        <input
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          id="password"
          placeholder="Enter Password"
          defaultValue={GlobalData.Client.Password}
          {...register("password",
            {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              }
            }
          )}
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>

      <div className=" mt-5 d-flex justify-content-center">
        <button
          type="submit"
          className="btn btn-success mx-5 border border-primary"
          id="liveToastBtn"
        >
          Login
        </button>
      </div>
    </div>
  </form>
}
