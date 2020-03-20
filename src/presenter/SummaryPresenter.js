import EmployeeRepository from '../logic/EmployeeRepository.js';
import Status from '../logic/Status.js';

export default class SummaryPresenter {
  
  constructor() {
    this.employeeRepository = EmployeeRepository.getInstance();
  }
  
  getSummary() {
    let data = this.employeeRepository.list;

    const compare = (a,b) => {

        if (a.rankInt < b.rankInt) return -1;
        if (b.rankInt < a.rankInt) return 1;

        if (a.name < b.name) return -1;
        if (b.name < a.name) return 1;

        return 0;
    }
    
    let list = [];
    let total = 0, present = 0, current = 0;
    for (let [department, employees] of Object.entries(data)) {
      for (let {key,employee} of employees) {
        let status = employee.status;
        if(status == 1) {
          present++;
          if(!employee.isRegular && employee.remark.length == 0) current++;
        }
        if(!list[status]) list[status] = [];
        list[status].push(employee);
        list[status].sort(compare);
        total++;
      }
    }
    return {total, present, current, list};
  }

  //bad bad code 
  async downloadToExcel(summary, total, present) {
    
    const toName = a => {
      let name = a.rank + ' ' + this.capitalizeWords(a.name);
      return name;
    }

    let strength = present + '/' + total;

    let date = new Date();
    let month = date.getMonth() + 1;
    let day = String(date.getDate()).padStart(2, '0');
    let year = date.getFullYear();
    let dateText = day + '/'+ month + '/' + year;
    let header = [
      ["SBW PLC Strength", "", "", ""],
      [],
      ["Date", dateText],
      ["Total Strength", strength]
    ];
    
    let maxLength = 0;
    let output = [];
    let index = 0;
    for (let status in summary) {
      if(!summary[status]) continue;
      output.push([]);
      let startIndex = output.length;
      for (let employee of summary[status]) {
        let name = toName(employee);
        if(name.length > maxLength) maxLength = name.length;
        let row = ['', ++index, name];
        if(status == 17 || status == 4) row.push(employee.remark);
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

  capitalizeWords(str) {
    return str.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  
} 