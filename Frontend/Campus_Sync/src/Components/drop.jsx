import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./drop.css";
import { getCookie } from "./cookies.jsx";

function Drop() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [username, setUsername] = useState("");
  const [topic, setTopic] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const token = getCookie("accessToken"); // Retrieve JWT token from cookies
  const usernameFromCookie = getCookie("username"); // Retrieve username from cookies

  useEffect(() => {
    if (usernameFromCookie) {
      setUsername(usernameFromCookie); // Set the username state with the username from cookies
    }

    fetchFiles(); // Fetch files when the component mounts or when the token changes
  }, [token]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/drops/files`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token in headers if needed
          },
        }
      );
      setFiles(Array.isArray(response.data) ? response.data.reverse() : []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !topic) {
      console.error("Please select a file and enter a topic.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("topic", topic);
    formData.append("uploadedBy", username);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/drops/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include JWT token in headers if needed
          },
        }
      );
      console.log("File Uploaded Successfully");
      setSelectedFile(null);
      setTopic("");
      fetchFiles();
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("File upload failed.", error);
    }
    setLoading(false);
  };

  const handleFileDelete = async (fileId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/drops/files/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token in headers if needed
          },
          data: { uploadedBy: username },
        }
      );
      if (response.status === 200) {
        fetchFiles();
      } else {
        console.error("Failed to delete the file.");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? files.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === files.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="drop-container">
      <div className="content-wrapper">
        <div className="upload-section-wrapper">
          <div className="upload-section">
            <h4>Drop a Notice</h4>
            <p className="warning">(Do not post any inappropriate content)</p>
            <form onSubmit={handleUpload} className="drop-form">
              <input
                type="text"
                placeholder="Topic"
                value={topic}
                onChange={handleTopicChange}
                className="drop-topic-input"
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="drop-file-input"
                ref={fileInputRef}
                accept=".pdf,.png,.jpeg,.jpg"
                placeholder="Upload PDF, PNG, JPEG, or JPG files"
              />
              <button type="submit" className="drop-submit-button">
                {loading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>

        <div className="carousel-section">
          <div className="carousel">
            {loading ? (
              <div className="drop-loading">Loading...</div>
            ) : files.length > 0 ? (
              <>
                <button
                  className="carousel-button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <span className="arrow">&#8249;</span>
                </button>
                <div className="carousel-content">
                  <div className="file-details">
                    <p id="file-topic">{files[currentIndex].topic}</p>
                    <p className="file-date">
                      {new Date(
                        files[currentIndex].uploadedAt
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(
                        files[currentIndex].uploadedAt
                      ).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="file-container">
                    {files[currentIndex].contentType === "application/pdf" ? (
                      <embed
                        src={files[currentIndex].content}
                        className="drop-file-pdf"
                        type="application/pdf"
                        width="100%"
                        height="400px"
                      />
                    ) : (
                      <img
                        src={files[currentIndex].content}
                        alt={files[currentIndex].topic}
                        className="drop-file-image"
                      />
                    )}
                  </div>

                  {files[currentIndex].uploadedBy === username && (
                    <button
                      className="drop-delete-button"
                      onClick={() => handleFileDelete(files[currentIndex]._id)}
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
                <button
                  className="carousel-button"
                  onClick={handleNext}
                  disabled={currentIndex === files.length - 1}
                >
                  <span className="arrow">&#8250;</span>
                </button>
              </>
            ) : (
              <div className="drop-no-files">No files found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Drop;
