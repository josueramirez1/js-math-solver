import { simplify } from "./operations.js";

export function calculateMultiplyOrDivide(expression) {
  if (expression.includes("^")) {
    const split = expression.split("^");
    const result = Number(split[0]) ** Number(split[1]);
    return String(result);
  }

  if (expression.includes("*")) {
    const split = expression.split("*");
    const result = Number(split[0]) * Number(split[1]);
    return String(result);
  }

  if (expression.includes("/")) {
    const split = expression.split("/");
    const result = Number(split[0]) / Number(split[1]);
    return String(result);
  }
}

export function calculateAddOrSub(expression) {
  if (expression.includes("+")) {
    const split = expression.split("+");
    const result = Number(split[0]) + Number(split[1]);
    return String(result);
  }

  if (expression.includes("-")) {
    const split = expression.split("-");
    const result = Number(split[0]) - Number(split[1]);
    return String(result);
  }
}

export function removeParenthesis(
  inputtedEquation,
  parenthesisExpression,
  answer
) {
  let removedParenthesis = parenthesisExpression.slice(
    1,
    parenthesisExpression.length - 1
  );
  const resultMultDiv = calculateMultiplyOrDivide(removedParenthesis);
  const resultAddSub = calculateAddOrSub(removedParenthesis);
  if (resultMultDiv !== undefined) {
    const replace = inputtedEquation.replace(
      parenthesisExpression,
      resultMultDiv
    );
    simplify(replace);
  } else if (resultAddSub !== undefined) {
    const replace = inputtedEquation.replace(
      parenthesisExpression,
      resultAddSub
    );
    simplify(replace);
  }
}

function mergeNegWithWholeNum() {}
