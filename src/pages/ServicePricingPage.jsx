import React from 'react'

import { BellRing, Check, CircleCheck } from "lucide-react"

import { Button } from "@/components/ui/button"

import {

  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'


const ServicePricingPage = () => {
  return (
    <div className='mx-auto w-full'>

      <div className='w-full flex justify-center mt-4'>
        <h1 className='text-5xl text-center font-medium text-white-400 w-full'>
          Simple and Affordable <br /> Pricing Plans
        </h1>
      </div>
      <div className='w-full h-full flex flex-col  justify-center lg:flex-row gap-3 mt-4'>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="mb-3 text-sm text-gray-400 " >Free</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="mb-4 text-4xl font-semibold">$0,00<span className='text-sm  text-gray-400'>/month</span></div>
            <div className=" text-gray-400 text-sm">Greate For Trying Out Finament And For Tiny Teams</div>
            <div>
              <Button
                variant="secondary"
                className="w-full text-xs font-normal">
                Start For Free
              </Button>
            </div>
            <div class="text-sm text-center  pt-2 text-gray-400">
              Features
            </div>
            <div class="text-sm text-start  pt-2 text-gray-400">
              <div className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Account Aggregation</div>
              <div className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Expense Tracking</div>
              <div className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Budgeting Tools</div>
              <div className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Transaction Insights</div>
              <div className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Basic Security</div>
            </div>
          </CardContent>

        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex mb-3 text-sm text-gray-400 justify-between">
              <div  >Professional</div>
              <Badge variant="default">Most Popular</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="mb-4 text-4xl font-semibold">₹0,00<span className='text-sm  text-gray-400'>/month</span></div>
            <div className=" text-gray-400 text-sm">Greate For Trying Out Finament And For Tiny Teams</div>
            <div>
              <Button
                className="w-full bg-gradient-to-tr from-violet-600 via-violet-600 to-indigo-600">
                Start For Free
              </Button>
            </div>
            <div class="text-sm text-center  pt-2 text-gray-400">
              Features
            </div>
            <div className='text-sm font-normal text-muted-foreground'>
              <p className='flex items-center gap-1'>
                <CircleCheck
                  size={18}
                  className="text-violet-500"
                />
                Transaction Insights
              </p>
            </div>
          </CardContent>

        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="mb-3 text-sm text-gray-400 " >Free</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="mb-4 text-4xl font-semibold">$0,00<span className='text-sm  text-gray-400'>/month</span></div>
            <div className=" text-gray-400 text-sm">Greate For Trying Out Finament And For Tiny Teams</div>
            <div>
              <Button
                variant="secondary"
                className="w-full text-xs font-normal">
                Start For Free
              </Button>
            </div>
            <div class="text-sm text-center  pt-2 text-gray-400">
              Features
            </div>
            <div class="text-sm text-start  pt-2 text-gray-400">
              <div className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Account Aggregation</div>
              <div className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Expense Tracking</div>
              <div className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Budgeting Tools</div>
              <div className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Transaction Insights</div>
              <div className="flex items-center gap-2 mb-1"><Check size={16} className='rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 ' />Basic Security</div>
            </div>
          </CardContent>

        </Card>
      </div>
    </div>
  )
}

export default ServicePricingPage
