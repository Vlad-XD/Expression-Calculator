// global variables
let inputString = "";
const operators = ["+","-","*","/","^",undefined];
const digits = ["0","1","2","3","4","5","6","7","8","9"];
let tokenLocation = 0;
let token = inputString[tokenLocation];
let outputInt = 0;
let currentNumberString = "";
const inputBox = document.querySelector("input#input");
const resultBox = document.querySelector("input#result");

inputBox.addEventListener("focusout", () => {
  getinputString();
  calculateOutput();
})

inputBox.addEventListener("keypress", (e) => {
  if(e.key == "Enter"){
    getinputString();
    calculateOutput();
  }
})

function getinputString() {
  inputString = inputBox.value;
  // clean input up to remove white space
  inputString = inputString.replaceAll(" ", "");

  // reset global variables
  currentNumberString = "";
  tokenLocation = 0;
  token = inputString[tokenLocation];
}

function calculateOutput(){
  try {
    // call input function to begin parsing
    parseInput();

    // after done parsing, display the result
    resultBox.value = outputInt;
    resultBox.classList.remove("error");

    // print output in console
    console.log(`The result of the input expression is ${outputInt}.`)
  } catch (e) {

    // if error, display error message in result box
    resultBox.value = "ERROR: VERIFY INPUT!";
    resultBox.classList.add("error");

    // print error message in console
    console.log("Error in parsing input!");
    console.log(e);
  }
}

function parseInput() {
  if (["(", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(token)) {
    outputInt = expr();
    // check for end of string
    if (token != undefined){
      error();
    } 
  } else if (token === undefined) { //i.e., empty of string
    // don't throw an error
  } else {
    error();
  }
}

function expr() {
  if (["(", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(token)) {
    let factorInt = term();
      // exprPrime either add or subtract. But since a-b is the same as a+(-b)
    // we can just add by exprPrime and have exprPrime adjust what is sent back based on addition or subtraction
    factorInt = factorInt + exprPrime();
    return factorInt;
  } else {
    error();
  }
}

function exprPrime() {
  if (token == "+"){
    accept();
    let factorInt = term();
    factorInt = factorInt + exprPrime();
    return factorInt;
  } else if (token == "-") {
    accept();
    let factorInt = term();
    factorInt = -1*factorInt + exprPrime();
    return factorInt;
  } else {
    // epsilon, so do nothing
    return 0; // we return 0, meaning adding/subtratcing 0, i.e., no change
  }
}

function term() {
  if (["(","0","1","2","3","4","5","6","7","8","9"].includes(token)){
    let factorInt = base();
    // termPrime either multiplies or divides. But since a/b is the same as a* 1/b, 
    // we can just multiply by termPrime and have termPrime adjust what is sent back based on division or multiplication
    factorInt = factorInt * termPrime(); 
    return factorInt;
  } else {
    error();
  }
}

function termPrime() {
  if (token == "*"){
    accept();
    let factorInt = base();
    factorInt = factorInt * termPrime();
    return factorInt;
  } else if (token == "/") {
    accept();
    let factorInt = base();
    factorInt = 1/factorInt * termPrime();
    return factorInt;
  } else {
    // epsilon, so do nothing
    return 1; // we return 1, meaning multiplying/dividing by 1, i.e., no change
  }
}

function base() {
    if (["(","0","1","2","3","4","5","6","7","8","9"].includes(token)){
    let factorInt = factor();
    factorInt = factorInt ** basePrime();
    return factorInt;
  } else {
    error();
  }
}

function basePrime() {
  if (token === "^") {
    accept();
    let factorInt = factor();
    factorInt = factorInt ** basePrime();
    return factorInt;
  } else {
    // epsilon, so do nothing
    return 1; // we return 1, meaning raising to the power of 1, i.e., no change
  }
}

function factor() {
  if (token === "("){
    accept();
    operators.push(")"); // this is to make sure epsilon* works correct w/ parantheticals
    factorNumber = expr();
    if (token === ")"){
      accept();
      // let factorNumber = parseFloat(currentNumberString); //obtain factor
      // currentNumberString = ""; // reset current number
      return factorNumber;
    } else {
      error();
    }
  } else if (digits.includes(token)) {
    digit();
    let factorNumber = parseFloat(currentNumberString); //obtain factor
    currentNumberString = ""; // reset current number
    return factorNumber;
  } else {
    error();
  }
}

function digit() {
  let errorFlag = true;
  // for loop to check each digit [0,9]
  for(const digit of digits){
    if (token === digit){
      errorFlag = false;
      currentNumberString = currentNumberString.concat(digit);
      accept();
      digitPrime();
    }
  }
  // otherwise, throw an error
  if(errorFlag){
    error();
  }
}

function digitPrime() {
  if (token === "."){
    currentNumberString = currentNumberString.concat(token);
    accept();
    decimal();
  } else if (digits.includes(token)) {
    digit();
  } else if (!operators.includes(token)) { //this behavior is meant to implement epsilon*
    error();
  }else{
    // epsilon*, so do nothing
    // this is to make sure epsilon* works correct w/ parantheticals
    if (token === ")" ){
      operators.pop();
    }
  }
}

function decimal() {
  // for loop to check each digit [0,9]
  for(const digit of digits){
    if (token === digit){
      currentNumberString = currentNumberString.concat(digit);
      accept();
      decimal();
    }
  }
}

// accept function: updates the token lookahead
function accept() {
  tokenLocation++;
  token = inputString[tokenLocation];
}

// error function: signals a parsing error and terminates parsing
function error() {
  throw new Error("Invalid input! Revise and try again.");
}
