import AttendanceDb from '../logic/AttendanceDb.js';
import Employee from '../logic/Employee.js';
import Dialogue from './Dialogue.js';

const template = `
    <style>
        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        textarea {
            min-height: 100px;
        }
        button {
            margin-top: 30px;
            height: 50px;
        }
    </style>

    
    <div class="container">
        <p id="content"></p>

        <textarea></textarea>

        <button id="save">Save me</button>  
    </div>
`;

export default class EditDialogue extends Dialogue {

    constructor() {
        super(template);

        const db = AttendanceDb.getInstance();
        const button = this.shadowRoot.getElementById('save');
        const input = this.shadowRoot.querySelector('textarea');
        
        button.onclick = e => {
            let lol = `LCP, NUR ILYAS, SIGNAL WING\n
            LCP, JOHN DOE, MWP BRANCH\n
            PTE, BILLIE JOE, LOG BRANCH`;
            let employees = Employee.toList(lol);
            db.addEmployees(employees);
        }
    }
}