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
employeeRepository.on('empty', e => {
  let dialogue = document.createElement('edit-dialogue');
  dialogue.setCancellable(false);
  document.body.appendChild(dialogue);
});
const departmentPresenter = new DepartmentPresenter();
employeeRepository.start();