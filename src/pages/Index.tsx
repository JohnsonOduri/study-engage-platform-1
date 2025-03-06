
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, Laptop, Users, Clock, MessageSquare, ChevronRight } from "lucide-react";

const Index = () => {
  const imageRef = useRef<HTMLDivElement>(null);

  // Animation effect for the image
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

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Enhanced Visuals */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 z-0"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b')] bg-cover bg-center opacity-5 z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-slideDown">
                    Learning Made Simple, <span className="text-primary relative">
                      Together
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-primary transform origin-left animate-expandWidth"></span>
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl animate-slideDown" style={{ animationDelay: "0.1s" }}>
                    Connect, collaborate, and excel with our comprehensive learning management system for students and teachers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row animate-slideDown" style={{ animationDelay: "0.2s" }}>
                  <Button asChild size="lg" className="gap-1 group">
                    <Link to="/login">
                      Get Started
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
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
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur-xl opacity-50 animate-pulse"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-xl blur-xl opacity-30 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-400 to-primary rounded-xl blur-xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
                  
                  {/* Main image */}
                  <div className="relative overflow-hidden rounded-xl shadow-2xl border border-white/10 bg-card">
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 to-slate-800/80 z-10 mix-blend-overlay"></div>
                    <img
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                      alt="Professional workspace with computer"
                      className="w-full h-[400px] object-cover object-center transform transition-transform hover:scale-105 duration-700"
                    />
                    
                    {/* Overlay elements */}
                    <div className="absolute top-4 right-4 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center z-20 animate-float">
                      <BookOpen className="h-6 w-6 text-white/90" />
                    </div>
                    <div className="absolute bottom-4 left-4 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center z-20 animate-float" style={{ animationDelay: "0.3s" }}>
                      <Laptop className="h-6 w-6 text-white/90" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center z-20 border border-primary/30 animate-pulse">
                      <div className="h-16 w-16 rounded-full bg-primary/30 flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          LMS
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything You Need for Education
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers comprehensive tools for both students and teachers to enhance the learning experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-border p-6 shadow-subtle transition-all hover:shadow-elevated">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Course Management</h3>
                <p className="text-center text-muted-foreground">
                  Access and manage course materials, assignments, and schedules.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-border p-6 shadow-subtle transition-all hover:shadow-elevated">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Attendance Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Easily track and manage attendance records with detailed analytics.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-border p-6 shadow-subtle transition-all hover:shadow-elevated">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Laptop className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Online Learning</h3>
                <p className="text-center text-muted-foreground">
                  Access study materials, quizzes, and assignments from anywhere.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-border p-6 shadow-subtle transition-all hover:shadow-elevated">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-8 w-8 text-primary" />
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
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                    Get Started Today
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Join Our Educational Community
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    EduConnect helps students and teachers collaborate effectively. Sign up now and transform your educational experience.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link to="/login">Sign Up Now</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">For Students & Teachers</h3>
                      <p className="text-muted-foreground">
                        Specialized features for both students and educators.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Laptop className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Accessible Anywhere</h3>
                      <p className="text-muted-foreground">
                        Access your courses and materials from any device.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
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
