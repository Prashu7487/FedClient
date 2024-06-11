import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const gotoHome = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h4>Error 404...</h4>
      <div style={{ height: "1rem" }}></div> {/* Blank line for spacing */}
      <p>No such Page Available</p>
      <button onClick={gotoHome}>Home</button>
    </div>
  );
}

/*comments to see at last
uninstall react-hook-form package

// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.js";
// import "bootstrap/dist/js/bootstrap.bundle.js";

requesting client should also HIT accept API

always have a key fetaure when you're rendering componenets by mapping, filtering


    // <div className="position-fixed bottom-0 end-0 p-3">
    //   <div
    //     id="liveToast"
    //     className="toast hide"
    //     role="alert"
    //     aria-live="assertive"
    //     aria-atomic="true"
    //   >
    //     <div className="toast-header">
    //       <img src="..." className="rounded me-2" alt="..." />
    //       <strong className="me-auto">Bootstrap</strong>
    //       <small>11 mins ago</small>
    //       <button
    //         type="button"
    //         className="btn-close"
    //         data-bs-dismiss="toast"
    //         aria-label="Close"
    //       ></button>
    //     </div>
    //     <div className="toast-body">Hello, world! This is a toast message.</div>
    //   </div>
    // </div>;

*/
