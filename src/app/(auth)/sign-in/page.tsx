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
        callbackUrl: '/dashboard',
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
      } else{
        toast({
          title: 'Success',
          description: 'Signed in successfully',
        });
       
      }
      if(result?.url){
        const url = new URL(result.url, window.location.origin);
      if (url.origin === window.location.origin) {
        router.push('/dashboard');
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
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
  <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-xl border border-border">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
        Welcome Back
      </h1>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">True Feedback</h2>
        <p className="text-muted-foreground">Sign in to continue your secret conversations</p>
      </div>
    </div>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="identifier"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-foreground font-medium">Email/Username</FormLabel>
              <Input 
                {...field} 
                className="bg-muted border-input focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-foreground font-medium">Password</FormLabel>
              <Input 
                type="password" 
                {...field} 
                className="bg-muted border-input focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-semibold transition-colors duration-200" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
    
    <div className="text-center">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>
      <p className="mt-4 text-muted-foreground">
        Not a member yet?{' '}
        <Link 
          href="/sign-up" 
          className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  </div>
</div>

  );
};

export default Page;
