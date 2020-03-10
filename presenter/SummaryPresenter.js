import EmployeeRepository from '../logic/EmployeeRepository.js';
import Status from '../logic/Status.js';

export default class SummaryPresenter {
  
  constructor() {
    this.employeeRepository = EmployeeRepository.getInstance();
  }
  
  getSummary() {
    let summary = {};
    let data = this.employeeRepository.list;
    for (let [department, employees] of Object.entries(data)) {
      for (let {key,employee} of employees) {
        let status = employee.status;
        if(!summary[status]) summary[status] = [];
        summary[status].push(employee);
      }
    }
    return summary;
  }
}