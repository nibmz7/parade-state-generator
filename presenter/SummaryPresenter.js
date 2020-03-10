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

  //bad bad code 
  downloadToExcel() {
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
    for(let employee of summary[1]) {
      output.push(['', ++index, toName(employee)]);
    }
    output[0][0] = "*Present*";

    let strength = index + '/' + list.length;

    let date = new Date();
    let month = date.getMonth();
    let day = String(date.getDate()).padStart(2, '0');
    let year = date.getFullYear();
    let dateText = day + '/'+ month + '/' + year;
    let header = [
      ["SBW PLC Strength", "", ""],
      [],
      ["Date", dateText],
      ["Total Strength", strength],
      [],
    ];
    
    delete summary[1];
    for (let [status, employees] of Object.entries(summary)) {
      output.push([]);
      let startIndex = output.length;
      for (let employee of employees) {
        output.push(['', ++index, toName(employee)]);
      }
      output[startIndex][0] = `*${Status[status].fullName}*`;
    }
    XlsxPopulate.fromBlankAsync()
        .then(workbook => {
            // Modify the workbook.
            workbook.sheet(0).name("Attendance sheet");
            workbook.sheet(0).column("A").style({ bold: true, italic: true });
            workbook.sheet(0).cell("A1").value((header.concat(output)));

            workbook.outputAsync()
            .then(function (blob) {
                
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                a.download = `SBW PARADE STATE ${dateText}.xlsx`;
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
            });
        });
  }
} 

/**

let input = document.querySelector('input');
input.onchange = () => {
    let file = input.files[0];
    XlsxPopulate.fromDataAsync(file)
    .then(function (workbook) {
        
        var sheet = workbook.sheet(0);
        var rows = sheet._rows
        var result = ''
        rows.forEach(function (row) {
            row._cells.forEach(function (cell) {
                result += cell.value() + " && "
            });
            result += ' | \n'
        });

        console.log(result);

    });
};

let button = document.querySelector('button');
button.onclick = e => {
     
      XlsxPopulate.fromBlankAsync()
        .then(workbook => {
            // Modify the workbook.
            workbook.sheet(0).name("Attendance sheet");
            workbook.sheet(0).column("A").style({ bold: true, italic: true });
            workbook.sheet(0).cell("A1").value([
                ["SBW PLC Strength", "", ""],
                [],
                ["Date", "22/2/2020"],
                ["Total Strength", "37/51"],
                [],
                ["*Present*", "1" ,"DX10 Jiang Zonye"],
                ["", "2", "DX6 BOB"],
                ["", "3", "dffdsfds"]
            ]);

            workbook.outputAsync()
            .then(function (blob) {
                
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                a.download = "out.xlsx";
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
            });
        });
      
}

**/