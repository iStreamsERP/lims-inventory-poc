import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export const SignUpStep1 = ({ isEmail, setIsEmail, contactInfo, setContactInfo, loading, error, setError, handleSendOtp }) => (
  <div className="space-y-2">
    <div>
      <Label className="mb-2 block">How would you like to sign up?</Label>
      <div className="mb-4 flex gap-2">
        <Button
          variant={isEmail ? "default" : "outline"}
          className="flex-1 gap-2"
          onClick={() => {
            setIsEmail(true);
            setContactInfo("");
            setError("");
          }}
        >
          <Mail size={16} /> Email
        </Button>
        <Button
          variant={!isEmail ? "default" : "outline"}
          className="flex-1 gap-2"
          onClick={() => {
            setIsEmail(false);
            setContactInfo("");
            setError("");
          }}
        >
          <Smartphone size={16} /> Phone
        </Button>
      </div>
      {isEmail ? (
        <>
          <Label htmlFor="contact">Email Address</Label>
          <Input
            id="contact"
            placeholder="name@example.com"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value.trim())}
            type="email"
            required
            className="mt-1"
          />
        </>
      ) : (
        <>
          <Label htmlFor="phone">Phone Number</Label>
          <PhoneInput
            country={"in"}
            value={contactInfo.startsWith("+") ? contactInfo.slice(1) : contactInfo}
            onChange={(phone) => setContactInfo(`+${phone}`)}
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: true,
              id: "phone",
            }}
            inputStyle={{ width: "100%" }}
          />
        </>
      )}
    </div>

    {error && <div className="rounded bg-red-100 p-2 text-sm text-red-700">{error}</div>}

    <Button
      type="button"
      onClick={handleSendOtp}
      disabled={contactInfo.trim() === "" || loading}
      className="mt-2 w-full"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending OTP...
        </>
      ) : (
        "Send Verification Code"
      )}
    </Button>

    <p className="mt-4 text-center text-xs text-muted-foreground">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-blue-600 hover:underline"
      >
        Log in
      </Link>
    </p>

    {/* Invisible reCAPTCHA container */}
    <div id="recaptcha-container"></div>
  </div>
);
