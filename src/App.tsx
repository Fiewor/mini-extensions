import { useState } from "react"
import './App.css';

const Airtable = require('airtable');
const base = new Airtable({apiKey: 'keyWpmoX3WKu87slO'}).base('app8ZbcPx7dkpOnP0');
const studentTable = base('Students');
const classTable = base('Classes');

interface Data{
    name: string,
    students: string[]
}

export default function App() {
  const [user, setUser] = useState("")
  const [data, setData] = useState<Data | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value)
  }

  let currentClass: any[], currentStudent: any[]
  const getRecords = async () => {
    studentTable.select({
      filterByFormula: `(name = '${user}')`,
      view: 'Grid view'
    }).firstPage(function(err: any, records: any[]) {

        if (err) { console.error(err); return; }
        
        // use class ID to go to class DB. returns name of class and id of each student in class
        records.forEach(function(record) {
          currentClass = record.get('Classes')
          
          currentClass.forEach(function(availableClass) {
            classTable.find(availableClass, function(err: string, record: any) {
              if (err) { console.error(err); return; }
              setData(record.fields)
              // get name of class here -> record.fields.Name
              currentStudent = record.fields.Students

              // use id of students to go to student DB and retrieve names of students
              currentStudent.forEach(stud=>{
                classTable.find(stud, function(err: string, record: any) {
                  if (err) { console.error(err); return; }
                  // name of students -> record.fields.Name
                  // save where? how to output?
                });
              })
            });
          })
            
        });

      });
  }
  console.log("Data",data)

  return (
    <div className="App">
      <label htmlFor="name">Student Name: </label>
      <input type="text" value={user} onChange={onChange}/>
      <br />
      <button onClick={getRecords}>Login</button>
      
        {
          data && <p>{data.name}</p>
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