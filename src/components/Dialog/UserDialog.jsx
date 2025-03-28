import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SquarePen, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Validate the entire form on submission.
const validateForm = (data) => {
    const errors = {};

    if (!data.userName || data.userName.trim().length < 2) {
        errors.userName = "Username must be at least 2 characters.";
    }
    if (!data.password || data.password.trim().length < 6) {
        errors.password = "Password must be at least 6 characters.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = "Please enter a valid email address.";
    }
    if (!data.mobileNumber || data.mobileNumber.trim().length < 10) {
        errors.mobileNumber = "Mobile number must be at least 10 digits.";
    }
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.fullName = "Full name is required.";
    }
    if (!data.employeeNumber || data.employeeNumber.trim().length < 2) {
        errors.employeeNumber = "Employee number is required.";
    }
    if (!data.domainName || data.domainName.trim().length < 2) {
        errors.domainName = "Domain name is required.";
    }

    return errors;
};

// Validate a single field on blur.
const validateInput = (name, value) => {
    switch (name) {
        case "userName":
            if (!value || value.trim().length < 2) {
                return "Username must be at least 2 characters.";
            }
            break;
        case "password":
            if (!value || value.trim().length < 6) {
                return "Password must be at least 6 characters.";
            }
            break;
        case "email":
            {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) {
                    return "Please enter a valid email address.";
                }
            }
            break;
        case "mobileNumber":
            if (!value || !/^\d{10}$/.test(value)) {
                return "Mobile number must be exactly 10 digits.";
            }
            break;
        case "fullName":
            if (!value || value.trim().length < 2) {
                return "Full name must be at least 2 characters.";
            }
            break;
        case "employeeNumber":
            if (!value || value.trim().length < 2) {
                return "Employee number must be at least 2 characters.";
            }
            break;
        case "domainName":
            if (!value || value.trim().length < 2) {
                return "Domain name must be at least 2 characters.";
            }
            break;
        default:
            return "";
    }
    return "";
};

const UserDialog = () => {
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [userFormData, setUserFormData] = useState({
        userName: "",
        password: "",
        userType: "user",
        email: "",
        mobileNumber: "",
        fullName: "",
        employeeNumber: "",
        domainName: "",
        employeeImage: "",
        accountExpired: false,
        accountLocked: false,
    });

    // General change handler for inputs.
    const handleChange = (eventOrValue, fieldName) => {
        if (eventOrValue && eventOrValue.target) {
            const { name, value, type, checked } = eventOrValue.target;
            setUserFormData((prevData) => ({
                ...prevData,
                [name]: type === "checkbox" ? checked : value,
            }));
        } else {
            // For custom components like Select or Checkbox with onCheckedChange.
            setUserFormData((prevData) => ({
                ...prevData,
                [fieldName]: eventOrValue,
            }));
        }
    };

    // Validate field on blur and update errors state.
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const errorMessage = validateInput(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: errorMessage,
        }));
    };

    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    // Handle image file upload.
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setUserFormData((prevData) => ({
                ...prevData,
                employeeImage: file.name,
            }));
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    // Form submit handler validates the entire form.
    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(userFormData);
        console.table(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return
        }
        setErrors({});
        console.log("Form Data:", userFormData);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} className="z-50">
            <DialogTrigger asChild>
                <Button variant="outline">Add User</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] w-full overflow-y-auto sm:w-[600px] sm:max-w-[600px] z-[999]">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex flex-row items-center gap-1">
                            <UserPlus className="h-5 w-5" />
                            <span>Add User</span>
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        Please fill in the details to add a new user.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-2 sm:gap-6 py-2 sm:grid-cols-2">
                        {/* Left Side */}
                        <div className="grid gap-2">
                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="userName" className="text-left">
                                    Username
                                </Label>
                                <Input
                                    name="userName"
                                    id="userName"
                                    type="text"
                                    placeholder="Type username"
                                    className="w-full"
                                    value={userFormData.userName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.userName && (
                                    <span className="text-xs text-red-500">{errors.userName}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="password" className="text-left">
                                    Password
                                </Label>
                                <Input
                                    name="password"
                                    id="password"
                                    type="password"
                                    placeholder="Type password"
                                    className="w-full"
                                    value={userFormData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.password && (
                                    <span className="text-xs text-red-500">{errors.password}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="userType" className="text-left">
                                    User Type
                                </Label>
                                <Select
                                    value={userFormData.userType}
                                    onChange={(value) =>
                                        setUserFormData((prevData) => ({ ...prevData, userType: value }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a user type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="email" className="text-left">
                                    Email Address
                                </Label>
                                <Input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    className="w-full"
                                    value={userFormData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.email && (
                                    <span className="text-xs text-red-500">{errors.email}</span>
                                )}
                            </div>

                            <div className="flex w-full items-end gap-1">
                                <div className="flex-grow">
                                    <Label htmlFor="mobile" className="text-left">
                                        Mobile Number
                                    </Label>
                                    <Input
                                        name="mobileNumber"
                                        id="mobile"
                                        type="text"
                                        placeholder="Enter mobile number"
                                        className="w-full"
                                        value={userFormData.mobileNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.mobileNumber && (
                                        <span className="text-xs text-red-500">{errors.mobileNumber}</span>
                                    )}
                                </div>
                                <Button className="flex w-[10%] min-w-[40px] items-center justify-center p-2">
                                    <SquarePen className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="fullName" className="text-left">
                                    Full Name
                                </Label>
                                <Input
                                    name="fullName"
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter full name"
                                    className="w-full"
                                    value={userFormData.fullName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.fullName && (
                                    <span className="text-xs text-red-500">{errors.fullName}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="employeeNumber" className="text-left">
                                    Employee Number
                                </Label>
                                <Input
                                    name="employeeNumber"
                                    id="employeeNumber"
                                    type="text"
                                    placeholder="Enter employee number"
                                    className="w-full"
                                    value={userFormData.employeeNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.employeeNumber && (
                                    <span className="text-xs text-red-500">{errors.employeeNumber}</span>
                                )}
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col gap-2">
                            <div>
                                <Label htmlFor="domainName" className="text-left">
                                    Domain Name
                                </Label>
                                <Input
                                    name="domainName"
                                    id="domainName"
                                    type="text"
                                    placeholder="Enter domain name"
                                    className="w-full"
                                    value={userFormData.domainName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.domainName && (
                                    <span className="text-xs text-red-500">{errors.domainName}</span>
                                )}
                            </div>

                            <div className="space-y-0">
                                <Label htmlFor="employeeImage" className="text-left">
                                    Upload Picture
                                </Label>
                                <div
                                    className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-2 border-gray-300 bg-gray-100 hover:bg-gray-200"
                                    onClick={handleClick}
                                >
                                    {image ? (
                                        <img
                                            src={image}
                                            alt="Profile Preview"
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center text-sm text-gray-500">Click to Upload</div>
                                    )}
                                </div>
                                <input
                                    name="employeeImage"
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>

                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        name="accountExpired"
                                        id="accountExpired"
                                        checked={userFormData.accountExpired}
                                        onCheckedChange={(checked) => handleChange(checked, "accountExpired")}
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
                                            checked={userFormData.accountLocked}
                                            onCheckedChange={(checked) => handleChange(checked, "accountLocked")}
                                        />
                                        <label
                                            htmlFor="accountLocked"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Account Locked
                                        </label>
                                    </div>
                                    <Button className="w-full px-3 py-1 text-sm sm:w-28">Reset Password</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="mt-2 flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="default" type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserDialog;