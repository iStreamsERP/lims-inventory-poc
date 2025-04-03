import React from 'react'

import { BellRing, Check } from "lucide-react"

import { Button } from "@/components/ui/button"

import {

  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const ServicePricingPage = () => {
  return (
    <div className='mx-auto w-full'>

      <div className='w-full flex justify-center mt-4'>
        <div className='text-3xl text-center font-medium text-white-400 family-poppins w-full lg:w-1/3 text-center'>
          Simple And Affordable Pricing Plans
        </div>
      </div>
      <div className='w-full flex flex-col  justify-center lg:flex-row gap-3 mt-4'>

        <Card className="w-full">
          <CardHeader>
            <CardDescription className="mb-3" >Free</CardDescription>
            <CardTitle className="mb-4 text-4xl">$0,00<span className='text-sm text-gray-400'>/month</span></CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <CardDescription className=" text-gray-400">Greate For Trying Out Finament And For Tiny Teams</CardDescription>
            <CardDescription>
              <Button
                variant="secondary"
                className="w-full text-xs font-normal">
                Start For Free
              </Button>
            </CardDescription>
            <CardDescription class="text-sm text-center  pt-2 text-gray-400">
              Features
            </CardDescription>
            <CardDescription class="text-sm text-start  pt-2 text-gray-400">
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Account Aggregation</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Expense Tracking</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Budgeting Tools</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Transaction Insights</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Basic Security</CardDescription>
            </CardDescription>
          </CardContent>

        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardDescription className="flex mb-3 justify-between">
              <CardDescription  >Professional</CardDescription>
              <CardDescription className=" rounded-3xl text-xs" >Most Popular</CardDescription>
            </CardDescription>
            <CardTitle className="mb-4 text-4xl">$0,00<span className='text-sm text-gray-400'>/month</span></CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <CardDescription className=" text-gray-400">Greate For Trying Out Finament And For Tiny Teams</CardDescription>
            <CardDescription>
              <Button
                variant="secondary"
                className="w-full text-xs font-normal">
                Start For Free
              </Button>
            </CardDescription>
            <CardDescription class="text-sm text-center  pt-2 text-gray-400">
              Features
            </CardDescription>
            <CardDescription class="text-sm text-start  pt-2 text-gray-400">
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Account Aggregation</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Expense Tracking</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Budgeting Tools</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Transaction Insights</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Basic Security</CardDescription>
            </CardDescription>
          </CardContent>

        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardDescription className="mb-3" >Free</CardDescription>
            <CardTitle className="mb-4 text-4xl">$0,00<span className='text-sm text-gray-400'>/month</span></CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <CardDescription className=" text-gray-400">Greate For Trying Out Finament And For Tiny Teams</CardDescription>
            <CardDescription>
              <Button
                variant="secondary"
                className="w-full text-xs font-normal">
                Start For Free
              </Button>
            </CardDescription>
            <CardDescription class="text-sm text-center  pt-2 text-gray-400">
              Features
            </CardDescription>
            <CardDescription class="text-sm text-start  pt-2 text-gray-400">
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Account Aggregation</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Expense Tracking</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Budgeting Tools</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Transaction Insights</CardDescription>
              <CardDescription className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Basic Security</CardDescription>
            </CardDescription>
          </CardContent>

        </Card>



      </div>

    </div>
  )
}

export default ServicePricingPage
