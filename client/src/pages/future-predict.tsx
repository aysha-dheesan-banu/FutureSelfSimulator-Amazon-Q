import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";

// Types for prediction data
interface FuturePrediction {
  timeframe: "1_month" | "6_months" | "1_year" | "5_years";
  categories: {
    career: PredictionCategory;
    health: PredictionCategory;
    relationships: PredictionCategory;
    finance: PredictionCategory;
    personalGrowth: PredictionCategory;
  };
  overallTrajectory: "positive" | "neutral" | "negative";
  confidenceScore: number;
  insights: string[];
  recommendations: string[];
}

interface PredictionCategory {
  trajectory: "improving" | "stable" | "declining";
  score: number;
  prediction: string;
  keyFactors: string[];
}

// Mock data for development
const mockPredictions: Record<string, FuturePrediction> = {
  "1_month": {
    timeframe: "1_month",
    categories: {
      career: {
        trajectory: "improving",
        score: 70,
        prediction: "Short-term career growth looks promising based on your recent activities.",
        keyFactors: ["Daily skill practice", "Networking efforts", "Project completion"]
      },
      health: {
        trajectory: "improving",
        score: 75,
        prediction: "Your consistent exercise habits are showing positive short-term results.",
        keyFactors: ["Regular exercise", "Sleep improvement", "Stress reduction"]
      },
      relationships: {
        trajectory: "stable",
        score: 65,
        prediction: "Relationship patterns show stability in the short term.",
        keyFactors: ["Communication frequency", "Quality time", "Conflict resolution"]
      },
      finance: {
        trajectory: "stable",
        score: 60,
        prediction: "Financial situation remains stable in the short term.",
        keyFactors: ["Spending habits", "Income stability", "Short-term planning"]
      },
      personalGrowth: {
        trajectory: "improving",
        score: 80,
        prediction: "Your learning habits show excellent short-term growth potential.",
        keyFactors: ["Daily learning", "Skill application", "Feedback integration"]
      }
    },
    overallTrajectory: "positive",
    confidenceScore: 0.9,
    insights: [
      "Your daily habit consistency is excellent for short-term growth",
      "Recent journal entries show increasing positivity",
      "Short-term goals are well-defined and achievable",
      "Health metrics are trending positively"
    ],
    recommendations: [
      "Maintain your current exercise routine for continued improvement",
      "Consider short-term financial planning for upcoming expenses",
      "Schedule more quality time for relationship building",
      "Continue your excellent learning habits"
    ]
  },
  "6_months": {
    timeframe: "6_months",
    categories: {
      career: {
        trajectory: "improving",
        score: 75,
        prediction: "Medium-term career trajectory shows strong growth potential.",
        keyFactors: ["Skill development", "Professional networking", "Project success"]
      },
      health: {
        trajectory: "stable",
        score: 65,
        prediction: "Health habits show moderate consistency over the medium term.",
        keyFactors: ["Exercise consistency", "Sleep patterns", "Nutrition habits"]
      },
      relationships: {
        trajectory: "improving",
        score: 70,
        prediction: "Relationship quality likely to improve over the next 6 months.",
        keyFactors: ["Communication skills", "Empathy development", "Conflict resolution"]
      },
      finance: {
        trajectory: "stable",
        score: 60,
        prediction: "Financial situation shows stability with moderate growth potential.",
        keyFactors: ["Saving rate", "Income growth", "Expense management"]
      },
      personalGrowth: {
        trajectory: "improving",
        score: 85,
        prediction: "Personal growth trajectory is excellent for the medium term.",
        keyFactors: ["Learning habits", "Self-reflection", "Skill application"]
      }
    },
    overallTrajectory: "positive",
    confidenceScore: 0.8,
    insights: [
      "Your habit consistency is creating compound growth",
      "Journal sentiment analysis shows improving emotional wellbeing",
      "Goal completion rates are highest in personal growth categories",
      "Health metrics show room for improvement in consistency"
    ],
    recommendations: [
      "Develop a more consistent health routine for better outcomes",
      "Set specific financial milestones for the next 6 months",
      "Continue your focus on relationship building",
      "Leverage your learning habits to accelerate career growth"
    ]
  },
  "1_year": {
    timeframe: "1_year",
    categories: {
      career: {
        trajectory: "improving",
        score: 75,
        prediction: "Based on your consistent habit tracking and goal completion in career-related areas, you're likely to see significant professional growth in this timeframe.",
        keyFactors: ["Consistent skill development", "Networking activities", "Goal-oriented approach"]
      },
      health: {
        trajectory: "stable",
        score: 65,
        prediction: "Your health habits show moderate consistency. Maintaining current patterns will likely result in stable health outcomes.",
        keyFactors: ["Exercise frequency", "Sleep patterns", "Stress management"]
      },
      relationships: {
        trajectory: "improving",
        score: 80,
        prediction: "Journal entries show increasing positive sentiment around relationships, suggesting continued improvement in this area.",
        keyFactors: ["Communication skills", "Time investment", "Emotional awareness"]
      },
      finance: {
        trajectory: "stable",
        score: 60,
        prediction: "Financial goals show mixed progress. Current trajectory suggests stable financial situation with moderate growth.",
        keyFactors: ["Saving habits", "Income growth", "Spending patterns"]
      },
      personalGrowth: {
        trajectory: "improving",
        score: 85,
        prediction: "Strong commitment to learning and self-improvement activities indicates significant personal growth ahead.",
        keyFactors: ["Learning consistency", "Reflection practices", "Challenge-seeking behavior"]
      }
    },
    overallTrajectory: "positive",
    confidenceScore: 0.75,
    insights: [
      "Your consistent habit tracking in career development is creating compound growth",
      "Journal sentiment analysis shows improving emotional wellbeing",
      "Goal completion rates are highest in personal growth categories",
      "Health metrics show room for improvement in consistency"
    ],
    recommendations: [
      "Increase consistency in health-related habits for better outcomes",
      "Consider setting more specific financial milestones",
      "Continue your strong focus on relationship building",
      "Leverage your learning habits to accelerate career growth"
    ]
  },
  "5_years": {
    timeframe: "5_years",
    categories: {
      career: {
        trajectory: "improving",
        score: 80,
        prediction: "Long-term career trajectory shows excellent potential for advancement and growth.",
        keyFactors: ["Skill mastery", "Leadership development", "Strategic networking"]
      },
      health: {
        trajectory: "improving",
        score: 70,
        prediction: "Health habits compound over time, showing positive long-term outcomes.",
        keyFactors: ["Lifestyle consistency", "Preventative care", "Stress management"]
      },
      relationships: {
        trajectory: "improving",
        score: 85,
        prediction: "Long-term relationship development shows strong positive trajectory.",
        keyFactors: ["Deep connection building", "Conflict resolution mastery", "Emotional intelligence"]
      },
      finance: {
        trajectory: "improving",
        score: 75,
        prediction: "Financial growth potential is significant over the 5-year timeframe.",
        keyFactors: ["Compound investing", "Career advancement", "Financial planning"]
      },
      personalGrowth: {
        trajectory: "improving",
        score: 90,
        prediction: "Exceptional long-term personal growth trajectory based on current patterns.",
        keyFactors: ["Continuous learning", "Self-mastery", "Wisdom development"]
      }
    },
    overallTrajectory: "positive",
    confidenceScore: 0.6,
    insights: [
      "Your consistent habits will compound significantly over 5 years",
      "Long-term financial planning shows potential for wealth accumulation",
      "Personal growth trajectory indicates potential for significant life transformation",
      "Relationship development patterns suggest deep and meaningful connections",
      "Career trajectory suggests leadership potential"
    ],
    recommendations: [
      "Develop a comprehensive long-term health strategy",
      "Consider advanced financial planning for wealth building",
      "Invest in deep skill development for career advancement",
      "Build systems for relationship nurturing over time",
      "Create a long-term personal development roadmap"
    ]
  }
};

