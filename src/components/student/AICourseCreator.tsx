import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, PlusCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { CourseViewer } from "./CourseViewer";
import { AIGeneratedCourse } from "./types/ai-course-types";
import { database } from "@/firebase";
import { ref, set } from "firebase/database";

// Define form schema
const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  syllabus: z.string().min(10, "Syllabus must be at least 10 characters"),
  durationDays: z.coerce
    .number()
    .min(1, "Duration must be at least 1 day")
    .max(30, "Duration cannot exceed 30 days"),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export const AICourseCreator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedCourse, setGeneratedCourse] =
    useState<AIGeneratedCourse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("create");
  const { toast } = useToast();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      syllabus: "",
      durationDays: 7,
    },
  });

  const onSubmit = async (values: CourseFormValues) => {
    setLoading(true);
    try {
      toast({
        title: "Generating course...",
        description:
          "This may take a few minutes depending on the course complexity.",
      });

      // Call Supabase Edge Function for AI course generation
      const response = await fetch(
        "https://educonnect-66985.supabase.co/functions/v1/generate-course",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            syllabus: values.syllabus,
            durationDays: values.durationDays,
            title: values.title,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate course");
      }

      const course = await response.json();
      console.log("Generated course:", course);

      // Generate a unique ID for the course if it doesn't have one
      if (!course.id) {
        course.id = crypto.randomUUID();
      }
      
      // Save to Firebase Realtime Database under ai-courses collection
      const courseRef = ref(database, `ai-courses/${course.id}`);
      await set(courseRef, course);

      setGeneratedCourse(course);
      setActiveTab("view");

      toast({
        title: "Course generated successfully!",
        description: "Your AI-generated course is ready to explore.",
      });
    } catch (error: any) {
      console.error("Failed to generate course:", error);
      toast({
        title: "Course generation failed",
        description:
          error.message || "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="create">Create New Course</TabsTrigger>
          <TabsTrigger value="view" disabled={!generatedCourse}>
            View Generated Course
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Course Creator</CardTitle>
              <CardDescription>
                Enter a course syllabus and duration to generate a personalized
                learning path with modules, topics, practice questions, and
                curated resources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="E.g., Introduction to Machine Learning"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a descriptive title for your course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="syllabus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Syllabus</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the key topics and concepts you want to cover in this course..."
                            className="min-h-40"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide as much detail as possible about what you want
                          to learn
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="durationDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Duration (days)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={30} {...field} />
                        </FormControl>
                        <FormDescription>
                          How many days do you want to spread this course over?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Course...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Generate Course
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view" className="space-y-4">
          {generatedCourse && <CourseViewer course={generatedCourse} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};
