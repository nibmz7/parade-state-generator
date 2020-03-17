import AttendanceDb from './AttendanceDb.js';
import Employee from './Employee.js';
import EventDispatcher from './EventDispatcher.js';

let instance;
export default class EmployeeRepository extends EventDispatcher {
  
  constructor() {
    super();
    this.list = {}; 
    this.db = new AttendanceDb();
    this.db.on('employee-added', this.employeeAdded.bind(this));
    this.db.on('ready', () => {
      this.db.getEmployees();
    });
    this.db.on('empty', () => { 
      this.emit('empty');
    });
  }

  static getInstance() {
    if(!instance) instance = new EmployeeRepository();
    return instance;
  }
  
  start() {
      //indexedDB.deleteDatabase('attendance_db');
      this.db.initialize();
  }
  
  isHigher(a, b) {
    if(a.rankInt < b.rankInt) return true;
     else return false;
  }

  employeeAdded(data) { 
    let {key, employee} = data;
    let department = employee.department;
    if(!this.list[department]) this.list[department] = [];
    let length = this.list[department].length;
    while(length > 0) {
      let a = this.list[department][length - 1].employee;
      let isHigher = this.isHigher(employee, a);
      if(isHigher) length--;
      else break;
    }
    this.list[department].splice(length, 0, {key, employee});
    this.emit('employee-added', {key, employee, index: length});
  }
  
  getItemIndex(department, key) {
    return this.list[department].findIndex(el => el.key == key);
  }
  
  removeEmployee(department, key) {
    this.db.deleteEmployee(key);
    let index = this.getItemIndex(department, key);
    this.list[department].splice(index, 1);
    if(this.list[department].length == 0) {
      this.emit('department-removed', department);
      delete this.list[department];
      if(Object.keys(this.list).length === 0) 
        this.emit('empty');
    }
  }
  
  updateEmployeeStatus(department, key, status) {
    let index = this.getItemIndex(department, key);
    let employee = this.list[department][index].employee;
    employee.status = status;
    this.db.updateEmployee(key, employee);
  }

  updateEmployeeRemark(department, key, remark) {
    let index = this.getItemIndex(department, key);
    let employee = this.list[department][index].employee;
    employee.remark = remark;
    this.db.updateEmployee(key, employee);
  }

  addEmployees(string) {
    let employees = Employee.toList(string);
    this.db.addEmployees(employees);
  }
  
}