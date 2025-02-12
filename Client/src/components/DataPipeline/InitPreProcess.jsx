import React from "react";
import { useNavigate } from "react-router-dom";

const data_path = " fjnvefj";

function InitPreProcess() {
  const navigate = useNavigate();
  const gotoPreProcess = () => {
    navigate(`/PreProcess/${data_path}`);
  };

  return (
    <div>
      <select>
        <option value="1">data1</option>
        <option value="2">data2</option>
        <option value="3">data3</option>
      </select>
      <button onClick={gotoPreProcess}>Proceed</button>
    </div>
  );
}

export default InitPreProcess;
