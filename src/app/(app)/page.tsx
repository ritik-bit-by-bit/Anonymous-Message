'use client';

import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
       <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover opacity-90 z-0"
      >
        <source src="/bgvid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 z-10 relative">
        <section className="text-center mb-12 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
            Discover Anonymous Feedback
          </h1>
          <p className="text-lg sm:text-xl text-indigo-200 leading-relaxed">
            True Feedback - Share your thoughts with complete privacy
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-md sm:max-w-lg lg:max-w-2xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-white/95 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-indigo-900">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-start space-x-4">
                    <Mail className="flex-shrink-0 text-indigo-600 w-6 h-6 mt-1" />
                    <div>
                      <p className="text-gray-700 leading-relaxed">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center py-7 bg-gradient-to-tl from-blue-950 to-violet-800 text-indigo-200 mt-auto z-10 relative">
        <p className="text-sm">© 2025 True Feedback. All rights reserved.</p>
      </footer>
    </div>
  );
}
