import { useState } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const exams = ["IIT", "Board", "NEET"];

const subjects = ["Overall", "Physics", "Chemistry", "Maths"];

const topicsBySubject: Record<string, string[]> = {
  Physics: [
    "Overall",
    "Kinematics",
    "Newton Laws",
    "Work, Energy & Power",
    "Thermodynamics",
    "Electrostatics",
  ],
  Chemistry: [
    "Overall",
    "Atomic Structure",
    "Chemical Bonding",
    "Thermodynamics",
    "Organic Chemistry Basics",
    "Equilibrium",
  ],
  Maths: [
    "Overall",
    "Algebra",
    "Calculus",
    "Trigonometry",
    "Coordinate Geometry",
    "Probability",
  ],
};

interface ExamFilterPanelProps {
  className?: string;
}

export function ExamFilterPanel({ className }: ExamFilterPanelProps) {
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const showTopics = selectedSubject && selectedSubject !== "Overall";
  const topics = showTopics ? topicsBySubject[selectedSubject] || [] : [];

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedTopic("");
  };

  const handleExamChange = (value: string) => {
    setSelectedExam(value);
    setSelectedSubject("");
    setSelectedTopic("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-1">
        <Filter className="w-4 h-4 text-accent" />
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
          Filters
        </h3>
      </div>

      {/* Select Exam */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Select Exam</Label>
        <Select value={selectedExam} onValueChange={handleExamChange}>
          <SelectTrigger className="h-9 rounded-lg border-border bg-background text-sm transition-colors focus:border-accent">
            <SelectValue placeholder="Choose exam" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {exams.map((exam) => (
              <SelectItem key={exam} value={exam} className="text-sm rounded-md">
                {exam}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Select Subject */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Select Subject</Label>
        <Select value={selectedSubject} onValueChange={handleSubjectChange}>
          <SelectTrigger className="h-9 rounded-lg border-border bg-background text-sm transition-colors focus:border-accent">
            <SelectValue placeholder="Choose subject" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject} className="text-sm rounded-md">
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Select Topic - animated entrance */}
      <div
        className={cn(
          "space-y-1.5 transition-all duration-300 ease-out overflow-hidden",
          showTopics
            ? "max-h-40 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <Label className="text-xs text-muted-foreground">Select Topic</Label>
        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="h-9 rounded-lg border-border bg-background text-sm transition-colors focus:border-accent">
            <SelectValue placeholder="Choose topic" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic} className="text-sm rounded-md">
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
