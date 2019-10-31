
var Person = (function () {
    let ageKey = Symbol();
  
    class Person {
      constructor(name) {
        this.name = name; // this is public
        this[ageKey] = 20; // this is intended to be private
      }
  
      greet() {
        // Here we can access both name and age
        console.log(`name: ${this.name}, age: ${this[ageKey]}`);
      }
    }
  
    return Person;
  })();
  
  export default Person

