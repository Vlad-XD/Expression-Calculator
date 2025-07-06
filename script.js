console.log("Ruby-Chan! Nani Ga Suki?");

// let inputString = "20    *20/8*9    ^5+6987*8   562^7 8 +1-8 96  66   66";
let inputString = "600*10-500*10";

// clean input up to remove white space
inputString = inputString.replaceAll(" ", "");

console.log(`The corrected input is ${inputString}`);

// global variables
let tokenLocation = 0;
let token = inputString[tokenLocation];
let outputInt = 0;
let currentNumberString = "";

try {
  // call input function to begin parsing
  parseInput();

  // print output
  console.log(`The result of the input expression is ${outputInt}.`)
} catch (e) {
  console.log("Error in parsing input!");
  console.log(e);
}

function parseInput() {
  if (["(", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(token)) {
    outputInt = expr();
  } else if (token == undefined) { //i.e., end of string
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
    let factorInt = base();
    factorInt = factorInt + termPrime();
    return factorInt;
  } else if (token == "-") {
    accept();
    let factorInt = base();
    factorInt = factorInt + termPrime();
    return (-1*factorInt);
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
    factorInt = factorInt * termPrime();
    return 1/factorInt;
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
    expr();
    if (token === ")"){
      accept();
      let factorNumber = parseFloat(currentNumberString); //obtain factor
      currentNumberString = ""; // reset current number
      return factorNumber;
    } else {
      error();
    }
  } else if (["0","1","2","3","4","5","6","7","8","9"].includes(token)) {
    digit();
    let factorNumber = parseFloat(currentNumberString); //obtain factor
    currentNumberString = ""; // reset current number
    return factorNumber;
  } else {
    error();
  }
}

// TODO: DELETE, NOT NECCESSARY
// function number() {
//     if (["0","1","2","3","4","5","6","7","8","9"].includes(token)){
//     digit();
//     digitPrime();
//   } else {
//     error();
//   }
// }

function digit() {
  let errorFlag = true;
  // for loop to check each digit [0,9]
  for(const digit of ["0","1","2","3","4","5","6","7","8","9"]){
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
    currentNumberString = currentNumberString.concat(digit);
    accept();
    decimal();
  } else if (["0","1","2","3","4","5","6","7","8","9"].includes(token)) {
    digit();
  } else {
    // epsilon, so do nothing
  }
}

function decimal() {
  // for loop to check each digit [0,9]
  for(const digit of ["0","1","2","3","4","5","6","7","8","9"]){
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
