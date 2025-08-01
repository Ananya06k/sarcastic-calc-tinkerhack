import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bot, Wifi } from "lucide-react";
import { useEffect, useRef } from "react";

interface AiComment {
  id: string;
  response: string;
  timestamp: Date;
  mood?: string;
  activity?: string;
}

interface AiCommentBoxProps {
  comments: AiComment[];
  isTyping: boolean;
  currentMood?: string;
  currentActivity?: string;
  isConnected: boolean;
}

export function AiCommentBox({ 
  comments, 
  isTyping, 
  currentMood = "Waiting", 
  currentActivity = "Standing by",
  isConnected = true 
}: AiCommentBoxProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments, isTyping]);

  return (
    <Card className="bg-white rounded-2xl shadow-xl h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Bot className="text-blue-600" />
            AI Comments
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-slate-500">
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Comment Display Area */}
        <div 
          ref={scrollRef}
          className="flex-1 bg-slate-50 rounded-xl p-4 overflow-y-auto max-h-48 space-y-3"
        >
          {comments.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">AI is ready to judge your math...</p>
              </div>
            </div>
          ) : (
            <>
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg p-3 shadow-sm animate-fade-in">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="text-blue-600 text-sm h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-700 text-sm">{comment.response}</p>
                      <span className="text-xs text-slate-400">
                        {comment.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="animate-slide-up">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                      <Bot className="text-xs h-3 w-3" />
                    </div>
                    <span>AI is thinking</span>
                    <span className="animate-typing">...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* AI Status Bar */}
        <div className="p-3 bg-slate-100 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              Mood: <span className="font-medium text-slate-800">{currentMood}</span>
            </span>
            <span className="text-slate-600">
              Activity: <span className="font-medium text-slate-800">{currentActivity}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
