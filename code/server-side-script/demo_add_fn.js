db.system.js.save({
    _id: "sum", 
    value: function (x, y) { 
            print(`x is ${x} and y is ${y}`);
            print('Doing addition using sum method');            
            return x + y; 
            }
});