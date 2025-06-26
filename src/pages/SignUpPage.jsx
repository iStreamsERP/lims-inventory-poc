import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import animationData from "@/lotties/crm-animation-lotties.json";
import { callSoapService } from "@/api/callSoapService";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useCallback, useState } from "react";
import Lottie from "react-lottie";
import { Link, useNavigate } from "react-router-dom";
import { getNameFromEmail } from "../utils/emailHelpers";

// Use the proxy path for the public service.
const PUBLIC_SERVICE_URL = import.meta.env.VITE_SOAP_ENDPOINT;
const DEFAULT_AVATAR_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBa24AAg4zVSuUsL4hJnMC9s3DguLgeQmZA&s";

const SignUpPage = () => {
  const [step, setStep] = useState(1); // 1: Contact info, 2: OTP verification, 3: Registration form
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
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login, setUserData } = useAuth();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSendOtp = async () => {
    if (!contactInfo) {
      setError("Email or phone number is required");
      return;
    }

    // Basic validation
    const isEmail = contactInfo.includes("@");
    const isPhone = /^\d{10}$/.test(contactInfo);
    
    if (!isEmail && !isPhone) {
      setError("Please enter a valid email or 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate OTP sending (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsOtpSent(true);
      setStep(2);
      setError("");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate OTP verification (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep(3);
      setError("");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Memoized login handler to prevent re-creation on each render.
  const handleSignup = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      if (!name) {
        setError("Name is required!");
        setLoading(false);
        return;
      } else if (!password) {
        setError("Password is required!");
        setLoading(false);
        return;
      }

      let userName = "";
      let clientURL = "";

      const doConnectionPayload = {
        LoginUserName: contactInfo,
      };

      localStorage.setItem(
        "doConnectionPayload",
        JSON.stringify(doConnectionPayload)
      );
      try {
        // Step 1: Connect to public service.
        const publicDoConnectionResponse = await callSoapService(
          PUBLIC_SERVICE_URL,
          "doConnection",
          doConnectionPayload
        );

        if (publicDoConnectionResponse === "SUCCESS") {
          // Step 2: Get client URL.
          clientURL = await callSoapService(
            PUBLIC_SERVICE_URL,
            "GetServiceURL",
            doConnectionPayload
          );

          const clientDoConnectionResponse = await callSoapService(
            clientURL,
            "doConnection",
            doConnectionPayload
          );

          if (clientDoConnectionResponse === "SUCCESS") {
            // Step 1.1: Verify authentication.
            userName = getNameFromEmail(contactInfo);

            const authenticationPayload = {
              username: userName,
              password: password,
            };

            const authenticationResponse = await callSoapService(
              clientURL,
              "verifyauthentication",
              authenticationPayload
            );

            if (authenticationResponse === "Authetication passed") {
              // Step 1.2: Authentication passed, proceed to get employee details.
              let employeeNo = "";
              let employeeImage = null;

              const clientEmpDetailsPayload = {
                userfirstname: userName,
              };

              const getClientEmpDetails = await callSoapService(
                clientURL,
                "getemployeename_and_id",
                clientEmpDetailsPayload
              );

              employeeNo = getClientEmpDetails[0]?.EMP_NO;

              if (employeeNo) {
                const getEmployeeImagePayload = {
                  EmpNo: employeeNo,
                };

                const employeeImageResponse = await callSoapService(
                  clientURL,
                  "getpic_bytearray",
                  getEmployeeImagePayload
                );

                employeeImage = employeeImageResponse
                  ? `data:image/jpeg;base64,${employeeImageResponse}`
                  : DEFAULT_AVATAR_URL;
              }

              const organizationPayload = {
                CompanyCode: 1,
                BranchCode: 1,
              };

              const getOrganization = await callSoapService(
                clientURL,
                "General_Get_DefaultCompanyName",
                organizationPayload
              );

              const isAdminPayload = {
                UserName: getClientEmpDetails[0]?.USER_NAME,
              };

              const isAdminResponse = await callSoapService(
                clientURL,
                "DMS_Is_Admin_User",
                isAdminPayload
              );

              let isAdmin = isAdminResponse === "Yes";

              const payload = {
                organizationName: getOrganization,
                userEmail: contactInfo,
                userName: getClientEmpDetails[0]?.USER_NAME,
                userEmployeeNo: getClientEmpDetails[0]?.EMP_NO,
                userAvatar: employeeImage,
                clientURL: clientURL,
                isAdmin,
              };

              login(payload, rememberMe);

              navigate("/");
            } else {
              setError(authenticationResponse);
            }
          } else {
            setError(clientDoConnectionResponse);
          }
        } else {
          setError(publicDoConnectionResponse);
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [contactInfo, password, login, setUserData, navigate]
  );
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="contact">
                Email or Phone Number
              </Label>
              <Input
                id="contact"
                placeholder="email@example.com or 9876543210"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                We'll send a verification code to this address
              </p>
            </div>

            {error && (
              <div className="rounded bg-red-500 p-2 text-white text-sm">
                {error}
              </div>
            )}

            <Button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-grow text-center">
                <h1 className="text-xl font-semibold">Verify OTP</h1>
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to
              </p>
              <p className="font-medium">{contactInfo}</p>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="rounded bg-red-500 p-2 text-white text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsOtpSent(false);
                  setStep(1);
                }}
              >
                Change Contact
              </Button>
              
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </div>

            <div className="text-center mt-4">
              <Button 
                variant="link" 
                className="text-blue-500 text-xs"
                onClick={() => console.log("Resend OTP")}
              >
                Didn't receive code? Resend
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="text-center mb-4">
              <h1 className="text-xl font-semibold">Complete Registration</h1>
              <p className="text-sm text-muted-foreground">
                Contact: {contactInfo}
              </p>
            </div>

            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <Select onValueChange={(value) => setUserType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="gstNo">GST NO (Optional)</Label>
                <Input
                  id="gstNo"
                  placeholder="Your GST Number"
                  value={gstNo}
                  onChange={(e) => setGstNo(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="*******"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(checked)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none"
              >
                I acknowledge and agree to collaborate in iStreams
              </label>
            </div>

            {error && (
              <div className="rounded bg-red-500 p-2 text-white">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link to="#" className="text-blue-500 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="#" className="text-blue-500 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>
        );
      
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Create an account";
      case 2:
        return "Verify OTP";
      case 3:
        return "Complete Registration";
      default:
        return "Create an account";
    }
  };

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-slate-200 p-10 dark:bg-slate-900 lg:flex">
        <div className="flex gap-x-3 h-20">
          <img
            src={logoLight}
            alt="iStreams ERP Solutions | CRM"
            className="dark:hidden object-fill"
          />
          <img
            src={logoDark}
            alt="iStreams ERP Solutions | CRM"
            className="hidden dark:block object-fill"
          />
        </div>

        <div>
          <Lottie options={defaultOptions} />
        </div>

        <div>
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Manage your customers efficiently and streamline your
              business operations with our powerful CRM system.&rdquo;
            </p>

            <footer className="text-sm text-gray-400">
              - iStreams ERP Solutions
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="flex flex-col justify-center overflow-y-auto bg-slate-100 px-6 dark:bg-slate-950 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center gap-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {getStepTitle()}
            </h1>
            {step === 1 && (
              <p className="text-sm text-muted-foreground">
                Enter your email or phone to get started
              </p>
            )}
            {step === 2 && (
              <p className="text-sm text-muted-foreground">
                Enter the verification code sent to your contact
              </p>
            )}
            {step === 3 && (
              <p className="text-sm text-muted-foreground">
                Complete your account details
              </p>
            )}
          </div>
          
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;