export default function FuturePredictPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<"1_month" | "6_months" | "1_year" | "5_years">("1_year");
  const [prediction, setPrediction] = useState<FuturePrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // In a real app, this would call the API
      // const response = await apiRequest("GET", `/api/predictions/${user.id}/${timeframe}`);
      // const data = await response.json();
      
      // For development, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const data = mockPredictions[timeframe];
      
      setPrediction(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate future prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [timeframe, user?.id]);

  const getTrajectoryIcon = (trajectory: string) => {
    switch (trajectory) {
      case "improving":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "declining":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">FuturePredict</h1>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Predict Your Future Trajectory</h2>
                <p className="text-gray-600">
                  Based on your goals, habits, and journal entries, we can predict your future trajectory
                  across different life dimensions.
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Timeframe
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={timeframe === "1_month" ? "default" : "outline"}
                    onClick={() => setTimeframe("1_month")}
                  >
                    1 Month
                  </Button>
                  <Button 
                    variant={timeframe === "6_months" ? "default" : "outline"}
                    onClick={() => setTimeframe("6_months")}
                  >
                    6 Months
                  </Button>
                  <Button 
                    variant={timeframe === "1_year" ? "default" : "outline"}
                    onClick={() => setTimeframe("1_year")}
                  >
                    1 Year
                  </Button>
                  <Button 
                    variant={timeframe === "5_years" ? "default" : "outline"}
                    onClick={() => setTimeframe("5_years")}
                  >
                    5 Years
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : prediction ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Overall Trajectory</h3>
                    <div className={`p-4 rounded-md ${
                      prediction.overallTrajectory === "positive" ? "bg-green-50" :
                      prediction.overallTrajectory === "negative" ? "bg-red-50" : "bg-yellow-50"
                    }`}>
                      <div className="flex items-center">
                        {prediction.overallTrajectory === "positive" && <TrendingUp className="h-6 w-6 text-green-500 mr-2" />}
                        {prediction.overallTrajectory === "negative" && <TrendingDown className="h-6 w-6 text-red-500 mr-2" />}
                        {prediction.overallTrajectory === "neutral" && <Minus className="h-6 w-6 text-yellow-500 mr-2" />}
                        <span className="font-medium capitalize">{prediction.overallTrajectory}</span>
                        <span className="ml-auto text-sm text-gray-500">
                          Confidence: {Math.round(prediction.confidenceScore * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Life Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(prediction.categories).map(([key, category]) => (
                        <div key={key} className="border rounded-md p-4">
                          <div className="flex items-center mb-2">
                            <h4 className="font-medium capitalize">{key}</h4>
                            <div className="ml-2">
                              {getTrajectoryIcon(category.trajectory)}
                            </div>
                            <div className="ml-auto">
                              <div className="h-2 w-24 bg-gray-200 rounded-full">
                                <div 
                                  className={`h-2 rounded-full ${
                                    category.score >= 70 ? "bg-green-500" :
                                    category.score >= 40 ? "bg-yellow-500" : "bg-red-500"
                                  }`}
                                  style={{ width: `${category.score}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{category.prediction}</p>
                          <div>
                            <h5 className="text-xs font-medium text-gray-500 mb-1">Key Factors</h5>
                            <ul className="text-xs text-gray-600">
                              {category.keyFactors.map((factor, i) => (
                                <li key={i} className="mb-1">• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Key Insights</h3>
                      <ul className="space-y-2">
                        {prediction.insights.map((insight, i) => (
                          <li key={i} className="flex">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                      <ul className="space-y-2">
                        {prediction.recommendations.map((rec, i) => (
                          <li key={i} className="flex">
                            <span className="text-green-500 mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Select a timeframe to see your future prediction</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}