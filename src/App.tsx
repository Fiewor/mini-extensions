import { useState } from "react"
import './App.css';

const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.REACT_APP_API_KEY}).base(process.env.REACT_APP_BASE_KEY);
const studentTable = base('Students');
const classTable = base('Classes');
// let arr: string[] = []

interface Data{
  name: string,
  students: string[]
}

export default function App() {
  const [user, setUser] = useState("")
  // const [data, setData] = useState<Data | null>(Data[])
  const [arr, setArr] = useState([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value)
  }

  let currentClass: string[], currentStudent: string[]

  const getRecords = async () => {
    studentTable.select({
      filterByFormula: `(name = '${user}')`,
      view: 'Grid view'
    }).firstPage(function(err: string, records: any[]) {

        if (err) { console.error(err); return; }
        console.log("records",records);
        
        // use class ID to go to class DB. returns name of class and id of each student in class
        records.forEach(function(record) {
          currentClass = record.get('Classes')
          console.log("currentClass",currentClass);
          
          currentClass.forEach(function(availableClass) {
            classTable.find(availableClass, function(err: string, record: any) {
              if (err) { console.error(err); return; }
              console.log("record.fields",record.fields)
              // get name of class here -> record.fields.Name
              setArr(record.fields.Name)
              currentStudent = record.fields.Students
              console.log("currentStudent",currentStudent);
              
              // use id of students to go to student DB and retrieve names of students
              currentStudent.forEach(stud=>{
                classTable.find(stud, function(err: string, record: any) {
                  if (err) { console.error(err); return; }
                  // name of students -> record.fields.Name
                  // setArr(record.fields.Name)
                  console.log("studentName",record.fields.Name);
                });
              })
            });
          })
            
        });

      });
  }

  return (
    <div className="App">
      <div>
        <label htmlFor="name">Student Name: 
          <input type="text" value={user} onChange={onChange}/>
        </label>
      </div>
      <button onClick={getRecords}>Login</button>
      
        {
          // arr && arr.map((a, index) => {
          //   return (
          //     <p key={index}>{a}</p>
          //   )
          // })
          
          // for (const name in object) {
          //   if (Object.prototype.hasOwnProperty.call(object, name)) {
          //     const element = object[name];
          //     return(
          //       <p>name</p>
          //     )
          //   }
          // }
        } 
        
    </div>
  );
}