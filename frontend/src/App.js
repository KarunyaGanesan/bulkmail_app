import { useState } from "react"
import './App.css'
import axios from 'axios'
import * as XLSX from 'xlsx'

function App() {
  const [msg, setmsg] = useState('')
  const [status, setstatus] = useState(false)
  const [fileName, setFileName] = useState('No file chosen')
  const [emailCount, setEmailCount] = useState(0)
  const [emailList, setemailList] = useState('')

  const handlemsg = (event) => {
    setmsg(event.target.value)
  }

  const handlemail = (event) => {
    const file = event.target.files[0]
    
    if (file) {
      setFileName(file.name) // Set the filename to display it
    } else {
      setFileName('No file chosen') // Reset if no file chosen
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      const data = event.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetname = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetname]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" })

      setEmailCount(emailList.length);  // Set the total number of emails
      const totalemail = emailList.map((data) => { return (data.A) })
      setemailList(totalemail)
    }
    reader.readAsBinaryString(file);
  }

  const send = () => {
    setstatus(true)
    axios.post('http://localhost:2000/sendmail', { msg: msg, emailList: emailList })
      .then((data) => {
        if (data.data === true) {
          alert("Email sent!")
          setstatus(false)
        } else {
          alert("Email Failed to send")
        }
      })
  }

  return (
    <div>
      <div className="container">
        <h1>BulkMail Service</h1>
        <p>Easily send multiple emails at once</p>

        <textarea
          placeholder="Enter the email text..."
          onChange={handlemsg}
          value={msg}>
        </textarea>

        <div className="file-input-container">
          <label htmlFor="fileinput">Choose File</label>
          <input type="file" id="fileinput" onChange={handlemail}></input>
          <p id="fileName">{fileName}</p> {/* Display the file name or default message */}
        </div>

        <div id="email-count">Total Emails in the file: {emailCount}</div> {/* Display total emails */}

        <button className="send-button" onClick={send}>
          {status ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;
