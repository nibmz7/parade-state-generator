export default class EmployeePresenter extends EventTarget {
  
  constructor(db) {
    super();
    this.fragments = {};
    this.departments = {}; 
    this.db = db;
    this.db.on('employee-added', this.employeeAdded.bind(this));
  }
  
  employeeAdded(e) {
    let {key, employee} = e.detail;
    let department = employee.department;
    if(!fragments[department]) {
      let fragment = document.createElement('department-fragment');
      fragment.setAttribute('name', department);
      this.fragments[department] = fragment;
      this.viewpager.add(fragment);
      this.dropdownMenu.add(department);
    }
    this.fragments[department].addEmployee(key, employee);
  }
  
  removeEmployee(index, key, employee) {
    this.departments[department].splice(index, 1);
    this.db.removeEmployee(key);
  }
  
  updateEmployee(index, key, employee) {
    this.departments[department][index] = employee;
    this.db.updateEmployee(key, employee);
  }
  
}