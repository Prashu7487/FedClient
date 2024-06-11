import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Request from "./Pages/Request";
import Register from "./Pages/Register";
import TrainingStatus from "./Pages/TrainingStatus";
import Error from "./Pages/Error";
import NavBar from "./components/OnWholeApp/NavBar";
import MyDataProvider from "./GlobalContext";
import EventsAction from "./EventsActions";

/*
      A global file namely GlobalContext.jsx is defined to maintain the global Data Provider,
      the same file contains custom implementation of DataProvider and useContext function...
      Just make sure to import the function from GlobalContext.jsx before using them.
*/

export default function App() {
  return (
    <>
      <MyDataProvider>
        <EventsAction />
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
            <Route path="/" element={<Home />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Request" element={<Request />} />
            <Route path="/TrainingStatus" element={<TrainingStatus />} />
            <Route path="/*" element={<Error />} />
          </Routes>
        </div>
      </MyDataProvider>
    </>
  );
}
