import EventDispatcher from './EventDispatcher.js';

export default class AttendanceDb extends EventDispatcher {
  
  constructor() { 
    super();
  }
    
  initialize() {
    let request = indexedDB.open('attendance_db', 1);
    
    request.onerror = e => {
      console.log(e.errorCode);
    }
    
    request.onsuccess = e => {
      this.db = e.target.result;
      this.emit('ready');
      this.db.transaction('employees')
      .objectStore('employees')
      .count()
      .onsuccess = e => {
        let count = e.target.result;
        if(count == 0) this.emit('empty');
      };
    }
    
    request.onupgradeneeded = e => {
      this.db = e.target.result;
    
      let employeeStore = this.db.createObjectStore('employees', { autoIncrement: true }); 
    
      employeeStore.createIndex('name', 'name', {unique: true});
      employeeStore.createIndex('department', ['department','rankInt','name'], {unique: false});
    }
  }
  
  getEmployees() {
    let objectStore = this.db.transaction('employees').objectStore('employees');
    let request = objectStore.index('department').openCursor();
    request.onsuccess = e => {
      let cursor = e.target.result;
      if (cursor) {
          let employee = cursor.value;
          let key = cursor.primaryKey;
          this.emit('employee-added', {key, employee});
          cursor.continue();
      }
    }
  }
  
  updateEmployee(employee, key) {
    let request = this.db.transaction('employees', 'readwrite').objectStore('employees').put(key, employee);
  }
  
  addEmployees(employees) {
    let transaction = this.db.transaction('employees', 'readwrite');
    let objectStore = transaction.objectStore('employees');

    transaction.onerror = e => {
      console.log(e);
    }

    let list = {};
    for(let employee of employees) {
      objectStore.add(employee).onsuccess = e => {
        let key = e.target.result;
        this.emit('employee-added', {key, employee});
      };
    }
    
  }
  
  deleteEmployee(key) {
    this.db.transaction('employees', 'readwrite').objectStore('employees').delete(key);
  }

} 