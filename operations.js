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
  if (operators == null) {
    return;
  }

  let parenthesisExpression = "";

  for (let i = 0; i < operators.length; i++) {
    if (operators[i]) {
      const regex = new RegExp(`\\(\\d*[${operators[i]}]\\d*\\)`, "g");
      parenthesisExpression = inputtedEquation.match(regex);
      if (parenthesisExpression == null) {
        continue;
      } else {
        parenthesisExpression = inputtedEquation.match(regex)[0];
        break;
      }
    }
  }

  if (parenthesisExpression == undefined) {
    simplifyExWithNeg(inputtedEquation, operators);
  } else {
    let removedParenthesis = parenthesisExpression.slice(
      1,
      parenthesisExpression.length - 1
    );
    const resultMultDiv = multiplyOrDivideExpressions(removedParenthesis);
    const resultAddSub = addOrDivideExpressions(removedParenthesis);
    if (resultMultDiv !== undefined) {
      const replace = inputtedEquation.replace(
        parenthesisExpression,
        resultMultDiv
      );
      if (!Number(replace)) {
        simplify(replace);
      } else {
        answer = replace;
      }
    } else if (resultAddSub !== undefined) {
      const replace = inputtedEquation.replace(
        parenthesisExpression,
        resultAddSub
      );
      if (!Number(replace)) {
        simplify(replace);
      } else {
        answer = replace;
      }
    }
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
    if (regexExpNextToOp.test(inputtedEquation)) {
      const specificExponentExpression =
        inputtedEquation.match(regexExpNextToOp)[0];
      const result = multiplyOrDivideExpressions(specificExponentExpression);
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
  const result = multiplyOrDivideExpressions(expression);
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
    const result = multiplyOrDivideExpressions(expression);
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
    const result = multiplyOrDivideExpressions(expression);
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
    if (regex.test(inputtedEquation)) {
      const expression = inputtedEquation.match(regex)[0];
      const result = addOrDivideExpressions(expression);
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

function multiplyOrDivideExpressions(expression) {
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

function addOrDivideExpressions(expression) {
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
