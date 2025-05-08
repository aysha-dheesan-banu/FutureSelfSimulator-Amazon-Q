import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface TraitQuizProps {
  onComplete: (traits: Record<string, any>) => void;
}

export default function TraitQuiz({ onComplete }: TraitQuizProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  // Update user traits mutation
  const updateTraitsMutation = useMutation({
    mutationFn: async (traits: Record<string, any>) => {
      const response = await apiRequest("PATCH", `/api/users/${user?.id}/traits`, { traits });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Your personality traits have been updated.",
        variant: "default",
      });
      // Pass traits back to parent component
      onComplete(data.traits);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update your traits. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Quiz questions
  const questions = [
    {
      id: "openness",
      text: "I am open to trying new experiences and ideas.",
      trait: "Openness to Experience"
    },
    {
      id: "conscientiousness",
      text: "I am organized and detail-oriented.",
      trait: "Conscientiousness"
    },
    {
      id: "extraversion",
      text: "I enjoy being in social situations and meeting new people.",
      trait: "Extraversion"
    },
    {
      id: "agreeableness",
      text: "I am cooperative and considerate of others' feelings.",
      trait: "Agreeableness"
    },
    {
      id: "neuroticism",
      text: "I often worry about things and feel anxious.",
      trait: "Emotional Stability"
    },
    {
      id: "optimism",
      text: "I generally expect positive outcomes in my life.",
      trait: "Optimism"
    },
    {
      id: "resilience",
      text: "I can bounce back quickly from setbacks and challenges.",
      trait: "Resilience"
    },
    {
      id: "growth_mindset",
      text: "I believe my abilities can be developed through hard work.",
      trait: "Growth Mindset"
    },
    {
      id: "self_discipline",
      text: "I can make myself do things even when I don't feel like it.",
      trait: "Self-Discipline"
    },
    {
      id: "learning_style",
      text: "I prefer to learn by doing rather than by reading or listening.",
      trait: "Learning Style"
    }
  ];
  
  // Options for each question
  const options = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" }
  ];
  
  // Calculate progress percentage
  const progress = (currentQuestion / questions.length) * 100;
  
  // Handle answer selection
  const handleAnswer = (value: string) => {
    const questionId = questions[currentQuestion].id;
    setAnswers({
      ...answers,
      [questionId]: parseInt(value)
    });
    
    if (currentQuestion < questions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate trait scores
      const traits = calculateTraits();
      // Update user traits
      updateTraitsMutation.mutate(traits);
    }
  };
  
  // Calculate trait scores from answers
  const calculateTraits = () => {
    const traits: Record<string, any> = {};
    
    // Simple scoring for this example
    for (const questionId in answers) {
      const score = answers[questionId];
      const question = questions.find(q => q.id === questionId);
      if (question) {
        traits[question.trait] = score;
      }
    }
    
    // Add derived traits
    traits["Adaptability"] = 
      (traits["Openness to Experience"] + traits["Resilience"]) / 2;
    
    return traits;
  };
  
  // Current question
  const currentQ = questions[currentQuestion];
  
  // If all questions are answered
  if (Object.keys(answers).length === questions.length && !updateTraitsMutation.isPending) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-green-600 mb-2">
          Quiz Completed!
        </h3>
        <p className="text-gray-600 mb-4">
          Your personality profile has been updated.
        </p>
        <Button onClick={() => setCurrentQuestion(0)}>Retake Quiz</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">{currentQ.text}</h3>
          
          <RadioGroup
            onValueChange={handleAnswer}
            defaultValue={answers[currentQ.id]?.toString()}
            className="space-y-3"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                <Label htmlFor={`option-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === questions.length - 1 || !answers[currentQ.id]}
            >
              Skip
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-sm text-gray-500 text-center">
        This quiz helps us personalize your future self projections based on your personality traits.
      </p>
    </div>
  );
}
