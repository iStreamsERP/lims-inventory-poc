import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SquarePen, Trash2, UserPlus } from "lucide-react";
import { useRef, useState } from "react";

const RegisterListPage = () => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Trigger file input on clicking the preview
  const handleClick = () => {
    fileInputRef.current.click();
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add User</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] w-full overflow-y-auto sm:w-[900px] sm:max-w-[900px]">
          <DialogHeader className="!m-0 flex flex-row items-center gap-1 !p-0">
            <UserPlus className="h-6 w-6" />
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>

          <Separator />

          {/* Grid Wrapper */}
          <div className="grid grid-cols-1 gap-2 sm:gap-6 py-2 sm:grid-cols-2">
            {/* Left Side */}
            <div className="grid gap-2">
              {/* Username */}
              <div className="grid grid-cols-1 gap-2">
                <Label
                  htmlFor="username"
                  className="text-left"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Type username"
                  className="w-full"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 gap-2">
                <Label
                  htmlFor="password"
                  className="text-left"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="Type password"
                  className="w-full"
                />
              </div>

              {/* User Type */}
              <div className="grid grid-cols-1 gap-2">
                <Label
                  htmlFor="userType"
                  className="text-left"
                >
                  User Type
                </Label>
                <Select defaultValue="user">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Email Address */}
              <div className="grid grid-cols-1 gap-2">
                <Label
                  htmlFor="email"
                  className="text-left"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="Enter email address"
                  className="w-full"
                />
              </div>

              {/* Mobile Number */}
              <div className="flex w-full items-end gap-1">
                {/* Input field take's 90% of the width */}
                <div className="flex-grow">
                  <Label
                    htmlFor="mobile"
                    className="text-left"
                  >
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    placeholder="Enter mobile number"
                    className="w-full"
                  />
                </div>

                {/* Button width (10%) */}
                <Button className="flex w-[10%] min-w-[40px] items-center justify-center p-2">
                  <SquarePen className="h-5 w-5" />
                </Button>
              </div>

              {/* Full Name */}
              <div className="grid grid-cols-1 gap-2">
                <Label
                  htmlFor="fullName"
                  className="text-left"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter full name"
                  className="w-full"
                />
              </div>

              {/* Employee Number */}
              <div className="grid grid-cols-1 gap-2">
                <Label
                  htmlFor="employeeNumber"
                  className="text-left"
                >
                  Employee Number
                </Label>
                <Input
                  id="employeeNumber"
                  placeholder="Enter employee number"
                  className="w-full"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col sm:gap-4 gap-2">
              {/* Domain Name */}
              <div className="">
                <Label
                  htmlFor="domain"
                  className="text-left"
                >
                  Domain Name
                </Label>
                <Input
                  id="domain"
                  placeholder="Enter domain name"
                  className="w-full"
                />
              </div>

              {/* Picture Box with Clickable Preview */}
              <div className="space-y-0">
                <Label
                  htmlFor="picture"
                  className="text-left"
                >
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
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="accountExpired" />
                  <label
                    htmlFor="accountExpired"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Account Expired
                  </label>
                </div>

                {/* Account Locked and Reset Button in Same Row */}
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="accountLocked" />
                    <label
                      htmlFor="accountLocked"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Account Locked
                    </label>
                  </div>
                  {/* Reset Password Button */}
                  <Button className="w-full px-3 py-1 text-sm sm:w-28">Reset Password</Button>
                </div>
              </div>
            </div>
          </div>
          {/* Dialog Footer */}
          <DialogFooter className="mt-auto flex justify-end">
            <Button
              type="submit"
              className="w-full sm:w-auto"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full overflow-x-auto">
        <Table className="w-full min-w-[600px] border-collapse">
          <TableHeader className="">
            <TableRow>
              <TableHead className="w-[60px] p-2 text-xs md:text-sm">S.No</TableHead>
              <TableHead className="p-2 text-xs md:text-sm">User Name</TableHead>
              <TableHead className="p-2 text-xs md:text-sm">Type</TableHead>
              <TableHead className="p-2 text-xs md:text-sm">Email</TableHead>
              <TableHead className="p-2 text-xs md:text-sm">Phone</TableHead>
              <TableHead className="p-2 text-xs md:text-sm">Password</TableHead>
              <TableHead className="p-2 text-xs md:text-sm">Emp-No</TableHead>
              <TableHead className="p-2 text-center text-xs md:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-gray-50">
              <TableCell className="p-2 text-xs font-medium md:text-sm">01</TableCell>
              <TableCell className="p-2 text-xs md:text-sm">Gopi</TableCell>
              <TableCell className="p-2 text-xs md:text-sm">User</TableCell>
              <TableCell className="p-2 text-xs md:text-sm">gopi@demo.com</TableCell>
              <TableCell className="p-2 text-xs md:text-sm">+91 8965745121</TableCell>
              <TableCell className="p-2 text-xs md:text-sm">1234</TableCell>
              <TableCell className="p-2 text-xs md:text-sm">EMP5584</TableCell>
              <TableCell className="flex justify-center space-x-2 p-2 text-xs md:text-sm">
                <button className="text-indigo-400 hover:text-indigo-300">
                  <SquarePen size={18} />
                </button>
                <button className="text-red-400 hover:text-red-300">
                  <Trash2 size={18} />
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RegisterListPage;
