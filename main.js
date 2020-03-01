import AttendanceDb from './logic/AttendanceDb.js';
import Employee from './logic/Employee.js';
import DropdownMenu from './ui/DropdownMenu.js';
import ViewPager from './ui/ViewPager.js';
import DepartmentFragment from './ui/DepartmentFragment.js';
customElements.define('department-fragment', DepartmentFragment);
customElements.define('view-pager', ViewPager);
customElements.define('dropdown-menu', DropdownMenu);

const viewpager = document.querySelector('view-pager');
const dropdownMenu = document.querySelector('dropdown-menu');

const db = new AttendanceDb();

db.on('ready', () => {
  db.getDepartments();
});

db.on('employees-added', e => {
  let departments = e.detail;
  for(let [department, employees] of Object.entries(departments)) {

    let fragment = viewpager.getPage(`department-fragment[name='${department}']`);

    if(!fragment) {
      fragment = document.createElement('department-fragment');
      fragment.setAttribute('name', department);
      viewpager.add(fragment);
      dropdownMenu.add(department);
    }
    
    fragment.addEmployees(employees)
  }
});

db.on('department-added', e => {
    let fragment = document.createElement('department-fragment');
    fragment.setAttribute('dep', e.detail);
    viewpager.add(fragment);
    dropdownMenu.add(e.detail);
    //db.getEmployees(department);
});

indexedDB.deleteDatabase('attendance_db').onsuccess = e => {
  db.initialize();
}

const button = document.querySelector('#save');
const input = document.querySelector('textarea');

button.onclick = e => {
  let lol = `LCP, NUR ILYAS, SIGNAL WING\n
LCP, JOHN DOE, MWP BRANCH\n
PTE, BILLIE JOE, LOG BRANCH`;
  let employees = Employee.toList(lol);
  db.addEmployees(employees);
}

dropdownMenu.addEventListener("onChange", e => {
  let index = e.detail.next;
  viewpager.setCurrentItem(index);
});

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