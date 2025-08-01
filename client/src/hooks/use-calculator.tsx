import { useState, useCallback } from 'react';

export interface CalculatorState {
  display: string;
  previousValue: string | null;
  operation: string | null;
  waitingForOperand: boolean;
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForOperand: false,
  });

  const calculate = useCallback((firstOperand: number, secondOperand: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '×':
        return firstOperand * secondOperand;
      case '÷':
        return secondOperand !== 0 ? firstOperand / secondOperand : NaN;
      default:
        return secondOperand;
    }
  }, []);

  const inputNumber = useCallback((num: string) => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: num,
          waitingForOperand: false,
        };
      }
      
      return {
        ...prev,
        display: prev.display === '0' ? num : prev.display + num,
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: '0.',
          waitingForOperand: false,
        };
      }
      
      if (prev.display.indexOf('.') === -1) {
        return {
          ...prev,
          display: prev.display + '.',
        };
      }
      
      return prev;
    });
  }, []);

  const clear = useCallback(() => {
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForOperand: false,
    });
  }, []);

  const clearEntry = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: '0',
    }));
  }, []);

  const backspace = useCallback(() => {
    setState(prev => {
      if (prev.display.length > 1) {
        return {
          ...prev,
          display: prev.display.slice(0, -1),
        };
      }
      
      return {
        ...prev,
        display: '0',
      };
    });
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    setState(prev => {
      const inputValue = parseFloat(prev.display);

      if (prev.previousValue === null) {
        return {
          ...prev,
          previousValue: prev.display,
          operation: nextOperation,
          waitingForOperand: true,
        };
      }

      if (prev.operation) {
        const currentValue = prev.previousValue || '0';
        const result = calculate(parseFloat(currentValue), inputValue, prev.operation);

        return {
          ...prev,
          display: String(result),
          previousValue: String(result),
          operation: nextOperation,
          waitingForOperand: true,
        };
      }

      return prev;
    });
  }, [calculate]);

  const performCalculation = useCallback(() => {
    setState(prev => {
      const inputValue = parseFloat(prev.display);

      if (prev.previousValue !== null && prev.operation) {
        const currentValue = parseFloat(prev.previousValue);
        const result = calculate(currentValue, inputValue, prev.operation);

        return {
          display: String(result),
          previousValue: null,
          operation: null,
          waitingForOperand: true,
        };
      }

      return prev;
    });
  }, [calculate]);

  const getExpression = useCallback(() => {
    if (state.previousValue && state.operation) {
      return `${state.previousValue} ${state.operation} ${state.display}`;
    }
    return state.display;
  }, [state]);

  return {
    state,
    inputNumber,
    inputDecimal,
    clear,
    clearEntry,
    backspace,
    performOperation,
    performCalculation,
    getExpression,
  };
}
