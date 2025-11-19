"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, ShoppingCart, Home, Package } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function OrderSuccessPage() {
  // In a real app, you might want to fetch the order details here
  // using a query parameter or from a global state
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
          Order Confirmed!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">What's next?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Order Processing</h3>
                <p className="mt-1 text-sm text-gray-500">
                  We're preparing your order for shipment. You'll receive a confirmation email with order details and tracking information.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Order Details</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You can view your order details and track its status in your account.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/orders" className="flex items-center justify-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              View Orders
            </Link>
          </Button>
          
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/" className="flex items-center justify-center">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Need help with your order?</h3>
          <p className="mt-2 text-sm text-gray-500">
            Contact our customer service team at{' '}
            <a href="mailto:support@bookstore.com" className="font-medium text-primary hover:text-primary/90">
              support@bookstore.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
