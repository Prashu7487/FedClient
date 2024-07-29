import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Request from "./Pages/Request";
import Register from "./Pages/Register";
import TrainingStatus from "./Pages/TrainingStatus";
import TrainingDetails from "./Pages/TrainingDetails";
import TrainingResults from "./Pages/Results";
import ResultDetails from "./Pages/ResultDetails";
import Error from "./Pages/Error";
import NavBar from "./components/OnWholeApp/NavBar";
import MyDataProvider from "./GlobalContext";
import EventsAction from "./EventsActions";
import { useState } from "react";

/*
      A global file namely GlobalContext.jsx is defined to maintain the global Data Provider,
      the same file contains custom implementation of DataProvider and useContext function...
      ,make sure to import the function from GlobalContext.jsx before using them.
*/

export default function App() {
  const [clientToken, setClientToken] = useState("");
  const [sessions, setSessions] = useState([]);
  const [socket, setSocket] = useState(null);
  return (
    <>
      <MyDataProvider>
        <EventsAction socket={socket} clientToken={clientToken} />
        <NavBar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "100px",
          }}
        >
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route
              path="/Register"
              element={
                <Register
                  clientToken={clientToken}
                  setClientToken={setClientToken}
                  setSocket={setSocket}
                />
              }
            />
            <Route
              path="/Request"
              element={
                <Request clientToken={clientToken} setSessions={setSessions} />
              }
            />
            <Route
              path="/TrainingStatus"
              element={<TrainingStatus sessions={sessions} />}
            />
            <Route
              path="/TrainingStatus/details/:sessionId"
              element={
                <TrainingDetails clientToken={clientToken} socket={socket} />
              }
            />

            <Route path="/Results" element={<TrainingResults />} />

            <Route
              path="/TrainingResults/details/:sessionId"
              element={<ResultDetails />}
            />

            <Route path="/*" element={<Error />} />
          </Routes>
        </div>
      </MyDataProvider>
    </>
  );
}
