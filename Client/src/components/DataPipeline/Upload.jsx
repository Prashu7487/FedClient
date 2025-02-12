import axios from "axios";
import React from "react";
import { useState } from "react";

const data_upload_url = process.env.REACT_APP_DATA_UPLOAD_URL;

function Upload() {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(data_upload_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        console.log("response is:", response.data.message);
        alert("File uploaded successfully");
      } else {
        console.log("Error uploading file:", response);
        alert("Error uploading file");
      }
    } catch (err) {
      console.log("Upload failed: ", err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      {file && <p>Selected file: {file.name}</p>}
    </div>
  );
}

export default Upload;
