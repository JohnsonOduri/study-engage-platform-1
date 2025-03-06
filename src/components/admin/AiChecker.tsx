
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Bot, AlertTriangle, FileText, Upload, RotateCw, CheckCircle, Copy } from "lucide-react";
import { toast } from "sonner";

export const AiChecker = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | {
    aiProbability: number;
    plagiarismScore: number;
    analysis: string[];
  }>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    setIsChecking(true);

    try {
      // Simulating API call to AI detection service
      // In a real implementation, this would be an API call to a service like GPTZero, Originality.ai, etc.
      setTimeout(() => {
        // Mock response
        const aiScore = Math.random() * 100;
        const plagScore = Math.random() * 100;
        
        setResult({
          aiProbability: aiScore,
          plagiarismScore: plagScore,
          analysis: [
            aiScore > 70 ? 
              "This text shows strong indicators of AI generation." : 
              "This text appears to be primarily human-written.",
            plagScore > 30 ?
              "Multiple sections appear to be copied from existing sources." :
              "No significant matching content was found in our database.",
            "Sentence structures exhibit " + (aiScore > 70 ? "high" : "low") + " uniformity.",
            "Vocabulary diversity is " + (aiScore > 70 ? "limited" : "natural") + ".",
            "Transitional phrases are " + (aiScore > 70 ? "repetitive" : "varied") + "."
          ]
        });
        
        setIsChecking(false);
      }, 2000);
    } catch (error) {
      console.error("Error checking content:", error);
      toast.error("Failed to analyze the content. Please try again.");
      setIsChecking(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    
    const resultText = `
AI Generation Probability: ${result.aiProbability.toFixed(1)}%
Plagiarism Score: ${result.plagiarismScore.toFixed(1)}%

Analysis Results:
${result.analysis.map(item => `- ${item}`).join('\n')}

Text Analyzed:
${text}
    `.trim();
    
    navigator.clipboard.writeText(resultText)
      .then(() => toast.success("Report copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  const getProbabilityColor = (score: number) => {
    if (score < 30) return "text-green-500";
    if (score < 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score < 30) return "bg-green-500";
    if (score < 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Content Checker</h2>
        <p className="text-muted-foreground mt-1">
          Detect AI-generated content and check for plagiarism in student submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content to Analyze
            </CardTitle>
            <CardDescription>
              Paste text from a student submission to check for AI generation and plagiarism.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste text here..."
              className="min-h-[300px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setText("")}>
              Clear
            </Button>
            <Button onClick={handleCheck} disabled={isChecking || !text.trim()}>
              {isChecking ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Check Content
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              View the AI detection and plagiarism check results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isChecking ? (
              <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                <RotateCw className="h-8 w-8 animate-spin text-primary" />
                <p>Analyzing content...</p>
              </div>
            ) : result ? (
              <div className="space-y-6 min-h-[300px]">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>AI Generation Probability</span>
                      <span className={getProbabilityColor(result.aiProbability)}>
                        {result.aiProbability.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={result.aiProbability} className={getProgressColor(result.aiProbability)} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Plagiarism Score</span>
                      <span className={getProbabilityColor(result.plagiarismScore)}>
                        {result.plagiarismScore.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={result.plagiarismScore} className={getProgressColor(result.plagiarismScore)} />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Analysis</h4>
                  <ul className="space-y-2">
                    {result.analysis.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground min-h-[300px]">
                <Upload className="h-8 w-8" />
                <p>Submit content for analysis to see results</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={copyToClipboard}
              disabled={!result}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
