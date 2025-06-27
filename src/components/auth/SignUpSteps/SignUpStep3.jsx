import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export const SignUpStep3 = ({ 
  name,
  setName,
  userType,
  setUserType,
  gstNo,
  setGstNo,
  password,
  setPassword,
  acknowledged,
  setAcknowledged,
  showPassword,
  setShowPassword,
  loading,
  error,
  handleSignup
}) => (
  <form onSubmit={handleSignup} className="space-y-4">
    <div className="grid gap-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="type">Account Type</Label>
        <Select value={userType} onValueChange={setUserType}>
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
      </div>

      {userType === "business" && (
        <div>
          <Label htmlFor="gstNo">GST Number</Label>
          <Input
            id="gstNo"
            placeholder="GSTIN-XXXXXXXXXXXXX"
            value={gstNo}
            onChange={(e) => setGstNo(e.target.value)}
            className="mt-1"
          />
        </div>
      )}

      <div>
        <Label htmlFor="password">Create Password</Label>
        <div className="relative mt-1">
          <Input
            id="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">At least 8 characters with a number and symbol</p>
      </div>
    </div>

    <div className="flex items-start space-x-2 pt-2">
      <input
        type="checkbox"
        id="terms"
        checked={acknowledged}
        onChange={(e) => setAcknowledged(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label
        htmlFor="terms"
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

    {error && <div className="rounded bg-red-100 p-2 text-red-700">{error}</div>}

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
  </form>
);