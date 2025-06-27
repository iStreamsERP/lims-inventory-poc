// src/PhoneAuth.jsx
import React, { useState, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase.config";

const PhoneAuth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaRef = useRef(null);

  const setupRecaptcha = () => {
    if (!auth) throw new Error("🔥 auth is undefined!");

    // Only create one verifier
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        siteKey: "6LcUGW4rAAAAAB35Or18Oizvq3zL48MrZtoUgtpE",
        callback: () => {
          console.log("✅ Captcha solved!");
        },
      });
      // render the widget (required)
      recaptchaRef.current.render().catch(console.error);
    }
    return recaptchaRef.current;
  };

  const sendOTP = async () => {
    if (!phone.match(/^\+\d{10,15}$/)) {
      alert("Please enter a valid phone number with country code, e.g. +911234567890");
      return;
    }

    // If user has retried, clear old captcha
    if (recaptchaRef.current) {
      recaptchaRef.current.clear(); // remove previous widget
      recaptchaRef.current = null;
    }

    const appVerifier = setupRecaptcha();
    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      alert("✅ OTP sent!");
    } catch (err) {
      console.error("Error sending OTP:", err);
      if (err.code === "auth/too-many-requests") {
        alert("⚠️ Too many SMS requests. Please wait a while before retrying.");
      } else {
        alert("Could not send OTP—check console.");
      }
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) {
      alert("Please request an OTP first.");
      return;
    }
    if (otp.length === 0) {
      alert("Enter the OTP you received.");
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      console.log("User signed in:", result.user);
      alert("🎉 Phone number verified!");
    } catch (err) {
      console.error("Invalid OTP:", err);
      alert("❌ Invalid OTP, please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "auto", textAlign: "center" }}>
      <h2>Phone Authentication</h2>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91XXXXXXXXXX"
        style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
      />
      <button
        onClick={sendOTP}
        style={{ width: "100%", padding: "8px" }}
      >
        Send OTP
      </button>

      {confirmationResult && (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={{ width: "100%", padding: "8px", margin: "16px 0 8px" }}
          />
          <button
            onClick={verifyOTP}
            style={{ width: "100%", padding: "8px" }}
          >
            Verify OTP
          </button>
        </>
      )}

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
