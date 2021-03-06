import EmployeeRepository from '../logic/EmployeeRepository.js';
export default class DepartmentPresenter {

    constructor() {
        this.employeeRepository = EmployeeRepository.getInstance();
        this.fragments = {};
        this.fragmentHolder = document.querySelector('.fragment-holder');
        this.employeeRepository.on('employee-added', this.addEmployee.bind(this));
    }
    
    removeDepartment(e) {
      let department = e.detail;
      this.fragments[department].remove();
      delete this.fragments[department];
    }

    addEmployee(data) {
        let {key, employee, index} = data;
        let department = employee.department;
        if(!this.fragments[department]) {
            let fragment = document.createElement('department-fragment');
            fragment.setPresenter(this);
            fragment.setDepartment(department);
            this.fragments[department] = fragment;
            this.fragmentHolder.appendChild(fragment);
        }
        this.fragments[department].addEmployee(key, employee, index);
    }

    removeEmployee(department, key) {
        this.employeeRepository.removeEmployee(department, key);
    }

    updateEmployeeStatus(department, key, status) {
        this.employeeRepository.updateEmployeeStatus(department, key, status);
    }
    
    updateEmployeeRemark(department, key, remark) {
      this.employeeRepository.updateEmployeeRemark(department, key, remark);
    }

    saveEmployeeInfo(input) {
        this.employeeRepository.addEmployees(input);
    }

}