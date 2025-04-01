import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SquarePen, Trash2 } from 'lucide-react';

const CustomersInformation = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <Card className="w-full p-4">
        <form>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            {/* Add Customer Card - 70% width on medium screens and above */}
            <Card className="w-full lg:w-[70%]">
              <CardHeader>
                <CardTitle>Add Customer</CardTitle>
              </CardHeader>
              <CardContent>

                <div className="flex flex-wrap gap-4 overflow-y-auto">
                  {/* Row 1 */}
                  <div className="flex w-full flex-col gap-2 md:flex-row">
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="CLIENT_NAME">Company Name</Label>
                      <Input id="CLIENT_NAME" placeholder="Name of your Company" />
                    </div>
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="EMAIL_ADDRESS">Email</Label>
                      <Input id="EMAIL_ADDRESS" placeholder="Enter Email" />
                    </div>

                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="NATURE_OF_BUSINESS">Select Business</Label>
                      <Select>
                        <SelectTrigger id="NATURE_OF_BUSINESS">
                          <SelectValue placeholder="Select Business" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="hardware">Hardware</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row- 2 */}
                  <div className="flex w-full flex-col gap-2 md:flex-row">

                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="TRN_VAT_NO">VAT/GST/TAX No</Label>
                      <Input
                        id="TRN_VAT_NO"
                        placeholder="Enter Tax.no"
                      />
                    </div>

                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="GROUP_NAME">Group of</Label>
                      <Input
                        id="GROUP_NAME"
                        placeholder="Enter Group Name"
                      />
                    </div>
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="TELEPHONE_NO">Phone Number</Label>
                      <Input
                        id="TELEPHONE_NO"
                        placeholder="Enter Phone Number"
                      />
                    </div>
                  </div>

                  {/* Row-3 */}
                  <div className="flex w-full flex-col gap-2 md:flex-row">
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="CITY_NAME">City</Label>
                      <Input
                        id="CITY_NAME"
                        placeholder="Enter City Name"
                      />
                    </div>
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="COUNTRY">Select Country</Label>
                      <Select>
                        <SelectTrigger id="COUNTRY">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="india">India</SelectItem>
                          <SelectItem value="usa">USA</SelectItem>
                          <SelectItem value="uk">UK</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="WEB_ADDRESS">Website</Label>
                      <Input
                        id="WEB_ADDRESS"
                        placeholder="Enter Website"
                      />
                    </div>
                  </div>

                  {/* Row-4 */}
                  <div className="flex w-full flex-col gap-2 md:flex-row">

                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="COMMUNICATION_ADDRESS">Comm Address</Label>
                      <Textarea
                        id="COMMUNICATION_ADDRESS"
                        placeholder="Communication Address"
                      />
                    </div>

                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="INVOICE_ADDRESS">Invoice Address</Label>
                      <Textarea
                        id="INVOICE_ADDRESS"
                        placeholder="Invoice Address"
                      />
                    </div>
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="DELIVERY_ADDRESS">Delivery Address</Label>
                      <Textarea
                        id="DELIVERY_ADDRESS"
                        placeholder="Delivery Address"
                      />
                    </div>
                  </div>

                </div>

              </CardContent>
            </Card>

            {/* Add Contacts Card - 30% width on medium screens and above */}
            <Card className="w-full lg:w-[30%]">
              <CardHeader>
                <CardTitle>Add Contacts</CardTitle>
              </CardHeader>
              <CardContent>

                <div className="flex flex-wrap flex-col gap-4 ">
                  <Card className="w-full h-[100px] flex flex-col gap-2 text-xs justify-center p-2">
                    <div className="flex justify-between">
                    <div>
                      <p className="">Haneesh</p>
                      <p>Manager</p>
                      <p>Haneesh@gmail.com</p>
                      <p>9865748541</p>
                      </div>
                      <div className="flex flex-row gap-2">
                        <SquarePen size={18} />
                        <Trash2 size={18}/>
                      </div>
                      </div>
                  </Card>
                  <Card className="w-full h-[100px] flex flex-col gap-2 text-xs justify-center p-2">
                    <div className="flex justify-between">
                    <div>
                      <p className="">Haneesh</p>
                      <p>Manager</p>
                      <p>Haneesh@gmail.com</p>
                      <p>9865748541</p>
                      </div>
                      <div className="flex flex-row gap-2">
                        <SquarePen size={18} />
                        <Trash2 size={18}/>
                      </div>
                      </div>
                  </Card>
                  <Card className="w-full h-[100px] flex flex-col gap-2 text-xs justify-center p-2">
                    <div className="flex justify-between">
                    <div>
                      <p className="">Haneesh</p>
                      <p>Manager</p>
                      <p>Haneesh@gmail.com</p>
                      <p>9865748541</p>
                      </div>
                      <div className="flex flex-row gap-2">
                        <SquarePen size={18} />
                        <Trash2 size={18}/>
                      </div>
                      </div>
                  </Card>
                </div>

              </CardContent>
              <CardFooter className="flex items-center justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-1/2">Add Contact</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form>
                      <DialogHeader>
                        <DialogTitle>Add Contact</DialogTitle>
                        <DialogDescription>Enter the contact details and click save.</DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 py-4">
                        {/* Name */}
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="NAME">Name</Label>
                          <Input
                            id="NAME"
                            placeholder="Contact Name"
                          />
                        </div>

                        {/* Designation */}
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="DESIGNATION">Designation</Label>
                          <Input
                            id="DESIGNATION"
                            placeholder="Designation"
                          />
                        </div>

                        {/* Contact For */}
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="CONTACT_FOR">Contact for</Label>
                          <Select>
                            <SelectTrigger id="CONTACT_FOR">
                              <SelectValue placeholder="Contact for" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="enquiry">Enquiry</SelectItem>
                              <SelectItem value="transportation">Transportation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="EMAIL_ADDRESS">Email</Label>
                          <Input
                            id="EMAIL_ADDRESS"
                            placeholder="Contact Email"
                          />
                        </div>

                          <div className="flex w-full flex-col space-y-1.5">
                            <Label htmlFor="MOBILE_NO">Mobile Number</Label>
                            <Input
                              id="MOBILE_NO"
                              placeholder="Mobile No"
                            />
                          </div>

                          <div className="flex w-full flex-col space-y-1.5">
                            <Label htmlFor="ALTERNATIVE_CONTACT">Alternative Number</Label>
                            <Input
                              id="ALTERNATIVE_CONTACT"
                              placeholder="Alternative No"
                            />
                          </div>
                       
                      </div>
                      <DialogFooter className="justify-center mt-auto">
                        <Button className="w-full" type="submit">Save Contact</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>

          <CardFooter className="flex items-center justify-center mt-4">
            <Button >Add Customer</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CustomersInformation;
