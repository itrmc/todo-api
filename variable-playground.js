var person = {
    name: "Rob",
    age: 21
};

function updatePerson (obj) {
    obj = { //notice this creates a new OBJECT, but does not update the original
        name: "Rob",
        age:48
    }
}
updatePerson(person);
console.log(person);



function updatePerson2 (obj) {
    obj.age = 48
}
updatePerson2(person);
console.log(person);





//array example
var ntegers = [15,27];

function updateArray(obj) {
    obj = [1,2,3];
}

updateArray(ntegers);
console.log(ntegers);

function updateArray2(obj) {
    obj.push(99);
    //debugger;
}
updateArray2(ntegers);
console.log(ntegers);

