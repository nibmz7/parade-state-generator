let instance;

export default class AttendanceDb extends EventTarget {
  
  constructor() { 
    super();
    this.departments = {};
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
      let departmentStore = this.db.createObjectStore('departments', { autoIncrement: true }); 
    
      employeeStore.createIndex('name', 'name', {unique: true});
      employeeStore.createIndex('department', 'department', {unique: false});
      departmentStore.createIndex('department', 'department', {unique: true});
    
    }
  }
  
  emit(type, data) {
    let event = new CustomEvent(type, {detail: data});
    this.dispatchEvent(event);
  }
  
  on(type, callback) {
    this.addEventListener(type, callback);
  }
  
  getDepartments() {
    this.db
    .transaction('departments')
    .objectStore('departments')
    .getAll().onsuccess = e => {
      for(let data of e.target.result) {
        this.departments[data.department] = true;
        this.emit('department-added', data.department);
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
    let request = this.db.transaction('employees', 'readwrite').objectStore('employees').put(employee, key);
    
    request.onsuccess = e => {
      console.log(e.target.result);
    }
    
  }

  addDepartment(department) {
    this.departments[department] = true;
    this.db.transaction('departments', 'readwrite')
    .objectStore('departments').add({department: department});
  }
  
  addEmployees(employees) {
    let transaction = this.db.transaction('employees', 'readwrite');
    let objectStore = transaction.objectStore('employees');
    let list = {};
    for(let employee of employees) {
      let department = employee.department;
      if(!this.departments[department]) {
        this.addDepartment(department);
        list[department] = [];
      }
      objectStore.add(employee).onsuccess = e => {
        let key = e.target.result;
        list[department].push({key, employee});
      };
    }

    transaction.oncomplete = e => {
      this.emit('employees-added', list);
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