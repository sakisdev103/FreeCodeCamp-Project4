import React, { useReducer } from 'react';
import DigitButtons from './DigitButtons';
import OperationButtons from './OperationButtons';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
  CHOOSE_OPERATION: 'choose-operation'
}

function reducer(state, {type,payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overWrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overWrite: false
        }
      }
      if(payload.digit === '0' && state.currentOperand === '0'){
        return state;
      }
      if(payload.digit === '.' && state.currentOperand.includes(".")){
        return state;
      }

      return{
        ...state,
        currentOperand: `${state.currentOperand || "" }${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null){
        return state;
      }  
      if(state.currentOperand == null){
        return{
          ...state,
          operation: payload.operation
        }

      }
      if(state.previousOperand == null){
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }  

    case ACTIONS.EVALUATE:
      if(state.operation == null || state.previousOperand == null || state.currentOperand == null) {
        return state;
      }
      
      return{
        ...state,
        overWrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }

    case ACTIONS.DELETE_DIGIT:
      if(state.overWrite) {
        return{
          ...state,
          overWrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null){
        return state
      }
      if(state.currentOperand.length === 1){
        return{
          ...state,
          currentOperand: null
        }
      }
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,1)
      }
      
    case ACTIONS.CLEAR:
      return{}
    }
    
}

function evaluate( {currentOperand, previousOperand, operation} ) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if(isNaN(prev) || isNaN(current)){
    return "";
  }
  let computation = "";
    switch (operation) {
      case "+":
        computation = prev + current;
        break
      case "-":
        computation = prev - current;
        break  
      case "*":
        computation = prev * current;
        break
      case "÷":
        computation = prev / current;
        break  
    }
    return computation.toString();
}

const App = () => {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer,
  {});

  return (
    <>
      <div className="container">
        <div className="calc-grid">
          <div id="display">
            <div>{previousOperand} {operation} {currentOperand}</div>
          </div>
          <div className="functionallity">
            <button className="span-two" id='clear' onClick={()=> dispatch({type: ACTIONS.CLEAR })}>AC</button>
            <button id='clear' onClick={()=> dispatch({type: ACTIONS.DELETE_DIGIT })}>DEL</button>
            <OperationButtons id="divide" operation="÷" dispatch={dispatch} />
            <DigitButtons id="one" digit="1" dispatch={dispatch}/>
            <DigitButtons id="two" digit="2" dispatch={dispatch}/>
            <DigitButtons id="three" digit="3" dispatch={dispatch}/>
            <OperationButtons id="multiply" operation="*" dispatch={dispatch} />
            <DigitButtons id="four" digit="4" dispatch={dispatch}/>
            <DigitButtons id="five" digit="5" dispatch={dispatch}/>
            <DigitButtons id="six" digit="6" dispatch={dispatch}/>
            <OperationButtons id="add" operation="+" dispatch={dispatch} />
            <DigitButtons id="seven" digit="7" dispatch={dispatch}/>
            <DigitButtons id="eight" digit="8" dispatch={dispatch}/>
            <DigitButtons id="nine" digit="9" dispatch={dispatch}/>
            <OperationButtons id="subtract" operation="-" dispatch={dispatch} />
            <DigitButtons id="demical" digit="." dispatch={dispatch} />
            <DigitButtons  className='span-two' id="zero" digit="0" dispatch={dispatch}/>
            <button className='span-two' id='equals' onClick={()=> dispatch({type: ACTIONS.EVALUATE })}>=</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App