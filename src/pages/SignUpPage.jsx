import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import animationData from "@/lotties/crm-animation-lotties.json";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import { AuthLayout } from "@/layouts/AuthLayout";
import { SignUpStep1 } from "@/components/auth/SignUpSteps/SignUpStep1";
import { SignUpStep2 } from "@/components/auth/SignUpSteps/SignUpStep2";
import { SignUpStep3 } from "@/components/auth/SignUpSteps/SignUpStep3";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase.config";

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [contactInfo, setContactInfo] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
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

  // Start OTP timer
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  // Send OTP
  const handleSendOtp = async () => {
    if (!contactInfo.match(/^\+\d{10,15}$/)) {
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
      const confirmation = await signInWithPhoneNumber(auth, contactInfo, appVerifier);
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

  // Verify OTP
  const handleVerifyOtp = async () => {
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

  // Handle signup submission
  const handleSignup = useCallback(
    async (e) => {
      // ... (same logic as before)
    },
    [contactInfo, password, login, navigate],
  );

  // Step titles and subtitles
  const stepTitles = {
    1: "Create Your Account",
    2: "Verify Your Identity",
    3: "Complete Your Profile",
  };

  const stepSubtitles = {
    1: "Join our platform in just a few steps",
    2: "Enter the code we sent to your contact",
    3: "Finalize your account details",
  };

  return (
    <AuthLayout
      animationData={animationData}
      logoLight={logoLight}
      logoDark={logoDark}
      title={stepTitles[step]}
      subtitle={stepSubtitles[step]}
    >
      <Card className="border-0 shadow-none">
        {step !== 1 && (
          <CardHeader>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => {
                  setStep(step - 1);
                  setError("");
                  if (step === 2) setOtp("");
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl">{stepTitles[step]}</CardTitle>
            </div>
          </CardHeader>
        )}

        <CardContent>
          {step === 1 && (
            <SignUpStep1
              isEmail={isEmail}
              setIsEmail={setIsEmail}
              contactInfo={contactInfo}
              setContactInfo={setContactInfo}
              loading={loading}
              error={error}
              handleSendOtp={handleSendOtp}
            />
          )}

          {step === 2 && (
            <SignUpStep2
              contactInfo={contactInfo}
              otp={otp}
              setOtp={setOtp}
              otpTimer={otpTimer}
              otpSent={otpSent}
              loading={loading}
              error={error}
              handleVerifyOtp={handleVerifyOtp}
              handleSendOtp={handleSendOtp}
              goBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <SignUpStep3
              name={name}
              setName={setName}
              userType={userType}
              setUserType={setUserType}
              gstNo={gstNo}
              setGstNo={setGstNo}
              password={password}
              setPassword={setPassword}
              acknowledged={acknowledged}
              setAcknowledged={setAcknowledged}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
              error={error}
              handleSignup={handleSignup}
            />
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default SignUpPage;
