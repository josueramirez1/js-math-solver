import {
  calculateAddOrSub,
  calculateMultiplyOrDivide,
  removeParenthesis,
} from "./helpers.js";

export let answer;

export function simplify(inputtedEquation) {
  if (Number(inputtedEquation)) {
    answer = inputtedEquation;
    return;
  }

  const regexOp = new RegExp(/[*/+-]/, "g");
  const operators = inputtedEquation.match(regexOp);

  if (operators == null && inputtedEquation.includes("^")) {
    let modOperators = ["^"];
    simplifyParenthesis(inputtedEquation, modOperators);
  } else if (inputtedEquation.includes("^")) {
    let modOperators = ["^", ...operators];
    simplifyParenthesis(inputtedEquation, modOperators);
  } else {
    simplifyParenthesis(inputtedEquation, operators);
  }
}

function simplifyParenthesis(inputtedEquation, operators) {
  let parenthesisExpression = "";

  for (let i = 0; i < operators.length; i++) {
    if (operators[i]) {
      const regularReg = new RegExp(`\\(\\d+[${operators[i]}]\\d+\\)`, "g");
      const negFirstReg = new RegExp(`\\(\\-\\d+[${operators[i]}]\\d+\\)`, "g");
      const lastNegReg = new RegExp(`\\(\\d+[${operators[i]}]\\-\\d+\\)`, "g");
      const bothNegReg = new RegExp(
        `\\(\\-\\d+[${operators[i]}]\\-\\d+\\)`,
        "g"
      );

      if (parenthesisExpression == undefined) {
        continue;
      } else if (regularReg.test(inputtedEquation)) {
        parenthesisExpression = inputtedEquation.match(regularReg)[0];
        break;
      } else if (negFirstReg.test(inputtedEquation)) {
        parenthesisExpression = inputtedEquation.match(negFirstReg)[0];
        break;
      } else if (lastNegReg.test(inputtedEquation)) {
        parenthesisExpression = inputtedEquation.match(lastNegReg)[0];
        break;
      } else if (bothNegReg.test(inputtedEquation)) {
        parenthesisExpression = inputtedEquation.match(bothNegReg)[0];
        break;
      }
    }
  }

  if (!parenthesisExpression) {
    simplifyExWithNeg(inputtedEquation, operators);
  } else {
    removeParenthesis(inputtedEquation, parenthesisExpression, answer);
  }
}

function simplifyExWithNeg(inputtedEquation, operators) {
  const exponent = operators.find((op) => {
    if (op === "^") {
      return op;
    }
  });

  // this goes straight to adition subtraction
  if (exponent == undefined) {
    simplifyMultDiv(inputtedEquation, operators);
  }
  // dealing with negative exponenets
  if (exponent) {
    const regexExpNextToOp = /\d+\^-\d+/g;
    const regexNegFirst = /\-\d+\^\d+/g;
    const regexBothNeg = /\-\d+\^-\d+/g;

    if (regexExpNextToOp.test(inputtedEquation)) {
      const specificExponentExpression =
        inputtedEquation.match(regexExpNextToOp)[0];
      const result = calculateMultiplyOrDivide(specificExponentExpression);
      const replacement = inputtedEquation.replace(
        specificExponentExpression,
        result
      );
      if (
        replacement.includes("*") ||
        replacement.includes("/") ||
        replacement.includes("^")
      ) {
        simplify(replacement);
      } else {
        const updatedOperator = operators.filter((op) => {
          return op !== exponent;
        });
        simplifyAddOrSub(replacement, updatedOperator);
      }
    } else if (regexNegFirst.test(inputtedEquation)) {
      const specificExponentExpression =
        inputtedEquation.match(regexNegFirst)[0];
      const result = calculateMultiplyOrDivide(specificExponentExpression);
      const replacement = inputtedEquation.replace(
        specificExponentExpression,
        result
      );
      if (
        replacement.includes("*") ||
        replacement.includes("/") ||
        replacement.includes("^")
      ) {
        simplify(replacement);
      } else {
        const updatedOperator = operators.filter((op) => {
          return op !== exponent;
        });
        simplifyAddOrSub(replacement, updatedOperator);
      }
    } else if (regexBothNeg.test(inputtedEquation)) {
      const specificExponentExpression =
        inputtedEquation.match(regexBothNeg)[0];
      const result = calculateMultiplyOrDivide(specificExponentExpression);
      const replacement = inputtedEquation.replace(
        specificExponentExpression,
        result
      );
      if (
        replacement.includes("*") ||
        replacement.includes("/") ||
        replacement.includes("^")
      ) {
        simplify(replacement);
      } else {
        const updatedOperator = operators.filter((op) => {
          return op !== exponent;
        });
        simplifyAddOrSub(replacement, updatedOperator);
      }
    } else {
      simplifyExponents(inputtedEquation, operators, exponent);
    }
  }
}

