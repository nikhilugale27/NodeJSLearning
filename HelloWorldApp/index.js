console.log("Hello World");

function add(a,b){
    return a+b;
}

// console.log(25+36);
// console.log(add);
// console.log(add());
// console.log(add(58,9));

// console.log(process.argv)

var arguments = process.argv.slice(2);

console.log("Adding the numbers:", add(parseInt(arguments[0]), parseInt(arguments[1])));