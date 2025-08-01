import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Eye } from "lucide-react";
import { useState } from "react";

interface Environment {
  name: string;
  time: string;
  background: string;
}

interface CharacterDisplayProps {
  currentGif: string;
  currentMood: string;
  isBusy: boolean;
  environment: Environment;
  responseCount: number;
  speechBubbleText?: string;
  showSpeechBubble?: boolean;
}

export function CharacterDisplay({
  currentGif,
  currentMood,
  isBusy,
  environment,
  responseCount,
  speechBubbleText,
  showSpeechBubble = false
}: CharacterDisplayProps) {
  const [environmentIndex, setEnvironmentIndex] = useState(0);
  
  const environments: Environment[] = [
    { name: "Office", time: "Working Hours", background: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" },
    { name: "Bedroom", time: "Rest Time", background: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" },
    { name: "Garden", time: "Fresh Air Break", background: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" },
    { name: "Living Room", time: "Leisure Time", background: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" },
    { name: "Laboratory", time: "Research Mode", background: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" }
  ];

  const changeEnvironment = () => {
    setEnvironmentIndex((prev) => (prev + 1) % environments.length);
  };

  const currentEnvironment = environment || environments[environmentIndex];

  return (
    <Card className="bg-white rounded-2xl shadow-xl h-full flex flex-col">
      <CardHeader className="pb-2 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Play className="text-blue-600 h-4 w-4" />
            AI Character
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={changeEnvironment}
              className="p-1 hover:bg-slate-100 rounded text-xs"
            >
              <RotateCcw className="h-3 w-3 text-slate-400" />
            </Button>
            <span className="text-xs text-slate-500">{currentEnvironment.name}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        {/* GIF Display Area */}
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl relative overflow-hidden min-h-32 environment-transition">
          {/* Environment Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 transition-all duration-500"
            style={{ backgroundImage: `url('${currentEnvironment.background}')` }}
          />

          {/* Character GIF Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="character-container w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center relative overflow-hidden transition-transform duration-300 hover:scale-105">
              {/* Character Display - Using emoji as placeholder for AI-generated GIFs */}
              <div className="text-4xl animate-bounce-subtle">
                {currentGif}
              </div>
              
              {/* Character State Indicator */}
              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                isBusy ? 'bg-red-500' : 'bg-green-500'
              }`}>
                <Eye className="text-white text-xs h-2 w-2" />
              </div>
            </div>
          </div>

          {/* Environment Info */}
          <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1">
            <div className="text-xs font-medium text-slate-700">{currentEnvironment.name}</div>
            <div className="text-xs text-slate-500">{currentEnvironment.time}</div>
          </div>

          {/* Character Speech Bubble */}
          {showSpeechBubble && speechBubbleText && (
            <div className="absolute top-2 right-2 bg-white rounded-lg p-2 shadow-lg max-w-24 animate-fade-in">
              <div className="text-xs text-slate-700">{speechBubbleText}</div>
              <div className="absolute bottom-[-4px] left-2 w-2 h-2 bg-white transform rotate-45"></div>
            </div>
          )}
        </div>

        {/* Character Controls */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-1">
            <span className={`px-1 py-1 rounded text-xs ${
              currentMood === 'Annoyed' ? 'bg-red-100 text-red-700' :
              currentMood === 'Sarcastic' ? 'bg-purple-100 text-purple-700' :
              currentMood === 'Bored' ? 'bg-gray-100 text-gray-700' :
              currentMood === 'Excited' ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {currentMood}
            </span>
            <span className={`px-1 py-1 rounded text-xs ${
              isBusy ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {isBusy ? 'Busy' : 'Available'}
            </span>
          </div>
          <div className="text-slate-500">
            <span className="font-medium">{responseCount}</span> responses
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
