import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import { SignUpStep1 } from "@/components/auth/SignUpSteps/SignUpStep1";
import { SignUpStep2 } from "@/components/auth/SignUpSteps/SignUpStep2";
import { SignUpStep3 } from "@/components/auth/SignUpSteps/SignUpStep3";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import animationData from "@/lotties/crm-animation-lotties.json";
import { sendEmail } from "@/services/emailService";
import { generateOTP } from "@/utils/generateOTP";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.config";

const SignUpPage = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "",
    company: "",
    gstNo: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    password: "",
    confirmPassword: "",
    acknowledged: false,
  });

  const [step, setStep] = useState(1);
  const [contactInfo, setContactInfo] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [isEmail, setIsEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otpForEmail, setOtpForEmail] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
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
    setError("");

    if (isEmail) {
      // Email OTP flow
      if (!contactInfo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError("Please enter a valid email address");
        return;
      }

      try {
        setLoading(true);
        // Generate 6-digit OTP
        const generatedOtp = generateOTP(6);
        setOtpForEmail(generatedOtp);

        // Send via email API
        const emailData = {
          toEmail: contactInfo,
          subject: "Your iStreams ERP Verification Code",
          body: `Your verification code is: ${generatedOtp}`,
          displayName: "iStreams ERP",
        };

        const response = await sendEmail(emailData);

        setOtpSent(true);
        setOtpTimer(120);
        setStep(2);
      } catch (err) {
        console.error("Email OTP error:", err);
        setError("Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // If user has retried, clear old captcha
      if (recaptchaRef.current) {
        recaptchaRef.current.clear(); // remove previous widget
        recaptchaRef.current = null;
      }

      const appVerifier = setupRecaptcha();
      try {
        const confirmation = await signInWithPhoneNumber(auth, contactInfo, appVerifier);
        setConfirmationResult(confirmation);

        setOtpSent(true);
        setOtpTimer(120);
        setStep(2);
        alert("✅ OTP sent!");
      } catch (err) {
        console.error("Error sending OTP:", err);
        if (err.code === "auth/too-many-requests") {
          setError("Too many SMS requests. Please wait a while before retrying.");
        } else {
          setError("Could not send OTP. Please try again.");
        }
      }
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setError("");

    if (isEmail) {
      // Email verification
      if (!otp) {
        setError("Please enter the OTP");
        return;
      }

      if (otp === otpForEmail) {
        setFormValues((prev) => ({
          ...prev,
          email: contactInfo,
        }));
        setEmailVerified(true);
        setStep(3);
      } else {
        setError("Invalid OTP. Please check and try again.");
      }
    } else {
      if (!confirmationResult) {
        setError("Please request an OTP first.");
        return;
      }
      if (otp.length === 0) {
        alert("Enter the OTP you received.");
        return;
      }

      try {
        const result = await confirmationResult.confirm(otp);
        setFormValues((prev) => ({
          ...prev,
          phone: contactInfo,
        }));
        setPhoneVerified(true);
        setStep(3);
        console.log("User signed in:", result.user);
      } catch (err) {
        console.error("Invalid OTP:", err);
        setError("Invalid OTP, please try again.");
      }
    }
  };

  // Reset OTP state when going back
  const handleBack = () => {
    setStep(step - 1);
    setError("");
    setOtp("");
    setOtpForEmail(""); // Reset email OTP
  };

  // Handle optional verification in step 3
  const handleOptionalVerify = (contact, isEmail) => {
    if (isEmail) {
      setEmailVerified(true);
      setFormValues((prev) => ({ ...prev, email: contact }));
    } else {
      setPhoneVerified(true);
      setFormValues((prev) => ({ ...prev, phone: contact }));
    }
  };

  // Handle signup submission
  const handleSignup = useCallback(
    async (e) => {
      // ... (your existing signup logic)
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
        <CardContent>
          {step === 1 && (
            <SignUpStep1
              isEmail={isEmail}
              setIsEmail={setIsEmail}
              contactInfo={contactInfo}
              setContactInfo={setContactInfo}
              loading={loading}
              error={error}
              setError={setError}
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
              handleBack={handleBack}
            />
          )}

          {step === 3 && (
            <SignUpStep3
              initialValues={formValues}
              setFormValues={setFormValues}
              handleSignup={handleSignup}
              loading={loading}
              isEmailPrimary={isEmail}
              emailVerified={emailVerified}
              phoneVerified={phoneVerified}
              onOptionalVerify={handleOptionalVerify}
            />
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default SignUpPage;
