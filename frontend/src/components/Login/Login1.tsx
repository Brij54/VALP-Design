import "../../App.css";
import React from "react";

export default function Login1(props: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    props.setFormData({
      ...props.formData,
      [name]: value,
    });
  };

  return (
    <div className="d-flex flex-column" style={{ height: 800 }}>
      <form
        className="border w-15 d-flex flex-column m-auto shadow-sm"
        style={{ borderRadius: "10px" }}
        onSubmit={props.handleSubmit}
      >
        <div
          className="d-flex justify-content-center"
          style={{
            background: "#DCDCDC",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <h3 className="fs-5 fw-light p-2">Sign in</h3>
        </div>

        <div className="d-flex flex-column gap-4 p-4 align-items-center">
          <input
            type="text"
            className="form-control bg-light border-1"
            name="username"
            placeholder="Enter Username or Email"
            value={props.formData.username}
            onChange={handleChange}
          />

          <input
            type="password"
            className="form-control bg-light border-1"
            name="password"
            placeholder="Enter Password"
            value={props.formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn text-white w-100"
            style={{
              background: "#2D88D4",
              fontSize: "18px",
              borderRadius: "10px",
            }}
          >
            Login
          </button>

          {props.error && (
            <div className="fs-6 text-danger">{props.error}</div>
          )}
        </div>
      </form>
    </div>
  );
}
