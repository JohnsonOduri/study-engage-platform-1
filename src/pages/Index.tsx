
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, Laptop, Users, Clock, MessageSquare, ChevronRight, Sparkles, Heart, Star, Rocket } from "lucide-react";

const Index = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animation effect for elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-floating");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    featureRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
      featureRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-indigo-50">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Enhanced Visuals */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-40 left-10 w-20 h-20 rounded-full bg-pink-200 opacity-70 animate-float" style={{ animationDelay: "0.3s" }}></div>
          <div className="absolute top-80 right-20 w-16 h-16 rounded-full bg-yellow-200 opacity-70 animate-float" style={{ animationDelay: "1.2s" }}></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-green-200 opacity-60 animate-float" style={{ animationDelay: "0.8s" }}></div>
          <div className="absolute top-1/4 right-1/3 w-12 h-12 rounded-full bg-purple-200 opacity-60 animate-float" style={{ animationDelay: "1.5s" }}></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center mb-2">
                    <Sparkles className="h-6 w-6 mr-2 text-amber-500 animate-pulse" />
                    <span className="bg-gradient-to-r from-amber-400 to-pink-500 text-transparent bg-clip-text font-bold">
                      The Future of Learning
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-slideDown">
                    Learning Made <span className="text-primary relative">
                      Playful
                      <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 transform origin-left animate-expandWidth"></span>
                    </span> & Fun
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl animate-slideDown" style={{ animationDelay: "0.1s" }}>
                    Connect, collaborate, and excel with our colorful learning management system that makes education an adventure!
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row animate-slideDown" style={{ animationDelay: "0.2s" }}>
                  <Button asChild size="lg" className="gap-1 group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link to="/login">
                      Get Started
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-2 border-indigo-200 hover:border-indigo-300 shadow-md hover:shadow-lg">
                    <Link to="/about">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div 
                  ref={imageRef}
                  className="relative transition-all duration-700 opacity-0"
                >
                  {/* Decorative elements */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-600 rounded-xl blur-xl opacity-50 animate-pulse"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-xl blur-xl opacity-30 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-300 to-pink-400 rounded-xl blur-xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
                  
                  {/* Main image - replaced with cartoon illustration */}
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white bg-white transform rotate-1">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 to-purple-800/30 z-10 mix-blend-overlay"></div>
                    <svg 
                      className="w-full h-[400px] object-cover object-center transform transition-transform hover:scale-105 duration-700"
                      viewBox="0 0 600 500" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background */}
                      <circle cx="300" cy="250" r="240" fill="#FF7E5F" opacity="0.8" />
                      
                      {/* Character body - stylized U shape similar to the reference */}
                      <path 
                        d="M180 100 C 180 320, 300 380, 420 320 L 420 100 L 350 100 L 350 320 C 300 350, 250 350, 230 320 L 230 100 Z" 
                        fill="#2A2A2A" 
                      />
                      
                      {/* Character features */}
                      <circle cx="290" cy="180" r="15" fill="white" opacity="0.7" /> {/* Eye */}
                      <circle cx="370" cy="180" r="15" fill="white" opacity="0.7" /> {/* Eye */}
                      <path d="M270 220 Q 330 250 390 220" stroke="white" strokeWidth="5" fill="transparent" opacity="0.7" /> {/* Smile */}
                      
                      {/* Book element */}
                      <rect x="170" y="330" width="60" height="80" rx="5" fill="#6366F1" />
                      <rect x="230" y="330" width="60" height="80" rx="5" fill="#8B5CF6" />
                      <path d="M175 345 H 225" stroke="white" strokeWidth="2" />
                      <path d="M175 355 H 215" stroke="white" strokeWidth="2" />
                      <path d="M175 365 H 220" stroke="white" strokeWidth="2" />
                      
                      {/* Decorative elements */}
                      <circle cx="450" cy="150" r="25" fill="#F472B6" opacity="0.9" />
                      <circle cx="150" cy="200" r="20" fill="#34D399" opacity="0.9" />
                      <circle cx="400" cy="350" r="15" fill="#FBBF24" opacity="0.9" />
                      
                      {/* Floating objects */}
                      <circle cx="200" cy="100" r="10" fill="#A78BFA" opacity="0.8">
                        <animate attributeName="cy" values="100;90;100" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="400" cy="120" r="8" fill="#F472B6" opacity="0.8">
                        <animate attributeName="cy" values="120;110;120" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="150" cy="300" r="12" fill="#34D399" opacity="0.8">
                        <animate attributeName="cy" values="300;290;300" dur="4s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                    
                    {/* Overlay elements */}
                    <div className="absolute top-4 right-4 h-14 w-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center z-20 animate-float border-2 border-pink-200">
                      <BookOpen className="h-7 w-7 text-pink-500" />
                    </div>
                    <div className="absolute bottom-4 left-4 h-14 w-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center z-20 animate-float border-2 border-indigo-200" style={{ animationDelay: "0.3s" }}>
                      <Laptop className="h-7 w-7 text-indigo-500" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center z-20 border-4 border-purple-300 animate-pulse shadow-xl">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <Star className="h-10 w-10 text-white animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                <span className="text-sm font-medium">Magical Features</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Everything You Need for Education
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers comprehensive tools for both students and teachers to enhance the learning experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div 
                ref={el => featureRefs.current[0] = el}
                className="opacity-0 flex flex-col items-center space-y-4 rounded-2xl border-2 border-indigo-100 p-6 shadow-subtle transition-all hover:shadow-elevated hover:border-indigo-200 hover:-translate-y-1 duration-300 bg-white"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                  <BookOpen className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold">Course Management</h3>
                <p className="text-center text-muted-foreground">
                  Access and manage course materials, assignments, and schedules.
                </p>
              </div>
              <div 
                ref={el => featureRefs.current[1] = el}
                className="opacity-0 flex flex-col items-center space-y-4 rounded-2xl border-2 border-indigo-100 p-6 shadow-subtle transition-all hover:shadow-elevated hover:border-indigo-200 hover:-translate-y-1 duration-300 bg-white"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold">Attendance Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Easily track and manage attendance records with detailed analytics.
                </p>
              </div>
              <div 
                ref={el => featureRefs.current[2] = el}
                className="opacity-0 flex flex-col items-center space-y-4 rounded-2xl border-2 border-indigo-100 p-6 shadow-subtle transition-all hover:shadow-elevated hover:border-indigo-200 hover:-translate-y-1 duration-300 bg-white"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                  <Laptop className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold">Online Learning</h3>
                <p className="text-center text-muted-foreground">
                  Access study materials, quizzes, and assignments from anywhere.
                </p>
              </div>
              <div 
                ref={el => featureRefs.current[3] = el}
                className="opacity-0 flex flex-col items-center space-y-4 rounded-2xl border-2 border-indigo-100 p-6 shadow-subtle transition-all hover:shadow-elevated hover:border-indigo-200 hover:-translate-y-1 duration-300 bg-white"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                  <MessageSquare className="h-8 w-8 text-teal-500" />
                </div>
                <h3 className="text-xl font-bold">Communication</h3>
                <p className="text-center text-muted-foreground">
                  Connect with teachers and peers through messaging and forums.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDI1QzUwIDUwIDUwIDc1IDEwMCA1MFYwSDBWMjVaIiBmaWxsPSIjZWVmMmZmIi8+PC9zdmc+')] bg-repeat-x"></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-600 mb-4 w-fit">
                  <Heart className="h-4 w-4 mr-2 animate-pulse" />
                  <span className="text-sm font-medium">Join Our Community</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Join Our Educational <span className="text-primary">Adventure</span>
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    EduConnect helps students and teachers collaborate effectively. Sign up now and transform your educational experience.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="gap-1 group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link to="/login">
                      Sign Up Now
                      <Rocket className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border-2 border-indigo-100">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                      <Users className="h-7 w-7 text-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">For Students & Teachers</h3>
                      <p className="text-muted-foreground">
                        Specialized features for both students and educators.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">
                      <Laptop className="h-7 w-7 text-pink-500" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Accessible Anywhere</h3>
                      <p className="text-muted-foreground">
                        Access your courses and materials from any device.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                      <BookOpen className="h-7 w-7 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Comprehensive Resources</h3>
                      <p className="text-muted-foreground">
                        Access a wide range of educational materials and tools.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
