import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

const CustomerTable = () => {
  
  const [carts, setCarts] = useState([
    {
      companyname: "Alpha Tech Solutions",
      email: "contact@alphatech.com",
      natureofbusiness: "Software Development",
      phonenumber: "+1 234 567 8901",
      country: "USA",
      city: "New York",
    },
    {
      companyname: "Beta Manufacturing Co.",
      email: "info@betamfg.com",
      natureofbusiness: "Manufacturing",
      phonenumber: "+44 123 456 7890",
      country: "UK",
      city: "London",
    },
    {
      companyname: "Gamma Consulting",
      email: "support@gammaconsulting.com",
      natureofbusiness: "Consulting",
      phonenumber: "+49 151 2345 6789",
      country: "Germany",
      city: "Berlin",
    },
    {
      companyname: "Delta Logistics",
      email: "sales@deltalogistics.com",
      natureofbusiness: "Logistics",
      phonenumber: "+33 612 345 678",
      country: "France",
      city: "Paris",
    },
    {
      companyname: "Epsilon Traders",
      email: "trading@epsilon.com",
      natureofbusiness: "Trading",
      phonenumber: "+91 98765 43210",
      country: "India",
      city: "Mumbai",
    },
    {
      companyname: "Zeta HealthCare",
      email: "care@zetahealth.com",
      natureofbusiness: "Healthcare",
      phonenumber: "+1 310 555 6789",
      country: "USA",
      city: "Los Angeles",
    },
    {
      companyname: "Eta Financial Services",
      email: "finance@etafs.com",
      natureofbusiness: "Finance",
      phonenumber: "+61 432 876 543",
      country: "Australia",
      city: "Sydney",
    },
    {
      companyname: "Theta Automobiles",
      email: "contact@thetaauto.com",
      natureofbusiness: "Automobile Manufacturing",
      phonenumber: "+81 90 1234 5678",
      country: "Japan",
      city: "Tokyo",
    },
    {
      companyname: "Iota Media Group",
      email: "media@iotamedia.com",
      natureofbusiness: "Media & Entertainment",
      phonenumber: "+55 21 99999 8888",
      country: "Brazil",
      city: "Rio de Janeiro",
    },
    {
      companyname: "Kappa Retail Stores",
      email: "support@kapparetail.com",
      natureofbusiness: "Retail",
      phonenumber: "+27 82 345 6789",
      country: "South Africa",
      city: "Johannesburg",
    },
    {
      companyname: "Lambda Electronics",
      email: "info@lambdaelectronics.com",
      natureofbusiness: "Electronics Manufacturing",
      phonenumber: "+82 10 9876 5432",
      country: "South Korea",
      city: "Seoul",
    },
    {
      companyname: "Mu Engineering",
      email: "contact@muengineering.com",
      natureofbusiness: "Engineering Services",
      phonenumber: "+971 50 123 4567",
      country: "UAE",
      city: "Dubai",
    },
    {
      companyname: "Nu Pharmaceuticals",
      email: "info@nupharmaceuticals.com",
      natureofbusiness: "Pharmaceuticals",
      phonenumber: "+39 320 456 7890",
      country: "Italy",
      city: "Rome",
    },
    {
      companyname: "Xi Fashion",
      email: "support@xifashion.com",
      natureofbusiness: "Fashion & Apparel",
      phonenumber: "+34 600 123 456",
      country: "Spain",
      city: "Barcelona",
    },
    {
      companyname: "Omicron Construction",
      email: "info@omicronconstruction.com",
      natureofbusiness: "Construction",
      phonenumber: "+7 911 234 5678",
      country: "Russia",
      city: "Moscow",
    },
    {
      companyname: "Pi Food Processing",
      email: "sales@pifoods.com",
      natureofbusiness: "Food Processing",
      phonenumber: "+86 139 1234 5678",
      country: "China",
      city: "Shanghai",
    },
    {
      companyname: "Rho Renewable Energy",
      email: "contact@rhoenergy.com",
      natureofbusiness: "Renewable Energy",
      phonenumber: "+1 305 678 1234",
      country: "USA",
      city: "Miami",
    },
    {
      companyname: "Sigma Security",
      email: "info@sigmasecurity.com",
      natureofbusiness: "Cybersecurity",
      phonenumber: "+32 478 123 456",
      country: "Belgium",
      city: "Brussels",
    },
    {
      companyname: "Tau Education Services",
      email: "support@tauedu.com",
      natureofbusiness: "Education",
      phonenumber: "+66 89 456 7890",
      country: "Thailand",
      city: "Bangkok",
    },
    {
      companyname: "Upsilon Tourism",
      email: "info@upsilontourism.com",
      natureofbusiness: "Travel & Tourism",
      phonenumber: "+52 55 7890 1234",
      country: "Mexico",
      city: "Mexico City",
    },
  ]);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Customer Table</h1>
      <div>
        <div className="grid grid-cols-12 gap-2 mb-2">
          {/* Button Section */}
          <div className="col-span-12 flex w-full justify-end text-xs md:col-span-2 md:col-start-7 lg:col-span-2 lg:col-start-7">
            <Button className="btn-sm w-full text-xs sm:w-full md:ms-0 md:w-32 lg:ms-4 lg:w-32">
              <PlusIcon size={64} />
              Add Customer
            </Button>
          </div>

          {/* Input Field */}
          <div className="col-span-12 md:col-span-4 lg:col-span-4">
            <Input
              type="text"
              placeholder="Search customers..."
              className="w-full"
            />
          </div>
        </div>

        <Table className="whitespace-nowrap">
          <ScrollArea className="h-[68vh] w-full rounded-md border p-4">
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead className="text-start">Eamil</TableHead>
                <TableHead className="text-start">Nature Of Business</TableHead>
                <TableHead className="text-start">Phone Number</TableHead>
                <TableHead className="text-start">Contry</TableHead>
                <TableHead className="text-start">City</TableHead>
                <TableHead className="text-start">Actions</TableHead>
              </TableRow>
            </TableHeader>

            {carts.length === 0 ? (
              <TableBody className="text-start">
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-5 text-center text-gray-500"
                  >
                    -- No Material Added Yet. Search to Add Material --
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {carts.map((cart, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{cart.companyname}</TableCell>
                    <TableCell>{cart.email}</TableCell>
                    <TableCell>{cart.natureofbusiness}</TableCell>
                    <TableCell>{cart.phonenumber}</TableCell>
                    <TableCell>{cart.country}</TableCell>
                    <TableCell>{cart.city}</TableCell>
                    <TableCell className="text-center text-xs">
                      <Button
                        variant="gost"
                        className="me-2 bg-transparent p-0 text-blue-500"
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="gost"
                        className="bg-transparent p-0 text-red-500"
                      >
                        <TrashIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </ScrollArea>
        </Table>
      </div>
    </div>
  );
};

export default CustomerTable;
