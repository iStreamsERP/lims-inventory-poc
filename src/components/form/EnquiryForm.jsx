import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "../ui/textarea";


const EnquiryForm = () => {
  const [enquiry, setEnquiry] = useState({
    name: "",
    emailId: "",
    phoneNumber: "",
    companyName: "",
    subject: "",
    description: "",
    details: "",
  });

  const handleChange = (e) => {
    setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enquiry Submitted:", enquiry);
    toast.success("Enquiry submitted successfully!");

    // Reset form after submission
    setEnquiry({
      name: "",
      emailId: "",
      phoneNumber: "",
      companyName: "",
      subject: "",
      description: "",
      details: "",
    });
  };


  return (
    <div>
        <h1 className="title mt-3">Enquiry Form</h1>
<form>
<Card className="w-full mt-5 ">
      <CardContent>
      <div className="flex flex-col md:flex-row gap-3 mt-3 mb-3">
            <div className="w-full">
              <Label htmlFor="name">Name</Label>
              <Input
                name="name"
                id="name"
                type="text"
                placeholder="Enter name"
               
              />
            </div>
            <div className="w-full">
              <Label htmlFor="email">Email Id</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="Enter email"
                
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                name="phone"
                id="phone"
                type="text"
                placeholder="Enter phone"
               
              />
            </div>
            <div className="w-full">
              <Label htmlFor="companyname">
              Company Name</Label>
              <Input
                name="companyname"
                id="companyname"
                type="text"
                placeholder="Enter companyname"
                
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full">
              <Label htmlFor="subject">Subject</Label>
              <Input
                name="subject"
                id="subject"
                type="text"
                placeholder="Enter subject"
               
              />
            </div>
            <div className="w-full">
              <Label htmlFor="description">
              Description</Label>
              <Input
                name="description"
                id="description"
                type="text"
                placeholder="Enter description"
                
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full">
              <Label htmlFor="details">Details</Label>
              <Textarea
                name="details"
                id="details"
                type="text"
                placeholder="Enter details"
               
               
              />
            </div>
            
          </div>

          
      </CardContent>
      <CardFooter className="w-full flex justify-center">
        <Button >
           Submit Enquiry
        </Button>
      </CardFooter>
    </Card>
</form>

    </div>
  );
};

export default EnquiryForm;
