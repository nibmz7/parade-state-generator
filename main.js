import AttendanceDb from './logic/AttendanceDb.js';
import Employee from './logic/Employee.js';

const listener = {
  emit: function(type, data) {
    this.type(data);
  },
  on: function(type, callback) {
    this.type = callback;
  }
}

const db = new AttendanceDb(listener);

listener.on('complete', data => {
  console.log('completed');
  db.getDepartments();
});

db.initialize();

const button = document.querySelector('button');
const input = document.querySelector('textarea');

button.onclick = e => {
  let employees = Employee.toList(input.value);
  db.addEmployees(employees);
}









/**

import DropdownMenu from './ui/DropdownMenu.js';
import ViewPager from './ui/ViewPager.js';
customElements.define('view-pager', ViewPager);
customElements.define('dropdown-menu', DropdownMenu);

const dropdownMenu = document.querySelector('dropdown-menu');

dropdownMenu.addEventListener("onChange", e => {
  console.log(e.detail.next);
});

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