import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Request from "./Pages/Request";
import Register from "./Pages/Register";
import TrainingStatus from "./Pages/TrainingStatus";
import TrainingDetails from "./Pages/TrainingDetails";
import TrainingResults from "./Pages/Results";
import ResultDetails from "./Pages/ResultDetails";
import About from "./Pages/About";
import Error from "./Pages/Error";
import NavBar from "./components/OnWholeApp/NavBar";
import MyDataProvider from "./GlobalContext";
import EventsAction from "./EventsActions";
import { useState } from "react";

/*
The App component is the main component of the application. It is the parent component of all the other components.
It contains the NavBar component, which is a navigation bar that allows the user to navigate between different 
pages of the application. The App component also contains the Routes component, which is used to define the
routes of the application. Each route is associated with a specific page component, which is rendered when
the user navigates to that route.
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

            <Route path="/About" element={<About />} />

            <Route path="/*" element={<Error />} />
          </Routes>
        </div>
      </MyDataProvider>
    </>
  );
}
