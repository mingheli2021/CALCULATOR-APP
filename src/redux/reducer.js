import { current } from "@reduxjs/toolkit";
import ACTIONS from "./action";

const evaluate = state => {
    let { lastOperand, currentOperand, operation } = state;
    lastOperand = parseFloat(lastOperand);
    currentOperand = parseFloat(currentOperand);
    let res = "";
    switch (operation) {
        case '+':
            res = lastOperand + currentOperand;
            break;
        case '-':
            res = lastOperand - currentOperand;
            break;
        case '*':
            res = lastOperand * currentOperand;
            break;
        case '/':
            res = lastOperand / currentOperand;
            break;

    }
    return res.toString();
}

const reducer = (state = {
    currentOperand: "",
    lastOperand: "",
    operation: "",
    overwrite: false
}, action) => {
    switch (action.type) {
        case ACTIONS.ADD_DIGITS:
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: "",
                    overwrite: false
                }
            }
            if (state.currentOperand === '0' && action.digit === '0')
                return state;
            if (state.currentOperand === '0' && action.digit !== '.')
                return {
                    ...state,
                    currentOperand: action.digit,
                }
            if (state.currentOperand.includes('.') && action.digit === '.')
                return state;
            if (state.currentOperand === "" && action.digit === '.')
                return {
                    ...state,
                    currentOperand: "0."
                };
            return {
                ...state,
                currentOperand: state.currentOperand + action.digit,
            }
        case ACTIONS.DELETE_DIGITS:
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: "",
                    overwrite: false
                }
            }
            if (state.currentOperand === "")
                return state;
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1),
            }
        case ACTIONS.CHOOSE_OPERATION:
            if (state.lastOperand === "" && state.currentOperand === "") return state;
            if (state.lastOperand === "" && state.currentOperand !== "") {
                return {
                    ...state,
                    lastOperand: state.currentOperand,
                    operation: action.operation,
                    currentOperand: ""
                };
            }
            if (state.currentOperand === "") {
                return {
                    ...state,
                    operation: action.operation,
                }
            }
            return {
                ...state,
                lastOperand: evaluate(state),
                operation: action.operation,
                currentOperand: "",
            }
        case ACTIONS.CLEAR:
            return {
                ...state,
                currentOperand: "",
                lastOperand: "",
                operation: ""
            }
        case ACTIONS.EVALUATE:
            if (state.currentOperand === "" || state.lastOperand === "" || state.operation === "") return state;
            return {
                ...state,
                currentOperand: evaluate(state),
                lastOperand: "",
                operation: "",
                overwrite: true
            }

        default:
            return state;
    }

};

export default reducer;