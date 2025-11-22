'use client'

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/user';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { 
  Loader2, 
  RefreshCcw, 
  Copy, 
  Link2, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Shield, 
  HelpCircle, 
  Vote, 
  Link as LinkIcon,
  Zap,
  FileText,
  Users,
  Bell,
  Palette,
  X,
  Sparkles
} from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { exceptMessage } from '@/Schemas/acceptMessageSchema';
import Link from 'next/link';

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string>('');
 
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(exceptMessage),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/AcceptMessage');
      setValue('acceptMessages', true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch message settings',
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
          description: axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);  
      }
    },
    [setIsLoading, setMessages, toast]
  );

  const username = session?.user ? (session.user as User).username : '';

  useEffect(() => {
    if (typeof window !== 'undefined' && username) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${username}`);
    }
  }, [username]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

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
        description: axiosError.response?.data.message ?? 'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: 'URL Copied!',
        description: 'Profile URL has been copied to clipboard.',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  return (
    <div className="w-full p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
          {/* Dashboard Title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 text-sm font-medium">True Feedback</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Messages</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <LinkIcon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Links</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">1</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${acceptMessages ? 'bg-green-100' : 'bg-orange-100'}`}>
                  <Zap className={`w-5 h-5 ${acceptMessages ? 'text-green-600' : 'text-orange-600'}`} />
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Status</h3>
              </div>
              <p className={`text-3xl font-bold ${acceptMessages ? 'text-green-600' : 'text-orange-600'}`}>
                {acceptMessages ? 'Active' : 'Paused'}
              </p>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="flex flex-wrap gap-6">
              {/* Copy URL Section */}
              <div className="flex-1 min-w-[300px] p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Link2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Unique Link
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="flex-1 p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm font-mono"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </div>

              {/* Message Settings Section */}
              <div className="flex-1 min-w-[300px] p-6 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Switch
                  {...register('acceptMessages')}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Accept Messages
                  </h3>
                  <p className={`text-sm font-medium ${acceptMessages ? 'text-green-600' : 'text-gray-600'}`}>
                    {acceptMessages ? 'Messages are being received' : 'Messages are paused'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Section */}
          <div id="messages" className="mb-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Messages
              </h2>
              <div className="flex gap-2 flex-wrap">
                <Button
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/export/messages?format=csv');
                      if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `messages-${new Date().toISOString().split('T')[0]}.csv`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        toast({
                          title: 'Success',
                          description: 'Messages exported as CSV',
                        });
                      }
                    } catch (error) {
                      toast({
                        title: 'Error',
                        description: 'Failed to export messages',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/export/messages?format=json');
                      if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `messages-${new Date().toISOString().split('T')[0]}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        toast({
                          title: 'Success',
                          description: 'Messages exported as JSON',
                        });
                      }
                    } catch (error) {
                      toast({
                        title: 'Error',
                        description: 'Failed to export messages',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCcw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <p className="text-gray-800 font-medium text-base leading-relaxed flex-1">{message.content}</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          try {
                            const response = await axios.delete<ApiResponse>(
                              `/api/deleteMessage/${message._id}`
                            );
                            toast({
                              title: response.data.message,
                              variant: 'default',
                            });
                            handleDeleteMessage(message._id);
                          } catch (error) {
                            const axiosError = error as AxiosError<ApiResponse>;
                            toast({
                              title: 'Error',
                              description: axiosError.response?.data.message ?? 'Failed to delete message',
                              variant: 'destructive',
                            });
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-2 h-auto w-auto flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-12 bg-white rounded-lg border border-gray-200 shadow-sm text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 text-lg font-medium mb-2">
                    No messages to display.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Share your link to start receiving anonymous messages!
                  </p>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}

export default Page;
