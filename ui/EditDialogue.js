import AttendanceDb from '../logic/AttendanceDb.js';
import Employee from '../logic/Employee.js';
import Dialogue from './Dialogue.js';

const TEXT_HINT = 
  `RANK, NAME, DEPARTMENT\n
CPL, Bob Jr, KKK Branch
MAJ, James Bond, ZZZ Branch
LCP, John Doe, XXX Branch
PTE, William Baker, AAA Branch
`;

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
       
        wc-button {
            margin-top: 20px;
            --button-font-size: 1rem;     
            --button-padding: 10px;
        }
        
        p {
          margin: 10px 0;
        }

        textarea {
            font: inherit;
            margin: 15px 0;
            outline: none;
            border: 3px solid;
            border-color: #b9b9b9;
            border-radius: 3px;
            padding: 5px;
            font-size: 0.8rem;
            transition: border-color .2s;
        }

        textarea:focus {
            animation: glow 1.5s infinite;
        }
            
        @keyframes glow {
            0% { border-color: #b9b9b9; }
            50% { border-color: #ED4C67; }
            100% { border-color: #b9b9b9; }
        }
    </style>

    
    <div class="container">
        <p>Add new personnels</p>

        <textarea placeholder="${TEXT_HINT}"></textarea>

        <wc-button id="save">Save</wc-button>  
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