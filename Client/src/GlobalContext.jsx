import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const useGlobalData = () => useContext(GlobalContext);

export default function MyDataProvider({ children }) {
  const Global_data = {
    Client: { ClientID: "", DataPath: "", Email: "" },
    ConnectionObject: null,
    CurrentModels: [
      {
        RequestId: "11:50",
        OrgName: "Sample",
        Status: "Unknown",
        Model: {
          "Linear Regression": {
            name: "learningRate",
            label: "Learning Rate",
            type: "number",
            name2: "numIterations",
            label2: "Number of Iterations",
            type2: "number",
          },
        },
        Data: { feature1: "details", feature2: "details" },
      },
    ],
  };

  const [GlobalData, setGlobalData] = useState(Global_data);

  return (
    <GlobalContext.Provider value={{ GlobalData, setGlobalData }}>
      {children}
    </GlobalContext.Provider>
  );
}
