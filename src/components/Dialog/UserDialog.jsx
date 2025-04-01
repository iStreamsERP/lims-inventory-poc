import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/AuthContext";
import { createNewUser } from "@/services/userManagementService";
import { getDomainFromEmail } from "@/utils/emailHelpers";
import { Check, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Validate the entire form on submission.
const validateForm = (data) => {
    const errors = {};

    if (!data.newUserName || data.newUserName.trim().length < 2) {
        errors.newUserName = "Username must be at least 2 characters.";
    }
    if (!data.password || data.password.trim().length < 6) {
        errors.password = "Password must be at least 6 characters.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.emailAddress || !emailRegex.test(data.emailAddress)) {
        errors.emailAddress = "Please enter a valid email address.";
    }
    if (!data.mobileNumber || data.mobileNumber.trim().length < 10) {
        errors.mobileNumber = "Mobile number must be at least 10 digits.";
    }
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.fullName = "Full name is required.";
    }
    if (!data.empNo || data.empNo.trim().length < 2) {
        errors.empNo = "Employee number is required.";
    }

    return errors;
};

// Validate a single field on blur.
const validateInput = (name, value) => {
    switch (name) {
        case "newUserName":
            if (!value || value.trim().length < 2) {
                return "Username must be at least 2 characters.";
            }
            break;
        case "password":
            if (!value || value.trim().length < 6) {
                return "Password must be at least 6 characters.";
            }
            break;
        case "emailAddress":
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
        case "empNo":
            if (!value || value.trim().length < 2) {
                return "Employee number must be at least 2 characters.";
            }
            break;
        default:
            return "";
    }
    return "";
};

const UserDialog = ({ open, setOpen, user, handleEditUser, handleOnSuccess }) => {
    const { userData } = useAuth();
    const DOMAIN_NAME = getDomainFromEmail(userData.currentUserLogin);

    const [errors, setErrors] = useState({});
    const [userFormData, setUserFormData] = useState({
        loginUserName: userData.currentUserName,
        newUserName: "",
        password: "",
        isAdminUser: false,
        emailAddress: "",
        mobileNumber: "",
        fullName: "",
        empNo: "",
        domainName: DOMAIN_NAME,
        employeeImage: "",
        accountExpired: false,
        accountLocked: false,
    });

    useEffect(() => {
        const DOMAIN_NAME = getDomainFromEmail(user?.EMAIL_ADDRESS);
        if (user) {
            setUserFormData({
                loginUserName: userData.currentUserName,
                newUserName: user?.USER_NAME || "",
                password: "",
                isAdminUser: user?.USER_TYPE || false,
                emailAddress: user?.EMAIL_ADDRESS || "",
                mobileNumber: user?.MOBILE_NO || "",
                fullName: user?.FULL_NAME || "",
                empNo: user?.EMP_NO || "",
                domainName: DOMAIN_NAME,
                employeeImage: user?.employeeImage || "",
                accountExpired: user?.ACCOUNT_EXPIRED || false,
                accountLocked: user?.ACCOUNT_LOCKED || false,
            });
        }
    }, [user])

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(userFormData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return
        }
        setErrors({});

        if (!user) {
            const handleCreateNewUser = async () => {
                try {
                    const createNewUserResponse = await createNewUser(userFormData, userData.currentUserLogin, userData.clientURL)
                    handleOnSuccess(userFormData);
                    console.log(createNewUserResponse);
                } catch (error) {
                    console.log(error);
                }
            }
            handleCreateNewUser();
        }
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} className="z-50">
            <DialogTrigger asChild>
                <Button>Add User</Button>
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
                                <Label htmlFor="newUserName" className="text-left">
                                    Username
                                </Label>
                                <Input
                                    name="newUserName"
                                    id="newUserName"
                                    type="text"
                                    placeholder="Type username"
                                    className="w-full"
                                    value={userFormData.newUserName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.newUserName && (
                                    <span className="text-xs text-red-500">{errors.newUserName}</span>
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
                                <Label htmlFor="isAdminUser" className="text-left">
                                    User Type
                                </Label>
                                <ToggleGroup
                                    type="single"
                                    value={userFormData.isAdminUser ? "true" : "false"}
                                    onValueChange={(value) =>
                                        setUserFormData((prev) => ({ ...prev, isAdminUser: value === "true" }))
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
                            </div>


                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="emailAddress" className="text-left">
                                    Email Address
                                </Label>
                                <Input
                                    name="emailAddress"
                                    id="emailAddress"
                                    type="email"
                                    placeholder="Enter email address"
                                    className="w-full"
                                    value={userFormData.emailAddress}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.emailAddress && (
                                    <span className="text-xs text-red-500">{errors.emailAddress}</span>
                                )}
                            </div>

                            <div className="flex w-full items-end gap-1">
                                <div className="flex-grow">
                                    <Label htmlFor="mobileNumber" className="text-left">
                                        Mobile Number
                                    </Label>
                                    <Input
                                        name="mobileNumber"
                                        id="mobileNumber"
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
                                <Button className="flex w-[10%] min-w-[40px] items-center justify-center p-2 bg-green-500">
                                    <Check className="h-5 w-5" />
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
                                <Label htmlFor="empNo" className="text-left">
                                    Employee Number
                                </Label>
                                <Input
                                    name="empNo"
                                    id="empNo"
                                    type="text"
                                    placeholder="Enter employee number"
                                    className="w-full"
                                    value={userFormData.empNo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.empNo && (
                                    <span className="text-xs text-red-500">{errors.empNo}</span>
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
                                    readOnly={true}
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