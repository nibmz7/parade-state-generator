import AttendanceDb from './AttendanceDb.js';

export default class EmployeeRepository extends EventTarget {
  
  constructor() {
    super();
    this.fragments = {};
    this.list = {}; 
    this.viewpager = document.querySelector('view-pager');
    this.dropdownMenu = document.querySelector('dropdown-menu');
    this.db = new AttendanceDb();
    this.db.on('employee-added', this.employeeAdded.bind(this));
    this.db.on('ready', () => {
      this.db.getEmployees();
    });
  }
  
  start() {
    //indexedDB.deleteDatabase('attendance_db').onsuccess = e => {
    this.db.initialize();
    //}
  }
  
  isHigher(a, b) {
    if(a.rankIdx < b.rankIdx) {
      if(a.name < b.name) {
        return true;
      } else {
        return false;
      }
    } else return false;
  }
  
  employeeAdded(e) {
    let {key, employee} = e.detail;
    let department = employee.department;
    if(!this.fragments[department]) {
      let fragment = document.createElement('department-fragment');
      fragment.setAttribute('name', department);
      this.fragments[department] = fragment;
      this.list[department] = [];
      this.viewpager.add(fragment);
      this.dropdownMenu.add(department);
    }
    let length = this.list[department].length;
    if(length > 0) {
      while(true) {
        let a = this.list[department][length - 1];
        let isHigher = this.isHigher(a, employee);
        if(isHigher) length--;
        else break;
      }
      this.list[department].splice(length, 0, employee);
    } else this.list[department].push(employee);
    this.fragments[department].addEmployee(employee, length);
  }
  
  removeEmployee(index, key, employee) {
    this.list[department].splice(index, 1);
    this.db.removeEmployee(key);
  }
  
  updateEmployee(index, key, employee) {
    this.list[department][index] = employee;
    this.db.updateEmployee(key, employee);
  }
  
}