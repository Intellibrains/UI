import { useState } from "react";
import { ClipboardList, Sparkles, CheckCircle2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIDisclaimer } from "@/components/chat/AIDisclaimer";
import { ConversationsList } from "@/components/panels/ConversationsList";
import { FriendsChatPanel } from "@/components/panels/FriendsChatPanel";
import { ExamFilterPanel } from "@/components/panels/ExamFilterPanel";
import { UploadContentPanel } from "@/components/upload/UploadContentPanel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

interface UploadedItem {
  id: string;
  name: string;
  size: string;
  type: "document" | "video" | "youtube";
}

interface Question {
  id: string;
  type: "mcq" | "short";
  question: string;
  options?: string[];
  correctAnswer?: string;
}

const sampleQuestions: Question[] = [
  {
    id: "1",
    type: "mcq",
    question: "What is the primary function of a neural network's activation function?",
    options: [
      "To store weights",
      "To introduce non-linearity into the network",
      "To reduce the number of parameters",
      "To normalize input data",
    ],
    correctAnswer: "To introduce non-linearity into the network",
  },
  {
    id: "2",
    type: "mcq",
    question: "Which of the following is NOT a common type of neural network layer?",
    options: [
      "Convolutional layer",
      "Pooling layer",
      "Recursive layer",
      "Quantum layer",
    ],
    correctAnswer: "Quantum layer",
  },
  {
    id: "3",
    type: "short",
    question: "Explain the concept of backpropagation and its role in training neural networks.",
  },
  {
    id: "4",
    type: "mcq",
    question: "What does the term 'epoch' refer to in machine learning?",
    options: [
      "A single forward pass through the network",
      "One complete pass through the entire training dataset",
      "The learning rate adjustment",
      "The final accuracy score",
    ],
    correctAnswer: "One complete pass through the entire training dataset",
  },
  {
    id: "5",
    type: "short",
    question: "Describe two techniques used to prevent overfitting in neural networks.",
  },
];

export default function Tests() {
  const [files, setFiles] = useState<UploadedItem[]>([]);
  const [testGenerated, setTestGenerated] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleGenerateTest = () => {
    setTestGenerated(true);
    setSubmitted(false);
    setAnswers({});
  };

  const handleSubmitTest = () => {
    setSubmitted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const getScore = () => {
    let correct = 0;
    sampleQuestions.forEach((q) => {
      if (q.type === "mcq" && answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-72 border-r bg-card flex flex-col">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-4 h-4 text-accent" />
            <h2 className="font-semibold text-sm text-foreground">Test Generator</h2>
          </div>
          <p className="text-xs text-muted-foreground">Upload content to generate tests</p>
        </div>

        <div className="p-3 border-b">
          <ExamFilterPanel />
        </div>

        <div className="flex-1 min-h-0">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60} minSize={25}>
              <div className="p-3 h-full overflow-auto">
                <UploadContentPanel files={files} onFilesChange={setFiles} />

                {files.length > 0 && (
                  <div className="p-3 rounded-lg border bg-muted/50 mt-3">
                    <h4 className="text-xs font-medium mb-2">Test Settings</h4>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded w-3 h-3" />
                        Multiple Choice
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded w-3 h-3" />
                        Short Answer
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded w-3 h-3" />
                        True/False
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={15}>
              <div className="p-3 h-full overflow-auto">
                <ConversationsList contextType="test" />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <div className="p-3 border-t">
          <Button
            onClick={handleGenerateTest}
            className="w-full h-9 text-sm bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={files.length === 0}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Test
          </Button>
        </div>
      </div>

      {/* Main Panel - Test */}
      <div className="flex-1 flex flex-col bg-background mr-10">
        <div className="p-4 border-b bg-card">
          <h1 className="page-title">Tests & Assessments</h1>
          <p className="page-description">AI-generated quizzes to test your understanding</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto">
            {!testGenerated ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <HelpCircle className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No Test Generated Yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Upload documents or videos in the left panel, then click "Generate Test"
                  to create an AI-powered assessment based on your content.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {submitted && (
                  <Card className="border-accent bg-accent/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-accent" />
                          <div>
                            <p className="font-semibold">Test Submitted!</p>
                            <p className="text-sm text-muted-foreground">
                              You scored {getScore()} out of {sampleQuestions.filter(q => q.type === "mcq").length} on multiple choice questions
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => { setSubmitted(false); setAnswers({}); }}
                        >
                          Retake Test
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {sampleQuestions.map((question, index) => (
                  <Card key={question.id} className="shadow-soft">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {question.type === "mcq" ? (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-info/10 text-info">Multiple Choice</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning">Short Answer</span>
                            )}
                          </div>
                          <CardTitle className="text-base font-medium">{question.question}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {question.type === "mcq" && question.options ? (
                        <RadioGroup
                          value={answers[question.id] || ""}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                          disabled={submitted}
                        >
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => {
                              const isCorrect = submitted && option === question.correctAnswer;
                              const isWrong = submitted && answers[question.id] === option && option !== question.correctAnswer;
                              return (
                                <label
                                  key={optIndex}
                                  className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                    !submitted && "hover:bg-muted",
                                    isCorrect && "bg-success/10 border-success",
                                    isWrong && "bg-destructive/10 border-destructive",
                                    !isCorrect && !isWrong && answers[question.id] === option && "bg-accent/10 border-accent"
                                  )}
                                >
                                  <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                                  <span className="text-sm">{option}</span>
                                  {isCorrect && <CheckCircle2 className="w-4 h-4 text-success ml-auto" />}
                                </label>
                              );
                            })}
                          </div>
                        </RadioGroup>
                      ) : (
                        <Textarea
                          placeholder="Type your answer here..."
                          value={answers[question.id] || ""}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          disabled={submitted}
                          className="min-h-[100px]"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}

                {!submitted && (
                  <div className="flex justify-center pt-4 pb-8">
                    <Button onClick={handleSubmitTest} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                      Submit Test
                    </Button>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6">
              <AIDisclaimer />
            </div>
          </div>
        </ScrollArea>
      </div>

      <FriendsChatPanel />
    </div>
  );
}
