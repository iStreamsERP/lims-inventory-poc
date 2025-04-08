import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

const EnquiryForm = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Enquiry Form</h1>
      <form className="w-full grid grid-cols-2 gap-4">
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="newUserName" className="text-left">
            Name
          </Label>
          <div className="flex items-center gap-1">
            <Input
              name="newUserName"
              id="newUserName"
              type="text"
              placeholder="Type Email Id"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="newUserName" className="text-left">
            Email Id
          </Label>
          <div className="flex items-center gap-1">
            <Input
              name="newUserName"
              id="newUserName"
              type="text"
              placeholder="Type Email Id"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="newUserName" className="text-left">
            Phone Number
          </Label>
          <div className="flex items-center gap-1">
            <Input
              name="newUserName"
              id="newUserName"
              type="text"
              placeholder="Type Phone Number"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="newUserName" className="text-left">
            Company Name
          </Label>
          <div className="flex items-center gap-1">
            <Input
              name="newUserName"
              id="newUserName"
              type="text"
              placeholder="Type Company Name"
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 col-span-2 gap-2">
          <Label htmlFor="newUserName" className="text-left">
            Subject
          </Label>
          <div className="flex items-center gap-1">
            <Textarea
              name="newUserName"
              id="newUserName"
              type="text"
              placeholder="Type Subject"
              className="w-full"
            />
          </div>
        </div>

        <div className='w-full flex justify-center col-span-2'>
          <Button variant="default">
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EnquiryForm
