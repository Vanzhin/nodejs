// Напишите программу, которая будет принимать на вход несколько аргументов: 
// дату и время в формате «час-день-месяц-год». Задача программы — создавать 
// для каждого аргумента таймер с обратным отсчётом: посекундный вывод в терминал 
// состояния таймеров (сколько осталось). По истечении какого-либо таймера, 
// вместо сообщения о том, сколько осталось, требуется показать сообщение о завершении 
// его работы. Важно, чтобы работа программы основывалась на событиях.

const EventEmitter = require('events');
const colors = require("colors");

const timeString = process.argv[2];
class MyEmitter extends EventEmitter {}; 

const dateTypes = [
    'years',
    'days',
    'hours',
    'minutes',
    'seconds',
] 

class Timer 
{

 constructor(endDate) {
        this.endDate =  endDate
    } 

    getTimeRemaining(){  
        var now = new Date();
        var t = Date.parse(this.endDate) - Date.parse(now);  
        var seconds = Math.floor( (t/1000));  
        var minutes = Math.floor( (t/1000/60));  
        var hours = Math.floor( (t/(1000*60*60)));  
        var days = Math.floor( t/(1000*60*60*24) );

        if(this.endDate.getFullYear() - now.getFullYear() < 2 && this.endDate.getMonth() < now.getMonth()){
            var years = 0;
        } else{
            var years = this.endDate.getFullYear() - now.getFullYear(); 
        }

        if(years){
            var months = Math.abs(this.endDate.getMonth() - now.getMonth()) + years * 12;
        } else {
            var months = this.endDate.getMonth() >= now.getMonth() ? (Math.abs(this.endDate.getMonth() - now.getMonth())) : 12 - Math.abs(this.endDate.getMonth() - now.getMonth());
        }
    
        return {  
         'total': t,  
         'days': days,  
         'hours': hours,  
         'minutes': minutes,  
         'seconds': seconds,
         'months' : months,
         'years' : years 
        };  
    }
    getItemsRemaining(){ 
        if(this.item){
            return this.getTimeRemaining()[this.item]
        } 
        return null;
     }
}

class ItemTimer extends Timer
{
    constructor(endDate, item) {
        super(endDate);
        this.item = item;
      }
}
class TimerHandler {
    static check(payload) 
    {
        for (let item in payload) {
            if(payload[item] <= 0){
                console.log(`Таймер ${item} истек`);
                process.exit(0);            
            }
          }
          console.clear();
        console.log(`Осталось ${payload['years']} год(а) / ${payload['months']} месяцев / ${payload['days']} дней / ${payload['hours']} ч / ${payload['seconds']} c`)
    }
}

const pattern = /^(\d?\d-){3}\d{4}$/gm;
if(pattern.test(timeString)){
    
    const[hours,day,month,year] = timeString.split('-').map(item => Number(item));
    const inputDate = new Date(year,month-1, day, hours);

    const secondTimer = new ItemTimer(inputDate, 'seconds');
    const minuteTimer = new ItemTimer(inputDate, 'minutes');
    const hourTimer = new ItemTimer(inputDate, 'hours');
    const dayTimer = new ItemTimer(inputDate, 'days');
    const monthTimer = new ItemTimer(inputDate, 'months');
    const yearTimer = new ItemTimer(inputDate, 'years');

    const emitterObject = new MyEmitter();
    emitterObject.on('check', TimerHandler.check);

    setInterval(() => {
        emitterObject.emit('check', {
            'years': yearTimer.getItemsRemaining(), 
            'months': monthTimer.getItemsRemaining(),
            'days' : dayTimer.getItemsRemaining(),
            'hours' : hourTimer.getItemsRemaining(),
            'seconds' : secondTimer.getItemsRemaining(),
        });
    }, 1000);
    
}else{
    console.log('Необходимо ввести дату и время в формате: чч-дд-мм-гггг');
}
