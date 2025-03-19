
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, Laptop, Users, MessageSquare, ChevronRight, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <main className="flex-1">
        {/* Simplified Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute top-40 left-10 w-16 h-16 rounded-full bg-pink-200 opacity-50 animate-float"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 rounded-full bg-indigo-200 opacity-50 animate-float" style={{ animationDelay: "1.5s" }}></div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 mb-2 w-fit">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Learning Reimagined</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Learning Made <span className="text-primary">Simple</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-[600px]">
                  Connect, collaborate, and excel with our learning management system that makes education a joy.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link to="/login">
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/courses">
                      Explore Courses
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white transform rotate-1 transition-all duration-500 hover:rotate-0">
                  <div className="aspect-video w-full max-w-[500px]">
                    <svg 
                      className="w-full h-full" 
                      viewBox="0 0 600 400" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background */}
                      <rect width="600" height="400" fill="#f8fafc" />
                      <circle cx="300" cy="200" r="180" fill="#7c3aed" opacity="0.1" />
                      
                      {/* Abstract shapes */}
                      <circle cx="420" cy="120" r="60" fill="#8b5cf6" opacity="0.2" />
                      <circle cx="180" cy="300" r="80" fill="#c4b5fd" opacity="0.3" />
                      
                      {/* Character */}
                      <g transform="translate(240, 150)">
                        {/* Head */}
                        <circle cx="60" cy="60" r="50" fill="#7c3aed" />
                        <circle cx="40" cy="50" r="8" fill="white" /> {/* Eye */}
                        <circle cx="80" cy="50" r="8" fill="white" /> {/* Eye */}
                        <path d="M40 80 Q 60 95 80 80" stroke="white" strokeWidth="3" fill="transparent" /> {/* Smile */}
                        
                        {/* Book */}
                        <rect x="10" y="120" width="100" height="80" rx="5" fill="#c4b5fd" />
                        <rect x="20" y="130" width="80" height="60" rx="3" fill="white" opacity="0.6" />
                        <line x1="30" y1="145" x2="90" y2="145" stroke="#7c3aed" strokeWidth="2" />
                        <line x1="30" y1="155" x2="70" y2="155" stroke="#7c3aed" strokeWidth="2" />
                        <line x1="30" y1="165" x2="80" y2="165" stroke="#7c3aed" strokeWidth="2" />
                      </g>
                      
                      {/* Floating elements */}
                      <circle cx="150" cy="100" r="10" fill="#c4b5fd">
                        <animate attributeName="cy" values="100;90;100" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="450" cy="300" r="12" fill="#8b5cf6">
                        <animate attributeName="cy" values="300;290;300" dur="4s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Streamlined Features Section */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-[700px] mx-auto">
                Our platform offers comprehensive tools for both students and teachers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
                  title: "Course Management",
                  description: "Easily manage course materials and assignments."
                },
                {
                  icon: <Laptop className="h-8 w-8 text-indigo-600" />,
                  title: "Online Learning",
                  description: "Access study materials from anywhere, anytime."
                },
                {
                  icon: <Users className="h-8 w-8 text-indigo-600" />,
                  title: "Collaboration",
                  description: "Work together with classmates on group projects."
                },
                {
                  icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
                  title: "Communication",
                  description: "Connect with teachers and peers through messaging."
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-6 bg-white rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-3 rounded-full bg-indigo-50 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-center text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple CTA Section */}
        <section className="w-full py-12 md:py-24 bg-indigo-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-[600px]">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to Transform Your Learning Experience?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join EduConnect today and discover a new way to learn and collaborate.
                </p>
              </div>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/auth">
                  Sign Up Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
