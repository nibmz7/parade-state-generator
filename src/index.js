import EmployeeRepository from './logic/EmployeeRepository.js';
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

const addButton = document.getElementById('add');
const fragmentHolder = document.querySelector('.fragment-holder');
fragmentHolder.onscroll = e => {
  if(fragmentHolder.scrollTop > 0) {
    addButton.style.right = '-50px';
  } else {
    addButton.style.right = '20px';
  }
}

addButton.onclick = e => {
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