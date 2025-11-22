'use client';

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { HelpCircle, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function QAPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [qaEnabled, setQaEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session) {
      fetchQASettings();
    }
  }, [session]);

  const fetchQASettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/settings/get');
      if (response.data.success && response.data.data) {
        setQaEnabled(response.data.data.qaModeEnabled || false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch Q&A settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (enabled: boolean) => {
    setSaving(true);
    try {
      const response = await axios.post<ApiResponse>('/api/qa/enable', { enabled });
      if (response.data.success) {
        setQaEnabled(enabled);
        toast({
          title: 'Success',
          description: `Q&A mode ${enabled ? 'enabled' : 'disabled'}`,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to update Q&A mode',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return <div></div>;
  }

  return (
    <div className="w-full p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Q&A Mode
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2 text-xl font-semibold">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Q&A Mode Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-gray-900 text-lg font-medium">Enable Q&A Mode</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      When enabled, messages will be treated as questions that you can answer publicly
                    </p>
                  </div>
                  <Switch
                    checked={qaEnabled}
                    onCheckedChange={handleToggle}
                    disabled={saving}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 text-xl font-semibold">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 text-gray-700">
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-2 text-base">1. Enable Q&A Mode</h3>
                    <p className="text-sm text-gray-600">Toggle the switch above to enable Q&A mode for your profile.</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-gray-900 font-semibold mb-2 text-base">2. Receive Questions</h3>
                    <p className="text-sm text-gray-600">People can send you questions anonymously through your link.</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-gray-900 font-semibold mb-2 text-base">3. Answer Questions</h3>
                    <p className="text-sm text-gray-600">View questions in your dashboard and provide public answers.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}


