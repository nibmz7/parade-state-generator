export default class AttendanceDb {
  
  constructor(listener) {
    this.listener = listener;
    this.departments = {};
  }
    
  initialize() {
    let request = window.indexedDB.open('attendance_db', 1);
    
    request.onerror = e => {
      console.log(e.errorCode);
    }
    
    request.onsuccess = e => {
      this.db = e.target.result;
      this.listener.emit('ready');
    }
    
    request.onupgradeneeded = e => {
      this.db = e.target.result;
    
      let employeeStore = this.db.createObjectStore('employees', { autoIncrement: true });
      let departmentStore = this.db.createObjectStore('departments', { autoIncrement: true }); 
    
      employeeStore.createIndex('name', 'name', {unique: true});
      employeeStore.createIndex('department', 'department', {unique: false});
      departmentStore.createIndex('department', 'department', {unique: true});
    
      departmentStore.transaction.oncomplete = e => {
        this.listener.emit('readyt');
      }
    
    }
  }
  
  getDepartments() {
    this.db
    .transaction('departments')
    .objectStore('departments')
    .getAll().onsuccess = e => {
      for(let data of e.target.result) {
        this.departments[data.department] = true;
        this.listener.emit('department-added', data.department);
      }
    }
  }
  
  getEmployees(department) {
    let objectStore = this.db.transaction('employees').objectStore('employees');
    if(department) {
      objectStore.index('department').getAll(department).onsuccess = e => {
        console.log(e.target.result);
      }
    } else {
      objectStore.getAll().onsuccess = e => {
        console.log(e.target.result);
      }
    }
    
  }
  
  updateEmployee(employee, key) {
    let objectStore = this.db.transaction('employees', 'readwrite').objectStore('employees').put(employee, key);
    
    request.onsuccess = e => {
      console.log(e.target.result);
    }
    
  }

  addDepartment(department) {
    this.departments[department] = true;
    this.db.transaction('departments', 'readwrite')
    .objectStore('departments').add({department: department});
    this.listener.emit('department-added', department);
  }
  
  addEmployees(list) {
    let transaction = this.db.transaction('employees', 'readwrite');
    let objectStore = transaction.objectStore('employees');
    
    for(let employee of list) {
      if(!this.departments[employee.department]) {
        this.addDepartment(employee.department);
      }
      objectStore.add(employee).onsuccess = e => {
        let key = e.target.result;
        this.listener.emit('employee-added', {key, employee});
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
} 