import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

const EnquiryForm = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Enquiry Form</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="userName" className="text-left">Name</Label>
          <Input
            name="userName"
            id="userName"
            type="text"
            placeholder="Enter your name"
            className="w-full"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-left">Email ID</Label>
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone" className="text-left">Phone Number</Label>
          <Input
            name="phone"
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            className="w-full"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company" className="text-left">Company Name</Label>
          <Input
            name="company"
            id="company"
            type="text"
            placeholder="Enter company name"
            className="w-full"
          />
        </div>

        <div className="grid gap-2 col-span-1 md:col-span-2">
          <Label htmlFor="subject" className="text-left">Subject</Label>
          <Textarea
            name="subject"
            id="subject"
            placeholder="Enter subject"
            className="w-full min-h-[100px]"
          />
        </div>

        <div className="w-full flex justify-center col-span-1 md:col-span-2">
          <Button type="submit" variant="default">
            Submit
          </Button>
        </div>
      </form>

    </div>
  )
}

export default EnquiryForm
