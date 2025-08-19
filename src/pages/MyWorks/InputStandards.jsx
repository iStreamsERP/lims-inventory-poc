import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Import the Checkbox component

const AUTH_TYPES = [
  {
    ITEM_LABEL: "REP",
    ITEM_VALUE: "rep",
  },
  {
    ITEM_LABEL: "ARS",
    ITEM_VALUE: "ars",
  },
  {
    ITEM_LABEL: "OTH",
    ITEM_VALUE: "oth",
  },
  {
    ITEM_LABEL: "MMP",
    ITEM_VALUE: "mmp",
  }
];

function InputStandards() {
  const [formData, setFormData] = useState({
    gatePassNo: '',
    type: "",
    termsAccepted: false, // Added checkbox state
    notificationsEnabled: false, // Additional checkbox example
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }
    console.log(formData);
  };
  
  return (
    <div className='p-6 bg-black h-screen text-white'>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='p-2 flex gap-2 border-2'>
          <Input 
            value={formData.gatePassNo} 
            name="gatePassNo" 
            onChange={(e) => handleChange('gatePassNo', e.target.value)} 
            placeholder="Enter Gate Pass No"
          />
          
          <Select 
            value={formData.type} 
            onValueChange={(val) => handleChange('type', val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {AUTH_TYPES.map((item) => (
                <SelectItem
                  key={item.ITEM_VALUE}
                  value={item.ITEM_VALUE}
                >
                  {item.ITEM_LABEL}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Checkbox for terms and conditions */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => handleChange('termsAccepted', checked)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>

        {/* Another checkbox example */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="notifications" 
            checked={formData.notificationsEnabled}
            onCheckedChange={(checked) => handleChange('notificationsEnabled', checked)}
          />
          <label
            htmlFor="notifications"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable email notifications
          </label>
        </div>

        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default InputStandards;