import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calculator as CalculatorIcon, History } from "lucide-react";
import { useCalculator } from "@/hooks/use-calculator";

interface CalculatorProps {
  onCalculation: (expression: string, result: string) => void;
  isLoading?: boolean;
}

export function Calculator({ onCalculation, isLoading }: CalculatorProps) {
  const { state, inputNumber, inputDecimal, clear, clearEntry, backspace, performOperation, performCalculation, getExpression } = useCalculator();

  const handleEquals = () => {
    const expression = getExpression();
    performCalculation();
    // Wait for state update, then trigger calculation
    setTimeout(() => {
      onCalculation(expression, state.display);
    }, 0);
  };

  const buttons = [
    [
      { label: 'AC', onClick: clear, className: 'bg-slate-200 hover:bg-slate-300 text-slate-700' },
      { label: 'CE', onClick: clearEntry, className: 'bg-slate-200 hover:bg-slate-300 text-slate-700' },
      { label: '⌫', onClick: backspace, className: 'bg-slate-200 hover:bg-slate-300 text-slate-700' },
      { label: '÷', onClick: () => performOperation('÷'), className: 'bg-blue-600 hover:bg-blue-700 text-white' },
    ],
    [
      { label: '7', onClick: () => inputNumber('7'), className: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
      { label: '8', onClick: () => inputNumber('8'), className: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
      { label: '9', onClick: () => inputNumber('9'), className: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
      { label: '×', onClick: () => performOperation('×'), className: 'bg-blue-600 hover:bg-blue-700 text-white' },
    ],
    [
      { label: '4', onClick: () => inputNumber('4'), className: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
      { label: '5', onClick: () => inputNumber('5'), className: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
      { label: '6', onClick: () => inputNumber('6'), className: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
      { label: '−', onClick: () => performOperation('-'), className: 'bg-blue-600 hover:bg-blue-700 text-white' },
    ],
    [
      { label: '1', onClick: () => inputNumber('1'), className: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
      { label: '2', onClick: () => inputNumber('2'), className: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
      { label: '3', onClick: () => inputNumber('3'), className: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
      { label: '+', onClick: () => performOperation('+'), className: 'bg-blue-600 hover:bg-blue-700 text-white row-span-2', span: 2 },
    ],
    [
      { label: '0', onClick: () => inputNumber('0'), className: 'bg-slate-100 hover:bg-slate-200 text-slate-800 col-span-2', span: 2 },
      { label: '.', onClick: inputDecimal, className: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
      { label: '=', onClick: handleEquals, className: 'bg-amber-500 hover:bg-amber-600 text-white' },
    ],
  ];

  const previousOperation = state.previousValue && state.operation ? `${state.previousValue} ${state.operation}` : '';

  return (
    <Card className="bg-white rounded-2xl shadow-xl h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalculatorIcon className="text-blue-600" />
            Sarcastic Calculator
          </h1>
          <Button variant="ghost" size="sm" className="p-2">
            <History className="h-4 w-4 text-slate-600" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-6">
        {/* Display */}
        <div className="bg-slate-900 rounded-xl p-6">
          <div className="text-right">
            <div className="text-slate-400 text-sm font-mono mb-1 min-h-5">
              {previousOperation}
            </div>
            <div className="text-white text-4xl font-mono break-all">
              {state.display}
            </div>
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3 flex-1">
          {buttons.flat().map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              disabled={isLoading}
              className={`h-14 rounded-xl font-semibold text-lg transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md ${button.className} ${
                button.span === 2 ? 'col-span-2' : ''
              }`}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
