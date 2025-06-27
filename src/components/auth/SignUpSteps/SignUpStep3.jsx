import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const SignUpStep3 = ({ initialValues, setFormValues, handleSignup, loading }) => {
  const [showPassword, setShowPassword] = useState(false);

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required("Full Name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { id: "name", label: "Full Name" },
              { id: "username", label: "Username" },
              { id: "email", label: "Email" },
              { id: "phone", label: "Phone" },
            ].map(({ id, label }) => (
              <div
                key={id}
                className="flex flex-col"
              >
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  name={id}
                  value={values[id]}
                  onChange={handleChange}
                  className="mt-1"
                />
                <ErrorMessage
                  name={id}
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            ))}

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
            <div className="col-span-1 flex flex-col md:col-span-2">
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
            <div className="col-span-1 flex flex-col md:col-span-2">
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
        </Form>
      )}
    </Formik>
  );
};
