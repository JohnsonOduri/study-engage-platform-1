
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileQuestion, Brain, Send, RefreshCw, Plus, Save, Upload, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { database } from "@/firebase";
import { ref, push } from "firebase/database";
import { toast } from "sonner";

interface QuizGeneratorProps {
  isTeacher?: boolean;
}

export const QuizGenerator = ({ isTeacher = false }: QuizGeneratorProps) => {
  const { user } = useAuth();
  const [quizTopic, setQuizTopic] = useState("");
  const [complexity, setComplexity] = useState("medium");
  const [questionCount, setQuestionCount] = useState("5");
  const [quizType, setQuizType] = useState("multiple-choice");
  const [courseId, setCourseId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<null | {
    title: string;
    questions: {
      question: string;
      options?: string[];
      answer: string;
    }[];
  }>(null);
  const [showSavedSuccess, setShowSavedSuccess] = useState(false);

  const handleGenerateQuiz = () => {
    if (!quizTopic.trim()) {
      toast.error("Please enter a quiz topic");
      return;
    }

    setIsLoading(true);
    // Simulate AI quiz generation
    setTimeout(() => {
      const questions = [];
      const questionTypes = quizType === "mixed" 
        ? ["multiple-choice", "true-false", "short-answer"]
        : [quizType];
      
      const numQuestions = parseInt(questionCount);
      
      for (let i = 0; i < numQuestions; i++) {
        const currentType = questionTypes[i % questionTypes.length];
        
        if (currentType === "multiple-choice") {
          questions.push({
            question: `Question ${i + 1}: What is an important concept in ${quizTopic}?`,
            options: [
              `Option A about ${quizTopic}`,
              `Option B about ${quizTopic}`,
              `Option C about ${quizTopic}`,
              `Option D about ${quizTopic}`
            ],
            answer: "Option A"
          });
        } else if (currentType === "true-false") {
          questions.push({
            question: `Question ${i + 1}: True or False - ${quizTopic} is an important field of study.`,
            options: ["True", "False"],
            answer: "True"
          });
        } else {
          questions.push({
            question: `Question ${i + 1}: Explain a key concept related to ${quizTopic}.`,
            answer: "The answer would be provided by the student and evaluated by the teacher."
          });
        }
      }
      
      setGeneratedQuiz({
        title: quizTitle || `Quiz on ${quizTopic}`,
        questions
      });
      
      setIsLoading(false);
    }, 1500);
  };

  const handleSaveQuiz = async () => {
    if (!generatedQuiz) return;
    
    try {
      setIsLoading(true);
      
      const quizData = {
        title: generatedQuiz.title,
        topic: quizTopic,
        complexity,
        type: quizType,
        course_id: courseId || null,
        questions: generatedQuiz.questions,
        created_by: user?.id,
        created_at: new Date().toISOString(),
        is_published: isTeacher, // Students create drafts, teachers publish directly
        is_ai_generated: true
      };
      
      // Save to Firebase
      const quizzesRef = ref(database, 'quizzes');
      await push(quizzesRef, quizData);
      
      toast.success(isTeacher ? "Quiz published successfully" : "Quiz saved successfully");
      setShowSavedSuccess(true);
      
      // Reset after a few seconds if teacher (for creating multiple quizzes)
      if (isTeacher) {
        setTimeout(() => {
          setShowSavedSuccess(false);
          if (confirm("Create another quiz?")) {
            setGeneratedQuiz(null);
            setQuizTopic("");
            setQuizTitle("");
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignQuiz = async () => {
    if (!generatedQuiz || !courseId) {
      toast.error("Please select a course before assigning");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // First save the quiz
      const quizData = {
        title: generatedQuiz.title,
        topic: quizTopic,
        complexity,
        type: quizType,
        course_id: courseId,
        questions: generatedQuiz.questions,
        created_by: user?.id,
        created_at: new Date().toISOString(),
        is_published: true,
        is_ai_generated: true
      };
      
      // Save to Firebase
      const quizzesRef = ref(database, 'quizzes');
      const newQuizRef = await push(quizzesRef, quizData);
      
      // Create an assignment linking to this quiz
      const assignmentData = {
        title: `Quiz: ${generatedQuiz.title}`,
        description: `Complete this ${complexity} difficulty quiz on ${quizTopic}`,
        course_id: courseId,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
        points: complexity === "easy" ? 50 : complexity === "medium" ? 75 : 100,
        created_at: new Date().toISOString(),
        created_by: user?.id,
        is_ai_generated: true,
        quiz_id: newQuizRef.key
      };
      
      const assignmentsRef = ref(database, 'assignments');
      await push(assignmentsRef, assignmentData);
      
      toast.success("Quiz assigned to students successfully");
      setShowSavedSuccess(true);
      
      // Reset after a few seconds
      setTimeout(() => {
        setShowSavedSuccess(false);
        if (confirm("Create another quiz?")) {
          setGeneratedQuiz(null);
          setQuizTopic("");
          setQuizTitle("");
        }
      }, 3000);
    } catch (error) {
      console.error("Error assigning quiz:", error);
      toast.error("Failed to assign quiz");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Quiz Generator</h2>
        <p className="text-muted-foreground mt-1">
          {isTeacher 
            ? "Create and assign AI-generated quizzes to your students" 
            : "Create custom quizzes to test your knowledge"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!generatedQuiz ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Generate New Quiz
              </CardTitle>
              <CardDescription>
                Provide a topic and our AI will create a custom quiz for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="quizTitle">Quiz Title</Label>
                <Input
                  id="quizTitle"
                  placeholder="Enter a title for your quiz"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="quizTopic">Quiz Topic</Label>
                <Textarea
                  id="quizTopic"
                  placeholder="Enter the quiz topic (e.g., 'Data Structures in Computer Science')"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="complexity">Difficulty</Label>
                  <Select value={complexity} onValueChange={setComplexity}>
                    <SelectTrigger id="complexity">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="questionCount">Questions</Label>
                  <Select value={questionCount} onValueChange={setQuestionCount}>
                    <SelectTrigger id="questionCount">
                      <SelectValue placeholder="Number of questions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Questions</SelectItem>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="quizType">Question Type</Label>
                  <Select value={quizType} onValueChange={setQuizType}>
                    <SelectTrigger id="quizType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isTeacher && (
                <div className="grid gap-2">
                  <Label htmlFor="courseSelect">Assign to Course (Optional)</Label>
                  <Select value={courseId} onValueChange={setCourseId}>
                    <SelectTrigger id="courseSelect">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="course1">Web Development 101</SelectItem>
                      <SelectItem value="course2">Advanced JavaScript</SelectItem>
                      <SelectItem value="course3">Data Structures</SelectItem>
                      <SelectItem value="course4">Machine Learning Basics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerateQuiz} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileQuestion className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5" />
                {generatedQuiz.title}
              </CardTitle>
              <CardDescription>
                {quizType === "mixed" ? "Mixed question types" : `${quizType} quiz`} • {questionCount} questions • {complexity} difficulty
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {generatedQuiz.questions.map((q, idx) => (
                  <div key={idx} className="border rounded-md p-4">
                    <p className="font-medium">{q.question}</p>
                    {q.options && (
                      <div className="mt-2 space-y-1">
                        {q.options.map((option, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input 
                              type={quizType === "true-false" ? "radio" : "checkbox"} 
                              id={`q${idx}-opt${optIdx}`} 
                              name={`question-${idx}`} 
                              className="h-4 w-4"
                              disabled
                            />
                            <label htmlFor={`q${idx}-opt${optIdx}`} className="text-sm">{option}</label>
                          </div>
                        ))}
                      </div>
                    )}
                    {!q.options && (
                      <textarea 
                        className="mt-2 w-full border rounded-md p-2 text-sm" 
                        rows={2} 
                        placeholder="Type your answer here..." 
                        disabled
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              {showSavedSuccess ? (
                <div className="flex items-center justify-center w-full p-2 bg-green-50 text-green-700 rounded-md">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Quiz {isTeacher ? "published" : "saved"} successfully!
                </div>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setGeneratedQuiz(null)} className="sm:flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate New Quiz
                  </Button>
                  {isTeacher ? (
                    <>
                      <Button onClick={handleSaveQuiz} className="sm:flex-1" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Quiz
                      </Button>
                      <Button onClick={handleAssignQuiz} className="sm:flex-1" variant="default" disabled={isLoading || !courseId}>
                        <Upload className="h-4 w-4 mr-2" />
                        Assign to Students
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleSaveQuiz} className="sm:flex-1" disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Quiz
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Quiz Library</CardTitle>
            <CardDescription>
              {isTeacher ? "Browse and manage your saved quizzes" : "Access your saved quizzes"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recent">
              <TabsList className="mb-4">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="published">{isTeacher ? "Published" : "Completed"}</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="mt-0">
                <div className="flex flex-col gap-2">
                  <EmptyState 
                    title="No quizzes yet" 
                    description={`Generate your first quiz ${isTeacher ? "to assign to students" : "to practice"}`}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="published" className="mt-0">
                <div className="flex flex-col gap-2">
                  <EmptyState 
                    title={isTeacher ? "No published quizzes" : "No completed quizzes"} 
                    description={isTeacher ? "Publish quizzes to make them available to students" : "Complete quizzes to see your results here"}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="drafts" className="mt-0">
                <div className="flex flex-col gap-2">
                  <EmptyState 
                    title="No draft quizzes" 
                    description="Save quizzes as drafts to edit them later"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EmptyState = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mt-1">{description}</p>
    </div>
  );
};
