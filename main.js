window.onload = () => {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    let root = document.querySelector(':root');
    root.style.height = h;
    root.style.width = w;
    root.style.fontSize = Math.round(h/100);
 }

import EmployeeRepository from './logic/EmployeeRepository.js';
import Employee from './logic/Employee.js';
import DropdownMenu from './ui/DropdownMenu.js';
import ViewPager from './ui/ViewPager.js';
import DepartmentFragment from './ui/DepartmentFragment.js';
import EditDialogue from './ui/EditDialogue.js';
import WCButton from './ui/WCButton.js';
import EmployeeDialogue from './ui/EmployeeDialogue.js';
import DepartmentPresenter from './presenter/DepartmentPresenter.js';
import SummaryView from './ui/SummaryView.js';

customElements.define('wc-button', WCButton);
customElements.define('department-fragment', DepartmentFragment);
customElements.define('view-pager', ViewPager);
customElements.define('dropdown-menu', DropdownMenu);
customElements.define('edit-dialogue', EditDialogue);
customElements.define('employee-dialogue', EmployeeDialogue);
customElements.define('summary-view', SummaryView);

document.getElementById('edit').onclick = e => {
  let dialogue = document.createElement('edit-dialogue');
  dialogue.isCancellable = true;
  document.body.appendChild(dialogue);
}
document.getElementById('summary').onclick = e => {
    document.querySelector('summary-view').show();
}

const employeeRepository = EmployeeRepository.getInstance();
const departmentPresenter = new DepartmentPresenter();
employeeRepository.start();

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