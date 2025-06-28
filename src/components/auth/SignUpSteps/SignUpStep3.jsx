import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { generateOTP } from "@/utils/generateOTP";
import { sendEmail } from "@/services/emailService";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../../firebase.config";
import { OptionalVerificationModal } from "./OptionalVerificationModal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export const SignUpStep3 = ({
  initialValues,
  setFormValues,
  handleSignup,
  loading,
  isEmailPrimary,
  emailVerified,
  phoneVerified,
  onOptionalVerify,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [optionalVerification, setOptionalVerification] = useState({
    open: false,
    contact: "",
    isEmail: !isEmailPrimary,
    otp: "",
    otpSent: false,
    otpTimer: 0,
    loading: false,
    error: "",
    confirmationResult: null,
    storedOtp: "",
  });
  const recaptchaRef = useRef(null);

  // Setup recaptcha for optional phone verification
  const setupRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container-optional", {
        size: "invisible",
        callback: () => console.log("Optional Recaptcha solved"),
      });
      recaptchaRef.current.render().catch(console.error);
    }
    return recaptchaRef.current;
  };

  // Handle OTP timer
  useEffect(() => {
    let timer;
    if (optionalVerification.otpTimer > 0) {
      timer = setTimeout(() => setOptionalVerification((prev) => ({ ...prev, otpTimer: prev.otpTimer - 1 })), 1000);
    }
    return () => clearTimeout(timer);
  }, [optionalVerification.otpTimer]);

  // Initiate optional verification
  const handleOptionalVerification = async (contact) => {
    setOptionalVerification((prev) => ({
      ...prev,
      contact,
      loading: true,
      error: "",
    }));

    const isEmail = optionalVerification.isEmail;

    try {
      if (isEmail) {
        // Email verification
        const otp = generateOTP(6);
        await sendEmail({
          toEmail: contact,
          subject: "Your Verification Code",
          body: `Your OTP is: ${otp}`,
        });

        setOptionalVerification((prev) => ({
          ...prev,
          storedOtp: otp,
          otpSent: true,
          otpTimer: 120,
        }));
      } else {
        // Phone verification
        const appVerifier = setupRecaptcha();
        const confirmation = await signInWithPhoneNumber(auth, contact, appVerifier);

        setOptionalVerification((prev) => ({
          ...prev,
          confirmationResult: confirmation,
          otpSent: true,
          otpTimer: 120,
        }));
      }
    } catch (error) {
      console.error("Verification error:", error);
      setOptionalVerification((prev) => ({
        ...prev,
        error: "Failed to send verification. Please try again.",
      }));
    } finally {
      setOptionalVerification((prev) => ({ ...prev, loading: false }));
    }
  };

  // Verify OTP for optional field
  const verifyOptionalOtp = async () => {
    setOptionalVerification((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const { isEmail, otp, storedOtp, confirmationResult } = optionalVerification;

      if (isEmail) {
        // Email verification
        if (otp === storedOtp) {
          onOptionalVerify(optionalVerification.contact, isEmail);
          closeModal();
        } else {
          throw new Error("Invalid OTP");
        }
      } else {
        // Phone verification
        await confirmationResult.confirm(otp);
        onOptionalVerify(optionalVerification.contact, isEmail);
        closeModal();
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setOptionalVerification((prev) => ({
        ...prev,
        error: "Invalid verification code. Please try again.",
      }));
    } finally {
      setOptionalVerification((prev) => ({ ...prev, loading: false }));
    }
  };

  const closeModal = () => {
    setOptionalVerification((prev) => ({
      ...prev,
      open: false,
      otp: "",
      error: "",
    }));
  };

  // Adjust validation schema
  const SignupSchema = Yup.object().shape({
    name: Yup.string().required("Full Name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email")
      .test("verified-email", "Email must be verified", function (value) {
        if (!value) return true; // Not required
        if (isEmailPrimary) return emailVerified; // Primary already verified
        return optionalVerification.verifiedEmail === value;
      }),
    phone: Yup.string().test("verified-phone", "Phone must be verified", function (value) {
      if (!value) return true; // Not required
      if (!isEmailPrimary) return phoneVerified; // Primary already verified
      return optionalVerification.verifiedPhone === value;
    }),
    userType: Yup.string().required("Account type is required"),
    company: Yup.string().when("userType", {
      is: "business",
      then: (schema) => schema.required("Company name is required"),
    }),
    gstNo: Yup.string().when("userType", {
      is: "business",
      then: (schema) => schema.required("GST number is required"),
    }),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    password: Yup.string().min(8, "Minimum 8 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
    acknowledged: Yup.boolean().oneOf([true], "You must agree to terms"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      enableReinitialize
      onSubmit={(values) => {
        setFormValues(values);
        handleSignup(values);
      }}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form className="space-y-6 overflow-y-auto p-1">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                className="mt-1"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={values.username}
                onChange={handleChange}
                className="mt-1"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* Primary Contact */}
            <div className="flex flex-col">
              <Label>{isEmailPrimary ? "Email" : "Phone"}</Label>
              {isEmailPrimary ? (
                <Input
                  value={values.email}
                  disabled
                  className="mt-1 bg-gray-100"
                />
              ) : (
                <PhoneInput
                  country="in"
                  value={values.phone.replace(/^\+/, "")}
                  disabled
                  inputStyle={{ width: "100%", backgroundColor: "#f3f4f6" }}
                  containerStyle={{ marginTop: "0.25rem" }}
                />
              )}
              <div className="mt-1 text-sm text-green-600">✓ Verified</div>
            </div>

            {/* Optional Contact */}
            <div className="flex flex-col">
              <Label>{optionalVerification.isEmail ? "Email (optional)" : "Phone (optional)"}</Label>
              <div className="flex gap-2">
                {optionalVerification.isEmail ? (
                  <Input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className="flex-1"
                  />
                ) : (
                  <PhoneInput
                    country="in"
                    value={values.phone.replace(/^\+/, "")}
                    onChange={(phone) => setFieldValue("phone", `+${phone}`)}
                    inputProps={{ name: "phone", id: "phone" }}
                    inputStyle={{ width: "100%" }}
                    containerStyle={{ width: "100%" }}
                  />
                )}
                {values[optionalVerification.isEmail ? "email" : "phone"] && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      const contact = values[optionalVerification.isEmail ? "email" : "phone"];
                      setOptionalVerification((prev) => ({ ...prev, open: true, contact }));
                      handleOptionalVerification(contact);
                    }}
                    disabled={optionalVerification.loading}
                  >
                    Verify
                  </Button>
                )}
              </div>
              <ErrorMessage
                name={optionalVerification.isEmail ? "email" : "phone"}
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="userType">Account Type</Label>
              <Select
                value={values.userType}
                onValueChange={(val) => setFieldValue("userType", val)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ErrorMessage
                name="userType"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {values.userType === "business" && (
              <>
                <div className="flex flex-col">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    name="company"
                    value={values.company}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="company"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="gstNo">GST / VAT Number</Label>
                  <Input
                    id="gstNo"
                    name="gstNo"
                    value={values.gstNo}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="gstNo"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
              </>
            )}

            {["address", "city", "state", "country", "pinCode"].map((field) => (
              <div
                key={field}
                className="flex flex-col"
              >
                <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                <Input
                  id={field}
                  name={field}
                  value={values[field]}
                  onChange={handleChange}
                  className="mt-1"
                />
                <ErrorMessage
                  name={field}
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            ))}

            {/* Password */}
            <div className="flex flex-col">
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={values.confirmPassword}
                onChange={handleChange}
                className="mt-1"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-4">
              <Field
                type="checkbox"
                id="acknowledged"
                name="acknowledged"
                className="mt-1 h-4 w-4"
              />
              <label
                htmlFor="acknowledged"
                className="text-sm text-muted-foreground"
              >
                I agree to the{" "}
                <Link
                  to="#"
                  className="text-blue-600 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="#"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            <ErrorMessage
              name="acknowledged"
              component="div"
              className="text-sm text-red-500"
            />

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <OptionalVerificationModal
              contactInfo={optionalVerification.contact}
              isEmail={optionalVerification.isEmail}
              open={optionalVerification.open}
              onOpenChange={(open) => setOptionalVerification((prev) => ({ ...prev, open }))}
              otp={optionalVerification.otp}
              setOtp={(otp) => setOptionalVerification((prev) => ({ ...prev, otp }))}
              otpTimer={optionalVerification.otpTimer}
              onResend={() => handleOptionalVerification(optionalVerification.contact)}
              onVerify={verifyOptionalOtp}
              loading={optionalVerification.loading}
              error={optionalVerification.error}
            />

            {/* Hidden recaptcha container for optional phone verification */}
            <div id="recaptcha-container-optional" />
          </div>
        </Form>
      )}
    </Formik>
  );
};
