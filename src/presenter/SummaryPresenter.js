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
        let category = Status[status].category;
        if(!summary[category]) summary[category] = {};
        if(!summary[category][status]) 
          summary[category][status] = [];
          
        if(employee.remark && employee.remark.length > 0)
          summary[category][status].unshift(employee);
        else summary[category][status].push(employee);
      }
    }
    return summary;
  }

  //bad bad code 
  async downloadToExcel() {
    let data = this.employeeRepository.list;
    let list = [];
    let summary = {};
    const compare = (a,b) => {

        if (a.rankInt < b.rankInt) return -1;
        if (b.rankInt < a.rankInt) return 1;

        if (a.name < b.name) return -1;
        if (b.name < a.name) return 1;

        return 0;
    }
    const toName = a => a.rank + ' ' + a.name;
    for (let [department, employees] of Object.entries(data)) {
      for (let {key,employee} of employees) {
        list.push(employee);
      }
    }
    list.sort(compare);
    for(let employee of list) {
      let status = employee.status;
      if(status == 0) status = 17;
      if(!summary[status]) summary[status] = [];
      summary[status].push(employee);
    }
    let index = 0;
    let output = [];
    if(summary[1]) {
      for(let employee of summary[1]) {
        output.push(['', ++index, toName(employee)]);
      }
      output[0][0] = "*Present*";
    }

    let strength = index + '/' + list.length;

    let date = new Date();
    let month = date.getMonth() + 1;
    let day = String(date.getDate()).padStart(2, '0');
    let year = date.getFullYear();
    let dateText = day + '/'+ month + '/' + year;
    let header = [
      ["SBW PLC Strength", "", "", ""],
      [],
      ["Date", dateText],
      ["Total Strength", strength],
      [],
    ];
    
    delete summary[1];
    let maxLength = 0;
    for (let [status, employees] of Object.entries(summary)) {
      output.push([]);
      let startIndex = output.length;
      for (let employee of employees) {
        let name = toName(employee);
        if(name.length > maxLength) maxLength = name.length;
        let row = ['', ++index, name];
        if(status == 17) row.push(employee.remark);
        output.push(row);
      }
      output[startIndex][0] = `*${Status[status].fullName}*`;
    }
    let workbook = await XlsxPopulate.fromBlankAsync()
            // Modify the workbook.
    workbook.sheet(0).name("Attendance sheet");
    workbook.sheet(0).column("A").style({ bold: true, italic: true });
    workbook.sheet(0).column("A").width(21);
    workbook.sheet(0).column("B").width(10);
    workbook.sheet(0).column("C").width(maxLength + 5);
    workbook.sheet(0).cell("A1").value((header.concat(output)));

    let blob = await workbook.outputAsync()
                
    let url = window.URL.createObjectURL(blob);
    let name = `SBW PARADE STATE ${dateText}.xlsx`;
    return {name, url};
  }
  
} 