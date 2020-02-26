export default class AttendanceDb {
  
  constructor(listener) {
    this.listener = listener;
  }
    
  initialize() {
    let request = window.indexedDB.open('attendance_db', 1);
    
    request.onerror = e => {
      console.log(e.errorCode);
    }
    
    request.onsuccess = e => {
      this.db = e.target.result;
      this.listener.emit('oncomplete', 'siccess');
    }
    
    request.onupgradeneeded = e => {
      this.db = e.target.result;
    
      let objectStore = this.db.createObjectStore('employees', { autoIncrement: true });
    
      objectStore.createIndex('departmentTypes', 'department', { unique: true });
      objectStore.createIndex('byDepartment', 'department', {unique: false});
    
      objectStore.transaction.oncomplete = e => {
        this.listener.emit('complete', 'hello');
      }
    
    }
  }
  
  getDepartments() {
    console.log("lol");
    let objectStore = this.db.transaction('employees').objectStore('employees');
    let index = objectStore.index('departmentTypes');
    let request = index.openKeyCursor();
    
    request.onerror = e => {
      console.log(JSON.stringify(e));
    }
    
    request.onsuccess = e => {
      let cursor = e.target.result;
      if(cursor) {
        
        console.log("Department: " + cursor.key);
        cursor.continue();
      }
    }
  }
  
  getByDepartment(name) {
    let objectStore = this.db.transaction('employees').objectStore('employees');
    let index = objectStore.index('byDepartment');
    index.getAll(name).onsuccess = e => {
      console.log(e.target.result);
    }
  }
  
  updateEmployee(employee, key) {
    let objectStore = this.db.transaction('employees', 'readwrite').objectStore('employees').put(employee, key);
    
    request.onsuccess = e => {
      console.log(request.result);
    }
    
  }
  
  addEmployees(list) {
    let transaction = this.db.transaction('employees', 'readwrite');
    let objectStore = transaction.objectStore('employees');
    transaction.onsuccess = e => {
      console.log(request.result);
    }
    transaction.onerror = e => {
      console.log(JSON.stringify(e.errorCode));
    }
    for(let employee of list) {
      let request = objectStore.add(employee);
      
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