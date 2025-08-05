import { answer, simplify } from "./operations.js";

const equationForm = document.getElementById("equation-form");

equationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const equation = document.getElementById("equation");
  const resultDiv = document.getElementById("results");

  const inputtedEquation = equation.value.replace(/\s/g, "");
  if (inputtedEquation === "") return;
  equation.value = "";
  simplify(inputtedEquation);
  resultDiv.textContent = answer;
});
