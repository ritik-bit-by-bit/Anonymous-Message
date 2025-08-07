'use client'

import { MessageCard } from '@/components/ui/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/user';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { exceptMessage } from '@/Schemas/acceptMessageSchema';

const Page =()=> {
const [messages, setMessages] = useState<Message[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isSwitchLoading, setIsSwitchLoading] = useState(false);
 
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(exceptMessage),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
        
      const response= await axios.get<ApiResponse>('/api/AcceptMessage');
      console.log(response.data);
      console.log(response.data.isAcceptingMessages);
      setValue('acceptMessages', true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/getMessages');
        console.log(response.data);
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);  
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/AcceptMessage', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-6xl">
  <h1 className="text-4xl font-semibold text-gray-800 mb-6">User Dashboard</h1>

  {/* Copy URL Section */}
  <div className="mb-6">
    <h2 className="text-lg font-semibold text-gray-700 mb-2">Copy Your Unique Link</h2>
    <div className="flex items-center">
      <input
        type="text"
        value={profileUrl}
        disabled
        className="input input-bordered w-full p-3 text-gray-800 bg-gray-200 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
      />
      <Button
        onClick={copyToClipboard}
        className="ml-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Copy
      </Button>
    </div>
  </div>

  {/* Accept Messages Switch */}
  <div className="mb-6 flex items-center">
    <Switch
      {...register('acceptMessages')}
      checked={acceptMessages}
      onCheckedChange={handleSwitchChange}
      disabled={isSwitchLoading}
      className="text-blue-500 focus:ring-2 focus:ring-blue-500 shadow-lg shadow-gray-400"
    />
    <span className="ml-3 text-lg font-medium text-gray-700">
      Accept Messages: <span className={`font-semibold ${acceptMessages ? 'text-green-600' : 'text-red-600'}`}>{acceptMessages ? 'On' : 'Off'}</span>
    </span>
  </div>

  {/* Separator */}
  <Separator className="mb-6" />

  {/* Refresh Button */}
  <Button
    className="mt-4 bg-gray-700 text-white hover:bg-gray-800 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
    variant="outline"
    onClick={(e) => {
      e.preventDefault();
      fetchMessages(true);
    }}
  >
    {isLoading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <RefreshCcw className="h-4 w-4" />
    )}
  </Button>

  {/* Messages Section */}
  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    {messages.length > 0 ? (
      messages.map((message) => (
        <MessageCard
          key={message._id}
          message={message}
          onMessageDelete={handleDeleteMessage}
        />
      ))
    ) : (
      <p className="text-center text-gray-600">No messages to display.</p>
    )}
  </div>
</div>

  );
}

export default Page;