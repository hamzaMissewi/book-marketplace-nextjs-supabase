"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/hooks/use-cart"
import { CreditCard, Loader2, MapPin, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "Please enter a valid city"),
  state: z.string().min(2, "Please enter a valid state"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  country: z.string().min(2, "Please select a country"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  paymentMethod: z.enum(["credit-card", "paypal", "crypto"], {
    required_error: "Please select a payment method",
  }),
  saveInfo: z.boolean().default(false),
  cardNumber: z.string().refine(
    (val) => /^\d{16}$/.test(val.replace(/\s+/g, "")),
    "Please enter a valid 16-digit card number"
  ).optional(),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, "Please enter a valid expiry date (MM/YY)").optional(),
  cardCvc: z.string().regex(/^\d{3,4}$/, "Please enter a valid CVC").optional(),
  cardName: z.string().min(2, "Please enter the name on card").optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "credit-card",
    },
  })

  const paymentMethod = watch("paymentMethod")

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsLoading(true)
    
    try {
      // In a real app, you would send this data to your API endpoint
      // and handle the payment processing there
      console.log("Processing payment with data:", data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Clear cart after successful payment
      clearCart()
      
      // Redirect to success page
      router.push("/order/success")
      
    } catch (error) {
      console.error("Payment failed:", error)
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">There are no items in your cart to checkout.</p>
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Information */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Contact Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  {...register("phone")}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  {...register("address")}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  {...register("city")}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  {...register("state")}
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && (
                  <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  {...register("zipCode")}
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-500 mt-1">{errors.zipCode.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  {...register("country")}
                  className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.country ? "border-red-500" : ""}`}
                >
                  <option value="">Select a country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                </select>
                {errors.country && (
                  <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
            
            <RadioGroup 
              defaultValue="credit-card" 
              className="space-y-4"
              onValueChange={() => {}}
              {...register("paymentMethod")}
            >
              <div className={`flex items-center space-x-3 rounded-lg border p-4 ${paymentMethod === 'credit-card' ? 'border-primary bg-primary/5' : ''}`}>
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span>Credit / Debit Card</span>
                    <div className="flex space-x-2">
                      <Image src="/visa.svg" alt="Visa" width={40} height={25} className="h-6 w-auto" />
                      <Image src="/mastercard.svg" alt="Mastercard" width={30} height={20} className="h-6 w-auto" />
                    </div>
                  </div>
                </Label>
              </div>
              
              {paymentMethod === 'credit-card' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-border">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      {...register("cardNumber")}
                      className={errors.cardNumber ? "border-red-500" : ""}
                    />
                    {errors.cardNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.cardNumber.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/YY"
                        {...register("cardExpiry")}
                        className={errors.cardExpiry ? "border-red-500" : ""}
                      />
                      {errors.cardExpiry && (
                        <p className="text-sm text-red-500 mt-1">{errors.cardExpiry.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        placeholder="123"
                        {...register("cardCvc")}
                        className={errors.cardCvc ? "border-red-500" : ""}
                      />
                      {errors.cardCvc && (
                        <p className="text-sm text-red-500 mt-1">{errors.cardCvc.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      {...register("cardName")}
                      className={errors.cardName ? "border-red-500" : ""}
                    />
                    {errors.cardName && (
                      <p className="text-sm text-red-500 mt-1">{errors.cardName.message}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className={`flex items-center space-x-3 rounded-lg border p-4 ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : ''}`}>
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span>PayPal</span>
                    <Image src="/paypal.svg" alt="PayPal" width={60} height={20} className="h-6 w-auto" />
                  </div>
                </Label>
              </div>
              
              <div className={`flex items-center space-x-3 rounded-lg border p-4 ${paymentMethod === 'crypto' ? 'border-primary bg-primary/5' : ''}`}>
                <RadioGroupItem value="crypto" id="crypto" />
                <Label htmlFor="crypto" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span>Cryptocurrency</span>
                    <div className="flex space-x-2">
                      <Image src="/bitcoin.svg" alt="Bitcoin" width={20} height={20} className="h-6 w-auto" />
                      <Image src="/ethereum.svg" alt="Ethereum" width={20} height={20} className="h-6 w-auto" />
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Save for next time */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="saveInfo"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register("saveInfo")}
            />
            <Label htmlFor="saveInfo" className="text-sm font-medium leading-none">
              Save this information for next time
            </Label>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Order
                    </>
                  )}
                </Button>
                
                <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
                  Secure Checkout
                </div>
                
                <p className="mt-4 text-xs text-muted-foreground text-center">
                  By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Need help?</h3>
            <p className="text-sm text-muted-foreground">
              Contact our customer support at support@bookstore.com or call (123) 456-7890
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