function simplifyExponents(inputtedEquation, operators, exponent) {
  const regExponent = new RegExp(`\\d+\\${exponent}\\d+`, "g");
  const expression = inputtedEquation.match(regExponent)[0];
  const result = calculateMultiplyOrDivide(expression);
  const replacement = inputtedEquation.replace(expression, result);

  if (
    replacement.includes("*") ||
    replacement.includes("/") ||
    replacement.includes("^")
  ) {
    simplify(replacement);
  } else {
    const updatedOperator = operators.filter((op) => {
      return op !== exponent;
    });
    simplifyAddOrSub(replacement, updatedOperator);
  }
}

function simplifyMultDiv(inputtedEquation, operators) {
  const multipleOrDivisor = operators.find((op) => {
    if (op === "*" || op === "/") {
      return op;
    }
  });

  const regexPos = new RegExp(`\\d+[${multipleOrDivisor}]\\d+`, "g");
  const regexNeg = new RegExp(`\\d+[${multipleOrDivisor}][-]\\d+`, "g");

  if (multipleOrDivisor == undefined) {
    simplifyAddOrSub(inputtedEquation, operators);
  } else if (regexNeg.test(inputtedEquation)) {
    const expression = inputtedEquation.match(regexNeg)[0];
    const result = calculateMultiplyOrDivide(expression);
    const replacement = inputtedEquation.replace(expression, result);
    if (
      replacement.includes("*") ||
      replacement.includes("/") ||
      replacement.includes("^")
    ) {
      simplify(replacement);
    } else {
      const updatedOperator = operators.filter((op) => {
        return op !== multipleOrDivisor;
      });
      simplifyAddOrSub(replacement, updatedOperator);
    }
  } else {
    const expression = inputtedEquation.match(regexPos)[0];
    const result = calculateMultiplyOrDivide(expression);
    const replacement = inputtedEquation.replace(expression, result);
    if (
      replacement.includes("*") ||
      replacement.includes("/") ||
      replacement.includes("^")
    ) {
      simplify(replacement);
    } else {
      const updatedOperator = operators.filter((op) => {
        return op !== multipleOrDivisor;
      });
      simplifyAddOrSub(replacement, updatedOperator);
    }
  }
}

function simplifyAddOrSub(inputtedEquation, operators) {
  const additionOrSubtraction = operators.find((op) => {
    if (op === "+" || op === "-") {
      return op;
    }
  });

  if (additionOrSubtraction == undefined) {
    answer = inputtedEquation;
    return;
  } else {
    const regex = new RegExp(`\\d+[${additionOrSubtraction}]\\d+`, "g");
    const firstNegRegex = new RegExp(
      `\\-\\d+[${additionOrSubtraction}]\\d+`,
      "g"
    );
    const lastNegRegex = new RegExp(
      `\\d+[${additionOrSubtraction}]\\-\\d+`,
      "g"
    );
    const bothNegRegex = new RegExp(
      `\\-\\d+[${additionOrSubtraction}]\\-\\d+`,
      "g"
    );

    if (regex.test(inputtedEquation)) {
      const expression = inputtedEquation.match(regex)[0];
      const result = calculateAddOrSub(expression);
      const replace = inputtedEquation.replace(expression, result);
      if (!Number(replace)) {
        simplify(replace);
      } else {
        answer = replace;
      }
    } else if (firstNegRegex.test(inputtedEquation)) {
      const expression = inputtedEquation.match(firstNegRegex)[0];
      const result = calculateAddOrSub(expression);
      const replace = inputtedEquation.replace(expression, result);
      if (!Number(replace)) {
        simplify(replace);
      } else {
        answer = replace;
      }
    } else if (lastNegRegex.test(inputtedEquation)) {
      const expression = inputtedEquation.match(lastNegRegex)[0];
      const result = calculateAddOrSub(expression);
      const replace = inputtedEquation.replace(expression, result);
      if (!Number(replace)) {
        simplify(replace);
      } else {
        answer = replace;
      }
    } else if (bothNegRegex.test(inputtedEquation)) {
      const expression = inputtedEquation.match(bothNegRegex)[0];
      const result = calculateAddOrSub(expression);
      const replace = inputtedEquation.replace(expression, result);
      if (!Number(replace)) {
        simplify(replace);
      } else {
        answer = replace;
      }
    } else {
      answer = inputtedEquation;
    }
  }
}
