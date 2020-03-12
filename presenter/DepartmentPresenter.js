import EmployeeRepository from '../logic/EmployeeRepository.js';
export default class DepartmentPresenter {

    constructor() {
        this.employeeRepository = EmployeeRepository.getInstance();
        this.fragments = {};
        this.viewpager = document.querySelector('view-pager');
        this.dropdownMenu = document.querySelector('dropdown-menu');
        this.employeeRepository.on('employee-added', this.addEmployee.bind(this));

        this.employeeRepository.on('department-removed', this.removeDepartment.bind(this));

        this.dropdownMenu.addEventListener("onChange", e => {
            let index = e.detail.next;
            this.viewpager.setCurrentItem(index);
        });
    }
    
    removeDepartment(e) {
      let department = e.detail;
      this.fragments[department].remove();
      delete this.fragments[department];
    }

    addEmployee(e) {
        let {key, employee, index} = e.detail;
        let department = employee.department;
        if(!this.fragments[department]) {
            let fragment = document.createElement('department-fragment');
            fragment.setPresenter(this);
            fragment.setDepartment(department);
            this.fragments[department] = fragment;
            this.viewpager.add(fragment);
            this.dropdownMenu.add(department);
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