import React, { useEffect, useState } from "react";
import "./fee.css";
import axios from "axios";
import {
  FaUserGraduate,
  FaIdBadge,
  FaMoneyBillWave,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import handlePayment from "./razorpay";
import { getCookie } from "./cookies.jsx";
import { toast } from "react-toastify"; // Import toast from React-Toastify
import {jwtDecode} from "jwt-decode"; // Corrected the import

function Fee() {
  const [feeDetails, setFeeDetails] = useState(null);
  const token = getCookie("accessToken"); // Retrieve JWT token from cookies

  // Function to decode JWT token and extract user ID
  const getUserIdFromToken = () => {
    try {
      if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken.ID;
      } else {
        toast.error("Token not found in cookies."); // Notify about missing token
        return null;
      }
    } catch (error) {
      toast.error("Error decoding token. Please log in again."); // Notify about decoding error
      return null;
    }
  };

  useEffect(() => {
    fetchFeeDetails(); // Fetch fee details when the component mounts or token changes
  }, [token]);

  const fetchFeeDetails = async () => {
    const userID = getUserIdFromToken(); // Get user ID from decoded token
    if (!userID) {
      toast.error("User ID not found in token."); // Notify about missing user ID
      return;
    }
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/fees/details/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      setFeeDetails(response.data);
    } catch (error) {
      toast.error("Error fetching fee details. Please try again."); // Notify about fetch error
    }
  };

  const formattedAmount = feeDetails?.amount?.toLocaleString() || "";

  const handlePayNow = () => {
    handlePayment(feeDetails.ID, (paymentSuccessful) => {
      if (paymentSuccessful) {
        toast.success("Payment successful!"); // Notify successful payment
        fetchFeeDetails(); // Fetch fee details again after successful payment
      } else {
        toast.error("Payment failed. Please try again."); // Notify about payment failure
      }
    });
  };

  if (!feeDetails) {
    return <div className="loading-div">Loading...</div>;
  }

  return (
    <div>
      <div id="fee-box">
        <div id="fee-heading">Fee Payment Details</div>
        <div id="fee-details">
          <p>
            <FaUserGraduate /> Name: <span>{feeDetails.name}</span>
          </p>
          <p>
            <FaIdBadge /> Student ID: <span>{feeDetails.ID}</span>
          </p>
          <p>
            <FaMoneyBillWave /> Amount Due: <span>Rs. {formattedAmount}</span>
          </p>
          <p id="fee-breakdown-p">
            <FaInfoCircle /> Fee Breakdown:{" "}
            <span id="fee-breakdown">{feeDetails.details}</span>
          </p>
          <p>
            <FaCheckCircle /> Payment Status: <span>{feeDetails.status}</span>
          </p>
        </div>
        <div id="payment-div">
          <p className="test-card-details">
            <a
              href="https://razorpay.com/docs/payments/payments/test-card-details/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Checkout Razorpay Test Card Details
            </a>
          </p>
          <button onClick={handlePayNow} className="payment-button">
            {feeDetails.status === "Paid" ? "Demo Pay" : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Fee;
