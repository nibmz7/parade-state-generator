import AttendanceDb from './AttendanceDb.js';
import Employee from './Employee.js';

let instance;
export default class EmployeeRepository extends EventTarget {
  
  constructor() {
    super();
    this.list = {}; 
    this.db = new AttendanceDb();
    this.db.on('employee-added', this.employeeAdded.bind(this));
    this.db.on('ready', () => {
      this.db.getEmployees();
    });
  }

  static getInstance() {
    if(!instance) instance = new EmployeeRepository();
    return instance;
  }
  
  start() {
    //indexedDB.deleteDatabase('attendance_db').onsuccess = e => {
    this.db.initialize();
    //}
  }
  
  isHigher(a, b) {
    if(a.rankInt < b.rankInt) return true;
     else return false;
  }
  
  employeeAdded(e) {
    let {key, employee} = e.detail;
    let department = employee.department;
    if(!this.list[department]) this.list[department] = [];
    let length = this.list[department].length;
    if(length > 0) {
      while(length > 0) {
        let a = this.list[department][length - 1];
        let isHigher = this.isHigher(employee, a);
        if(isHigher) length--;
        else break;
      }
      this.list[department].splice(length, 0, employee);
    } else this.list[department].push(employee);
    this.emit('employee-added', {employee, index: length});
  }
  
  removeEmployee(index, key, employee) {
    this.list[department].splice(index, 1);
    this.db.removeEmployee(key);
  }
  
  updateEmployee(index, key, employee) {
    this.list[department][index] = employee;
    this.db.updateEmployee(key, employee);
  }

  addEmployees(string) {
    let employees = Employee.toList(string);
    this.db.addEmployees(employees);
  }

  emit(type, data) {
    let event = new CustomEvent(type, {detail: data});
    this.dispatchEvent(event);
  }
  
  on(type, callback) {
    this.addEventListener(type, callback);
  }
  
}