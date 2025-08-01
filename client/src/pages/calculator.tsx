import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Calculator } from "@/components/calculator";
import { AiCommentBox } from "@/components/ai-comment-box";
import { CharacterDisplay } from "@/components/character-display";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AiComment {
  id: string;
  response: string;
  timestamp: Date;
  mood?: string;
  activity?: string;
}

interface CalculationResponse {
  calculation: {
    id: string;
    expression: string;
    result: string;
    timestamp: string;
  };
  aiResponse: {
    id: string;
    response: string;
    emotion: string;
    mood: string;
    activity: string;
    gif: string;
    environment: {
      name: string;
      time: string;
      background: string;
    };
  };
}

export default function CalculatorPage() {
  const [comments, setComments] = useState<AiComment[]>([]);
  const [currentMood, setCurrentMood] = useState("Waiting");
  const [currentActivity, setCurrentActivity] = useState("Standing by");
  const [currentGif, setCurrentGif] = useState("🤖");
  const [currentEnvironment, setCurrentEnvironment] = useState({
    name: "Office",
    time: "Working Hours", 
    background: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  });
  const [speechBubbleText, setSpeechBubbleText] = useState("");
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const { toast } = useToast();

  // Get calculation history
  const { data: calculationHistory } = useQuery({
    queryKey: ['/api/calculations'],
  });

  // Calculate mutation
  const calculateMutation = useMutation({
    mutationFn: async ({ expression, result }: { expression: string; result: string }) => {
      const response = await apiRequest('POST', '/api/calculate', { expression, result });
      return response.json() as Promise<CalculationResponse>;
    },
    onSuccess: (data) => {
      const newComment: AiComment = {
        id: data.aiResponse.id,
        response: data.aiResponse.response,
        timestamp: new Date(),
        mood: data.aiResponse.mood,
        activity: data.aiResponse.activity,
      };

      setComments(prev => [...prev, newComment]);
      setCurrentMood(data.aiResponse.mood);
      setCurrentActivity(data.aiResponse.activity);
      setCurrentGif(data.aiResponse.gif);
      setCurrentEnvironment(data.aiResponse.environment);
      
      // Show speech bubble temporarily
      setSpeechBubbleText("*calculating sarcasm*");
      setShowSpeechBubble(true);
      setTimeout(() => setShowSpeechBubble(false), 3000);
    },
    onError: (error) => {
      toast({
        title: "Calculation Error",
        description: "Failed to get AI response. The sarcastic AI might be taking a break! 🤖",
        variant: "destructive",
      });
    },
  });

  const handleCalculation = (expression: string, result: string) => {
    // Show immediate feedback
    setSpeechBubbleText("*sigh*");
    setShowSpeechBubble(true);
    
    calculateMutation.mutate({ expression, result });
  };

  const responseCount = comments.length;
  const isBusy = calculateMutation.isPending;
  const isConnected = true; // You could add actual connection status checking

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Calculator Section - Left Half */}
        <div className="flex">
          <Calculator 
            onCalculation={handleCalculation}
            isLoading={calculateMutation.isPending}
          />
        </div>

        {/* Right Side Container - Split into top and bottom */}
        <div className="flex flex-col gap-4">
          
          {/* AI Comment Box - Top Right Quarter */}
          <div className="flex-1">
            <AiCommentBox
              comments={comments}
              isTyping={calculateMutation.isPending}
              currentMood={currentMood}
              currentActivity={currentActivity}
              isConnected={isConnected}
            />
          </div>

          {/* Character Display - Bottom Right Quarter */}
          <div className="flex-1">
            <CharacterDisplay
              currentGif={currentGif}
              currentMood={currentMood}
              isBusy={isBusy}
              environment={currentEnvironment}
              responseCount={responseCount}
              speechBubbleText={speechBubbleText}
              showSpeechBubble={showSpeechBubble}
            />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {calculateMutation.isPending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-700">Generating sarcastic response...</span>
          </div>
        </div>
      )}
    </div>
  );
}
