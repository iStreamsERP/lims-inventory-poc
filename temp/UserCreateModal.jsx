import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/services/callSoapService";
import { getDomainFromEmail } from "@/utils/emailHelpers";
import axios from "axios";
import { Check, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

// Validate the entire form on submission.
const validateForm = (data) => {
  const errors = {};

  if (!data.NEW_USER_NAME || data.NEW_USER_NAME.trim().length < 2) {
    errors.NEW_USER_NAME = "Username must be at least 2 characters.";
  }
  if (!data.PASSWORD || data.PASSWORD.trim().length < 6) {
    errors.PASSWORD = "Password must be at least 6 characters.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.EMAIL_ADDRESS || !emailRegex.test(data.EMAIL_ADDRESS)) {
    errors.EMAIL_ADDRESS = "Please enter a valid email address.";
  }
  if (!data.MOBILE_NUMBER || data.MOBILE_NUMBER.trim().length < 10) {
    errors.MOBILE_NUMBER = "Mobile number must be at least 10 digits.";
  }
  if (!data.FULL_NAME || data.FULL_NAME.trim().length < 2) {
    errors.FULL_NAME = "Full name is required.";
  }
  if (!data.EMP_NO || data.EMP_NO.trim().length < 2) {
    errors.EMP_NO = "Employee number is required.";
  }

  return errors;
};

// Validate a single field on blur.
const validateInput = (name, value) => {
  switch (name) {
    case "NEW_USER_NAME":
      if (!value || value.trim().length < 2) {
        return "Username must be at least 2 characters.";
      }
      break;
    case "PASSWORD":
      if (!value || value.trim().length < 6) {
        return "Password must be at least 6 characters.";
      }
      break;
    case "EMAIL_ADDRESS":
      {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          return "Please enter a valid email address.";
        }
      }
      break;
    case "MOBILE_NUMBER":
      if (!value || !/^\d{10}$/.test(value)) {
        return "Mobile number must be exactly 10 digits.";
      }
      break;
    case "FULL_NAME":
      if (!value || value.trim().length < 2) {
        return "Full name must be at least 2 characters.";
      }
      break;
    case "EMP_NO":
      if (!value || value.trim().length < 2) {
        return "Employee number must be at least 2 characters.";
      }
      break;
    default:
      return "";
  }
  return "";
};

