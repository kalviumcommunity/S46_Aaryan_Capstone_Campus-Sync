import React, { useEffect, useState } from "react";
import axios from "axios";
import "./result.css";
import { getCookie } from './cookies'; 
import { jwtDecode } from "jwt-decode";

function Result() {
  const [score, setScore] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Retrieve the JWT token from cookies or local storage
  const token = getCookie("token"); 
  let userID = null;

  if (token) {
    try {
      // Decode the token to get the user ID
      const decodedToken = jwtDecode(token); 
      userID = decodedToken.ID;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  useEffect(() => {
    fetchScoreDetails();
  }, [token]);  // Fetch rewsult details whenever token changes

  const fetchScoreDetails = () => {
    if (!userID) {
      console.error("User ID is not available in the token");
      return;
    }

    axios
      .get(import.meta.env.VITE_SERVER_URL + `/scores/details/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      .then((response) => {
        // Reverse the details array before setting it in the state
        const reversedScore = {
          ...response.data,
          details: response.data.details.reverse(),
        };
        setScore(reversedScore);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, score.details.length - 1)
    );
  };

  if (!score) {
    return (
      <div className="loading-div">
        Loading...
      </div>
    );
  }

  const detail = score.details[currentIndex];

  return (
    <div>
      <div id="result-container-blue">
        <div className="navigation-buttons">
          <button onClick={handlePrevClick} disabled={currentIndex === 0}>
            {"<"}
          </button>
        </div>
        <div id="result-container-white">
          <div id="exam-name">{detail.exam}</div>
          <div id="exam-details">
            <div>
              <p>
                Name: <strong>{score.name}</strong>
              </p>
              <p>
                Student ID: <strong>{score.ID}</strong>
              </p>
            </div>
            <div>
              <p>
                Exam Date: <strong>{detail.date}</strong>
              </p>
              <p>
                Aggregate Score: <strong>{detail.aggregateScore}</strong>
              </p>
            </div>
          </div>
          <div id="subject-scores">
            <table className="results-table">
              <thead>
                <tr>
                  <th className="sub-heading">Subject</th>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <th key={index}>{detail.subjects[index] || "NA"}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="sub-heading">Score</td>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <td key={index}>
                      {detail.scores[index] !== undefined
                        ? detail.scores[index]
                        : "NA"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="navigation-buttons">
          <button
            onClick={handleNextClick}
            disabled={currentIndex === score.details.length - 1}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
