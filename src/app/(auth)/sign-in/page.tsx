'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/Schemas/signIn';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        callbackUrl: `${window.location.origin}/dashboard`,
        identifier: data.identifier,
        password: data.password,
      });
      console.log({"result":result,"result url":result?.url});

      if (result?.error) {
        toast({
          title: 'Sign In Failed',
          description:
            result.error === 'CredentialsSignin'
              ? 'Invalid credentials. Please try again.'
              : result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Signed in successfully',
        });
      }

      if(result?.url){
        const url = new URL(result.url, window.location.origin);
        if (url.origin === window.location.origin) {
          router.replace(result.url);
        } else {
          window.location.href = result.url;
        }
      }
    } catch (error) {
      toast({
        title: 'Sign In Failed',
        description: 'There was a problem with your login. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 relative " style={{ backgroundImage: 'url(/bgimg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Background Video */}
     

      {/* Main content */}
      <div className="w-full  max-w-md p-8 space-y-8 bg-white bg-opacity-80 rounded-lg shadow-xl backdrop-blur-lg z-10 relative">
        <div className="text-center ">
          <h1 className="text-4xl  font-extrabold tracking-tight lg:text-5xl mb-6 text-indigo-800">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4 text-indigo-600">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-800">Email/Username</FormLabel>
                  <Input {...field} className="border-indigo-400" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-800">Password</FormLabel>
                  <Input type="password" {...field} className="border-indigo-400" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
