const colors = require("colors/safe");
const prompt = require('prompt');
const count_start = 2;
const count_end = 1000;

console.log(`Укажите число от ${count_start} до ${count_end}`);
const properties = [
  {
    name: 'count',
    validator: /^\d\d?\d?\d?$/,
    conform: function (value) {
        if(value <= count_end && value >= count_start){
            return true;
        }
      },
    required: true,
    warning: `Указано число вне диапазона или не число (Необходимо ввести число от ${count_start} до ${count_end})`
  },
];

prompt.start();

prompt.get(properties, function (err, result) {
  if (err) {
    return onErr(err);
  }

    console.log('Введено число: ' + result.count);
    const count = Number(result.count);
    const primes = [];
    for(i = 1; i <= count; i++){
        if(test_prime(i)){
         primes.push(i);  
        }  
    }
    makeItColor(primes);
    
});

function onErr(err) {
  console.log(err);
  return 1;
}

function test_prime(n) {

  if (n===1)  {
    return false;
  }
  else if(n === 2)  {
    return true;
  } else   {
    for(var x = 2; x < n; x++)  {
      if(n % x === 0) {
        return false;
      }
    }
    return true;  
  }
}

function makeItColor(array){
    for(i=0;i<=array.length;i=i+3){
        if(array[i]){
            console.log(colors.red(array[i]))
        }
        if(array[i+1]){
            console.log(colors.yellow(array[i+1]))
        }
        if(array[i+2]){
            console.log(colors.green(array[i+2]))
        } 
    }
}