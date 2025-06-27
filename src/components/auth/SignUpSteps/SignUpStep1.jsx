import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

export const SignUpStep1 = ({ isEmail, setIsEmail, contactInfo, setContactInfo, loading, error, handleSendOtp }) => (
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
          }}
        >
          <Smartphone size={16} /> Phone
        </Button>
      </div>

      <Label htmlFor="contact">{isEmail ? "Email Address" : "Phone Number"}</Label>
      <Input
        id="contact"
        placeholder={isEmail ? "name@example.com" : "9876543210"}
        value={contactInfo}
        onChange={(e) => setContactInfo(e.target.value)}
        type={isEmail ? "email" : "tel"}
        required
        className="mt-1"
      />
    </div>

    {error && <div className="rounded bg-red-100 p-2 text-sm text-red-700">{error}</div>}

    <Button
      type="button"
      onClick={handleSendOtp}
      disabled={loading}
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