const UserCreateModal = ({ user, open, onClose }) => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const DOMAIN_NAME = getDomainFromEmail(userData.currentUserLogin);
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  const initialFormData = {
    LOGIN_USER_NAME: userData.currentUserName,
    NEW_USER_NAME: "",
    PASSWORD: "",
    isAdminUser: false,
    EMAIL_ADDRESS: "",
    MOBILE_NUMBER: "",
    FULL_NAME: "",
    EMP_NO: "",
    DOMAIN_NAME: DOMAIN_NAME,
    employeeImage: "",
    accountExpired: false,
    accountLocked: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [isFocused, setIsFocused] = useState({
    NEW_USER_NAME: false,
    PASSWORD: false,
    isAdminUser: false,
    EMAIL_ADDRESS: false,
    MOBILE_NUMBER: false,
    FULL_NAME: false,
    EMP_NO: false,
    employeeImage: false,
    accountExpired: false,
    accountLocked: false,
  });

  useEffect(() => {
    if (user) {
      const DOMAIN_NAME = getDomainFromEmail(user?.EMAIL_ADDRESS);
      setFormData({
        LOGIN_USER_NAME: userData.currentUserName,
        NEW_USER_NAME: user?.USER_NAME || "",
        PASSWORD: "",
        isAdminUser: user?.USER_TYPE || false,
        DOMAIN_NAME: DOMAIN_NAME,
        EMAIL_ADDRESS: user?.EMAIL_ADDRESS || "",
        MOBILE_NUMBER: user?.MOBILE_NO || "",
        FULL_NAME: user?.FULL_NAME || "",
        EMP_NO: user?.EMP_NO || "",
        employeeImage: user?.employeeImage || "",
        accountExpired: user?.ACCOUNT_EXPIRED || false,
        accountLocked: user?.ACCOUNT_LOCKED || false,
      });
      fetchUserImage();
    } else {
      setFormData(initialFormData);
    }
  }, [user, open]);

  const fetchUserImage = async () => {
    try {
      const response = await axios.get(
        `https://cloud.istreams-erp.com:4498/api/empImage/view?email=${encodeURIComponent(
          userData.currentUserLogin
        )}&fileName=EMPLOYEE_IMAGE_${user.EMP_NO}`,
        {
          responseType: "blob",
        }
      );

      const blob = response.data;

      const mimeType = blob.type;
      const extension = mimeType.split("/")[1] || "png";
      const filename = `EMPLOYEE_IMAGE_${user.EMP_NO}.${extension}`;

      const file = new File([blob], filename, { type: mimeType });

      setFormData((prev) => ({
        ...prev,
        employeeImage: file,
      }));

      // Optional: Preview the image
      const imagePreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(imagePreviewUrl);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching user image: ${error.message}`,
      });
    }
  };

  const handleChange = async (eventOrValue, fieldName) => {
    if (eventOrValue && eventOrValue.target) {
      const { name, value, type, checked, files } = eventOrValue.target;

      if (type === "file") {
        const file = files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);

          setFormData((prevData) => ({
            ...prevData,
            [name]: file,
          }));

          if (user) {
            await handleUpdatedImage(formData.EMP_NO);
          }
        } else {
          setPreviewUrl(null);
        }
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]:
            name === "NEW_USER_NAME"
              ? value.toUpperCase()
              : type === "checkbox"
              ? checked
              : value,
        }));
      }

      if (user) {
        setIsFocused((prev) => ({ ...prev, [name]: true }));
      }
    } else {
      // For custom components (like Select or toggle switch)
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: eventOrValue,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateInput(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
    setIsFocused((prev) => ({ ...prev, [name]: false }));
  };

  const handleUpdate = async (key, value) => {
    try {
      setLoading((prev) => ({ ...prev, [key]: true }));
      const payload = {
        FQ_USER_NAME: user.EMAIL_ADDRESS,
        USER_NAME_ONLY: user.USER_NAME,
        COLUMN_NAME: key,
        VALUE: value,
      };

      const response = await callSoapService(
        userData.clientURL,
        "UM_Update_User",
        payload
      );

      console.log(response);

      toast({
        title: response,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating user:",
        error,
      });
    } finally {
      setIsFocused((prev) => ({ ...prev, [key]: false }));
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleUploadImage = async (EMP_NO) => {
    setLoading(true);

    const file = formData.employeeImage;
    const form = new FormData();
    form.append("file", file);
    form.append("email", userData.currentUserLogin);
    form.append("fileName", `EMPLOYEE_IMAGE_${EMP_NO}`);

    try {
      const uploadUrl =
        "https://cloud.istreams-erp.com:4498/api/empImage/upload";
      const response = await axios.post(uploadUrl, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast({ title: "Employee saved and image uploaded!" });
      } else {
        toast({
          variant: "destructive",
          title: `Upload failed (status ${response.status})`,
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);

      toast({
        variant: "destructive",
        title: "Error saving image.",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Unknown error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatedImage = async (EMP_NO) => {
    setLoading(true);

    const file = formData.employeeImage;

    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("email", userData.currentUserLogin);
      payload.append("fileName", `EMPLOYEE_IMAGE_${EMP_NO}`);
      console.log(
        `https://cloud.istreams-erp.com:4498/api/empImage/update?email=${userData.currentUserLogin}&fileName=EMPLOYEE_IMAGE_${EMP_NO}`
      );

      debugger;

      const response = await axios.put(
        `https://cloud.istreams-erp.com:4498/api/empImage/update?email=${userData.currentUserLogin}&fileName=EMPLOYEE_IMAGE_${EMP_NO}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "User saved and image updated!",
        });
      } else {
        toast({
          variant: "destructive",
          title: `image update failed with status: ${response.status}`,
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);

      toast({
        variant: "destructive",
        title: "Error saving image.",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Unknown error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {

            const response = await callSoapService(userData.clientURL, "UM_Create_New_User", formData);


      if (!user) {
        await handleUploadImage(formData.EMP_NO);
      }

      toast({
        title: "Employee saved successfully!",
        description: response,
      });

      setFormData(initialFormData);
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating user:",
        error,
      });
    }
  };

  return (
    <DialogContent className="max-h-[80vh] w-full overflow-y-auto sm:w-[600px] sm:max-w-[600px] z-[999]">
      <DialogHeader>
        <DialogTitle>
          <div className="flex flex-row items-center gap-1">
            <UserPlus className="h-5 w-5" />
            <span> {!user ? "Add New" : "Edit User"}</span>
          </div>
        </DialogTitle>
        <DialogDescription>
          {!user
            ? "Please fill in the details to add a new user."
            : `Please fill in the details to edit user ${user?.USER_NAME}.`}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-2 sm:gap-6 py-2 sm:grid-cols-2">
          {/* Left Side */}
          <div className="grid gap-2">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="NEW_USER_NAME" className="text-left">
                User Name
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  name="NEW_USER_NAME"
                  id="NEW_USER_NAME"
                  type="text"
                  placeholder="Type username"
                  className="w-full"
                  value={formData.NEW_USER_NAME}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  tabIndex={-1}
                />
                {loading["USER_NAME"] || (isFocused.NEW_USER_NAME && user) ? (
                  <Button
                    className="flex w-[10%] min-w-[40px] items-center justify-center p-2 bg-green-500"
                    onMouseDown={() =>
                      handleUpdate("USER_NAME", formData.NEW_USER_NAME)
                    }
                  >
                    {loading["USER_NAME"] ? (
                      <BeatLoader color="#000" size={8} />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                  </Button>
                ) : null}
              </div>
              {errors.NEW_USER_NAME && (
                <span className="text-xs text-red-500">
                  {errors.NEW_USER_NAME}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="PASSWORD" className="text-left">
                Password
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  name="PASSWORD"
                  id="PASSWORD"
                  type="password"
                  placeholder="Type password"
                  className="w-full"
                  value={formData.PASSWORD}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  tabIndex={-1}
                />
                {loading["PASSWORD"] || (isFocused.PASSWORD && user) ? (
                  <Button
                    className="flex w-[10%] min-w-[40px] items-center justify-center p-2 bg-green-500"
                    onMouseDown={handleUpdate}
                  >
                    {loading["PASSWORD"] ? (
                      <BeatLoader color="#000" size={8} />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                  </Button>
                ) : null}
              </div>
              {errors.PASSWORD && (
                <span className="text-xs text-red-500">{errors.PASSWORD}</span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="isAdminUser" className="text-left">
                User Type
              </Label>
              <div className="flex items-center gap-1">
                <ToggleGroup
                  type="single"
                  value={formData.isAdminUser ? "true" : "false"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      isAdminUser: value === "true",
                    }))
                  }
                  className="flex justify-start"
                >
                  <ToggleGroupItem value="false" aria-label="Toggle user">
                    User
                  </ToggleGroupItem>
                  <ToggleGroupItem value="true" aria-label="Toggle admin">
                    Admin
                  </ToggleGroupItem>
                </ToggleGroup>
                {loading["USER_TYPE"] || (isFocused.isAdminUser && user) ? (
                  <Button
                    className="flex w-[10%] min-w-[40px] items-center justify-center p-2 bg-green-500"
                    onMouseDown={() =>
                      handleUpdate("USER_TYPE", formData.isAdminUser)
                    }
                  >
                    {loading["USER_TYPE"] ? (
                      <BeatLoader color="#000" size={8} />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="EMAIL_ADDRESS" className="text-left">
                Email Address
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  name="EMAIL_ADDRESS"
                  id="EMAIL_ADDRESS"
                  type="email"
                  placeholder="Enter email address"
                  className="w-full"
                  value={formData.EMAIL_ADDRESS}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  tabIndex={-1}
                />
                {loading["EMAIL_ADDRESS"] ||
                (isFocused.EMAIL_ADDRESS && user) ? (
                  <Button
                    className="flex w-[10%] min-w-[40px] items-center justify-center p-2 bg-green-500"
                    onMouseDown={() =>
                      handleUpdate("EMAIL_ADDRESS", formData.EMAIL_ADDRESS)
                    }
                  >
                    {loading["EMAIL_ADDRESS"] ? (
                      <BeatLoader color="#000" size={8} />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                  </Button>
                ) : null}
              </div>
              {errors.EMAIL_ADDRESS && (
                <span className="text-xs text-red-500">
                  {errors.EMAIL_ADDRESS}
                </span>
              )}
            </div>

            <div className="flex w-full items- gap-1">
              <div className="flex-grow">
                <Label htmlFor="MOBILE_NUMBER" className="text-left">
                  Mobile Number
                </Label>
                <div className="flex items-center gap-1">
                  <Input
                    name="MOBILE_NUMBER"
                    id="MOBILE_NUMBER"
                    type="text"
                    placeholder="Enter mobile number"
                    className="w-full"
                    value={formData.MOBILE_NUMBER}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    tabIndex={-1}
                  />
                  {loading["MOBILE_NO"] || (isFocused.MOBILE_NUMBER && user) ? (
                    <Button
                      className="flex w-[10%] min-w-[40px] items-center justify-center p-2 bg-green-500"
                      onMouseDown={() =>
                        handleUpdate("MOBILE_NO", formData.MOBILE_NUMBER)
                      }
                    >
                      {loading["MOBILE_NO"] ? (
                        <BeatLoader color="#000" size={8} />
                      ) : (
                        <Check className="h-5 w-5" />
                      )}
                    </Button>
                  ) : null}
                </div>
                {errors.MOBILE_NUMBER && (
                  <span className="text-xs text-red-500">
                    {errors.MOBILE_NUMBER}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="FULL_NAME" className="text-left">
                Full Name
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  name="FULL_NAME"
                  id="FULL_NAME"
                  type="text"
                  placeholder="Enter full name"
                  className="w-full"
                  value={formData.FULL_NAME}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  tabIndex={-1}
                />
                {loading["FULL_NAME"] || (isFocused.FULL_NAME && user) ? (
                  <Button
                    className="flex w-[10%] min-w-[40px] items-center justify-center p-2 bg-green-500"
                    onMouseDown={() =>
                      handleUpdate("FULL_NAME", formData.FULL_NAME)
                    }
                  >
                    {loading["FULL_NAME"] ? (
                      <BeatLoader color="#000" size={8} />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                  </Button>
                ) : null}
              </div>
              {errors.FULL_NAME && (
                <span className="text-xs text-red-500">{errors.FULL_NAME}</span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="EMP_NO" className="text-left">
                Employee Number
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  name="EMP_NO"
                  id="EMP_NO"
                  type="text"
                  placeholder="Enter employee number"
                  className="w-full"
                  value={formData.EMP_NO}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  tabIndex={-1}
                />
                {loading["EMP_NO"] || (isFocused.EMP_NO && user) ? (
                  <Button
                    className="flex w-[10%] min-w-[40px] items-center justify-center p-2 bg-green-500"
                    onMouseDown={() => handleUpdate("EMP_NO", formData.EMP_NO)}
                  >
                    {loading["EMP_NO"] ? (
                      <BeatLoader color="#000" size={8} />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                  </Button>
                ) : null}
              </div>
              {errors.EMP_NO && (
                <span className="text-xs text-red-500">{errors.EMP_NO}</span>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-2">
            <div className="w-full">
              <Label htmlFor="image_file" className="text-left">
                Upload Image
              </Label>
              <label
                htmlFor="employeeImage"
                className="flex aspect-square h-[240px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                {formData.employeeImage ? (
                  <img
                    src={previewUrl}
                    alt={formData.FULL_NAME}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Click to Upload
                  </div>
                )}
              </label>
              <input
                id="employeeImage"
                name="employeeImage"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              {errors.employeeImage && (
                <p className="text-xs text-red-500">{errors.employeeImage}</p>
              )}
            </div>

            <div>
              <Label htmlFor="DOMAIN_NAME" className="text-left">
                Domain Name
              </Label>
              <Input
                name="DOMAIN_NAME"
                id="DOMAIN_NAME"
                type="text"
                placeholder="Enter domain name"
                className="w-full"
                value={formData.DOMAIN_NAME}
                onChange={handleChange}
                onBlur={handleBlur}
                readOnly={true}
                tabIndex={-1}
              />
              {errors.DOMAIN_NAME && (
                <span className="text-xs text-red-500">
                  {errors.DOMAIN_NAME}
                </span>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  name="accountExpired"
                  id="accountExpired"
                  checked={formData.accountExpired}
                  onCheckedChange={(checked) =>
                    handleChange(checked, "accountExpired")
                  }
                />
                <label
                  htmlFor="accountExpired"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Account Expired
                </label>
              </div>

              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    name="accountLocked"
                    id="accountLocked"
                    checked={formData.accountLocked}
                    onCheckedChange={(checked) =>
                      handleChange(checked, "accountLocked")
                    }
                  />
                  <label
                    htmlFor="accountLocked"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Account Locked
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!user ? (
          <>
            <Separator />
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button variant="default" type="submit">
                Save
              </Button>
            </div>
          </>
        ) : null}
      </form>
    </DialogContent>
  );
};

export default UserCreateModal;