export default class DepartmentPresenter {

    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
        this.fragments = {};
        this.viewpager = document.querySelector('view-pager');
        this.dropdownMenu = document.querySelector('dropdown-menu');
        this.employeeRepository.on('employee-added', this.addEmployee.bind(this));

        this.dropdownMenu.addEventListener("onChange", e => {
            let index = e.detail.next;
            this.viewpager.setCurrentItem(index);
        });
    }

    addEmployee(e) {
        let {employee, index} = e.detail;
        let department = employee.department;
        if(!this.fragments[department]) {
            let fragment = document.createElement('department-fragment');
            fragment.setPresenter(this);
            fragment.setDepartment(department);
            this.fragments[department] = fragment;
            this.viewpager.add(fragment);
            this.dropdownMenu.add(department);
        }
        this.fragments[department].addEmployee(employee, index);
    }

    removeEmployee(department, index) {
        this.employeeRepository.removeEmployee(department, index);
    }

    updateEmployeeStatus(department, index, status) {
        this.employeeRepository.updateEmployeeStatus(department, index, status);
    }

    saveEmployeeInfo(input) {
        this.employeeRepository.addEmployees(input);

    }

}