import React, { useState } from "react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState(null);
  const [operator, setOperator] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [waitingForNext, setWaitingForNext] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForNext) {
      setDisplay(String(digit));
      setWaitingForNext(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  };

  const erase = () => {
    setDisplay((prev) => {
      if (prev === "0" || prev === "-0") return "0";
      if (prev.length === 2 && prev.startsWith("-")) return "0";
      if(prev.length === 1) return "0";
      return prev.slice(0, -1);
    });
  };

  const inputDecimal = () => {
    if (waitingForNext) {
      setDisplay("0.");
      setWaitingForNext(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const plusMinus = () => {
    const inputValue = parseFloat(display);
    const result = -inputValue ;
    setDisplay(String(result));
  }

  const clearAll = () => {
    setDisplay("0");
    setOperator(null);
    setPrevValue(null);
    setWaitingForNext(false);
    setHistory(null);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);
    
    if (prevValue == null) {
      setPrevValue(inputValue);
    } else if (operator) {
      let result;
      if (nextOperator == "%") {
          result = percentage(prevValue, inputValue, operator);
      }else {
        result = calculate(prevValue, inputValue, operator);

      }
      setDisplay(String(result));
      setPrevValue(result);
    }
    
    setHistory(nextOperator === "=" ? null : nextOperator == "%" ? null : nextOperator);

    setWaitingForNext(true);
    setOperator(nextOperator);
  };

  const percentage = (a, b, op) => {
     switch (op) {
        case "+": return a + (a*b/100);
        case "-": return a - (a*b/100);
        case "×": return a * b /100
        case "÷": return a / (1/b);
      default: return b;
     }
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? 0 : a / b;
      case "=": return b;
      default: return b;
    }
  };

  const Button = ({ onClick, children, className = "" }) => (
    <button
      onClick={onClick}
      className={`px-4 py-3 border rounded hover:bg-gray-100 ${className}`}
    >
      {children}
    </button>
  );

   const styles = {
    page: {
      position: "fixed",
      inset: 0,                 // fills whole screen
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    box: {
      
      background: "#eee",
      padding:"10px",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10
    },
    history: {
      fontSize:"15px",
      fontWeight:"bold",
      minHeight:"25px",
    }
  
  };
 return (
    <div style={styles.page}>
      <div style={styles.box}>
          
          <div
          style={{
            background: "#111",
            color: "#fff",
            padding: "6px",
            textAlign: "right",
            fontSize:"4em",
            borderRadius: "8px",
            marginBottom: "20px",
            overflow: "hidden",
            
          }}
        >
          <div style={styles.history}>
            {history}
          </div>
          <div>{display}</div>
          
        </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 2fr)", gap: 8 }}>
          <Button onClick={clearAll} className="col-span-2">AC</Button>
          <Button onClick={plusMinus} className="col-span-2">+/-</Button>
          <Button onClick={() => performOperation("%")}>%</Button>
          <Button onClick={() => performOperation("÷")}>÷</Button>

          {[7, 8, 9].map((n) => (
            <Button key={n} onClick={() => inputDigit(n)}>{n}</Button>
          ))}
          <Button onClick={() => performOperation("×")}>×</Button>

          {[4, 5, 6].map((n) => (
            <Button key={n} onClick={() => inputDigit(n)}>{n}</Button>
          ))}
          <Button onClick={() => performOperation("-")}>-</Button>

          {[1, 2, 3].map((n) => (
            <Button key={n} onClick={() => inputDigit(n)}>{n}</Button>
          ))}
          <Button onClick={() => performOperation("+")}>+</Button>

          <Button onClick={erase} className="col-span-2">⌫</Button>
          <Button onClick={() => inputDigit(0)} className="col-span-2">0</Button>
          <Button onClick={inputDecimal}>.</Button>
          <Button onClick={() => performOperation("=")}>=</Button>
        </div>

      </div>
    </div>
  );
 
 
}