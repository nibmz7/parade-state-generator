let instance;

export default class AttendanceDb extends EventTarget {
  
  constructor() { 
    super();
  }

  static getInstance() {
    if(!instance) {
      instance = new AttendanceDb();
    }
    return instance;
  }
    
  initialize() {
    let request = indexedDB.open('attendance_db', 1);
    
    request.onerror = e => {
      console.log(e.errorCode);
    }
    
    request.onsuccess = e => {
      this.db = e.target.result;
      this.emit('ready');
    }
    
    request.onupgradeneeded = e => {
      this.db = e.target.result;
    
      let employeeStore = this.db.createObjectStore('employees', { autoIncrement: true }); 
    
      employeeStore.createIndex('name', 'name', {unique: true});
      employeeStore.createIndex('department', ['department','rankInt','name'], {unique: false});
    }
  }
  
  getEmployees() {
    let list = {};
    let objectStore = this.db.transaction('employees').objectStore('employees');
    let request = objectStore.index('department').openCursor();
    request.onsuccess = e => {
      let cursor = event.target.result;
      if (cursor) {
          let key = cursor.primaryKey;
          let employee = cursor.value;
          let department = employee.department;
          if(!list[department]) {
            list[department] = [];
          }
          list[department].push({key, employee});
          cursor.continue();
      }
      else {
        this.emit('employees-found', list);
      }
   }
   
  }
  
  updateEmployee(employee, key) {
    let request = this.db.transaction('employees', 'readwrite').objectStore('employees').put(employee, key);
    
    request.onsuccess = e => {
      this.emit('employee-added', e.target.result);
    }
    
  }
  
  addEmployees(employees) {
    let transaction = this.db.transaction('employees', 'readwrite');
    let objectStore = transaction.objectStore('employees');

    let list = {};
    for(let employee of employees) {
      objectStore.add(employee).onsuccess = e => {
        let key = e.target.result;
        this.emit('employee-added', {key, employee});
      };
    }
    
  }
  
  deleteEmployee(key) {
    let request = this.db.transaction('employees', 'readwrite')
      .objectStore('employees')
      .delete(key);
    request.onsuccess = function(event) {
      console.log('Deleted: ' + key);
    };
  }

  emit(type, data) {
    let event = new CustomEvent(type, {detail: data});
    this.dispatchEvent(event);
  }
  
  on(type, callback) {
    this.addEventListener(type, callback);
  }

} 