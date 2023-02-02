import Modal from "react-modal";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getDatabase, set, ref } from "firebase/database";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import { getAuth, auth } from "firebase/auth";
import MultiSelect from "../Create-project/MultiSelect";
import "./EditMeeting.css";

// Exports data to database
export default function ({ isOpen, onClose }) {
  const user = getAuth().currentUser;
  const userEUID = user.displayName;
  const [meetDate, setMeetDate] = useState(new Date());
  const [meetEndDate, setMeetEndDate] = useState(new Date());
  const [meetGuests, setGuests] = useState([]);
  const [meetProj, setProj] = useState(" ");
  const [meetTime, setTime] = useState("10:00");
  const [meetTitle, setTitle] = useState(" ");
  const [meetNotes, setNotes] = useState(" ");

  let meetDateISO = meetDate.toISOString();
  let meetEndDateISO = meetEndDate.toISOString();

  const startDate = meetDateISO.substring(0, 10);
  const endDate = meetEndDateISO.substring(0, 10);
  const meetID = startDate + "_" + meetTime + "_" + meetProj;

  const [error, setError] = useState(null);

  // use MultiSelect to select students (guests)
  function handleStudentSelect(ev) {
    // take ev paramenter and set meeting guests
    let studentList = [];
    for (let i in ev) {
      studentList.push(ev[i].value);
    }
    setGuests(studentList);
  }

  // add meeting to database
  const db = getDatabase();
  function onSubmit() {
    try {
      if (startDate > endDate) {
        throw Error("Invalid date range");
      } else if (meetProj == 0) {
        throw Error("Enter project name");
      } else if (meetTitle == 0) {
        throw Error("Enter title");
      } else {
        set(ref(db, "calendars/" + userEUID + "/" + meetID), {
          date: startDate,
          endDate: endDate,
          host: userEUID,
          guests: meetGuests,
          project: meetProj,
          time: meetTime,
          title: meetTitle,
          notes: meetNotes,
          type: "meeting",
        }); // set

        // add meeting to guest calendars in database
        for (var i = 0; i < meetGuests.length; i++) {
          set(ref(db, "calendars/" + meetGuests[i] + "/" + meetID), {
            date: startDate,
            endDate: endDate,
            host: userEUID,
            guests: meetGuests,
            project: meetProj,
            time: meetTime,
            title: meetTitle,
            notes: meetNotes,
            type: "meeting",
          });
        } // for()
        onClose();
      } // else
    } catch (err) {
      console.log(err.code);
      setError(err.message);
    }
  } //onSubmit()

  function cancelSubmit() {
    onClose();
  } // cancelSubmit()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaHideApp={false}
      style={{
        content: {
          position: "fixed",
          borderRadius: "20px",
          border: "10px solid #ccc",
          top: "55%",
          left: "50%",
          msTransform: "translate(-50%, -50%)",
          transform: "translate(-50%, -50%)",
          height: "615px",
          width: "500px",
        },
      }}
    >
      {error && (
        <p
          style={{
            marginTop: "10px",
            fontSize: "20px",
            color: "red",
          }}
        >
          {error}
        </p>
      )}
      <div
        className="w-100 text-center mt-2 text-danger"
        id="errorMessage"
      ></div>

      <div className="xBtn">
        <Link to="/Calendar" className="xLink" onClick={onClose}>
          <i className="fas fa-times xButton" />
        </Link>
      </div>
      <Container className="d-flex align-item-center justify-content-center">
        {/* <DatePickerButton /> */}
        <i className="fas fa-times xButton" />

        <form onSubmit={onSubmit} style={{ margin: "50px" }}>
          <div>
            <h6>Host</h6>
            <input placeholder={userEUID} value={userEUID} disabled="true" />
          </div>
          <div>
            <h6>Guests</h6>
            <MultiSelect onChange={(e) => handleStudentSelect(e)} />
          </div>
          <div>
            <h6>Start Date</h6>
            <DatePicker
              selected={meetDate}
              onChange={(date) => setMeetDate(date)}
            />
            {/* <Datetime value={meetDate} onChange={date => setMeetDate(date)} /> */}
          </div>
          <div>
            <h6>End Date</h6>
            <DatePicker
              selected={meetEndDate}
              onChange={(date) => setMeetEndDate(date)}
            />

            {/* <Datetime value={meetEndDate} onChange={date => setMeetEndDate(date)} /> */}
          </div>
          <div>
            <h6>Time</h6>
            <TimePicker
              selected={meetTime}
              onChange={(time) => setTime(time)}
              value={meetTime}
              clearIcon={null}
            />
          </div>
          <div>
            <h6>Project</h6>
            <input
              placeholder="Project"
              value={meetProj}
              onChange={(e) => setProj(e.target.value)}
            />
          </div>
          <div>
            <h6>Title</h6>
            <input
              placeholder="Title"
              value={meetTitle}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <h6>Notes</h6>
            <textarea
              placeholder="Notes"
              value={meetNotes}
              style={{ textAlign: "left", fontWeight: "100" }}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button class="addSubmit" onClick={onSubmit}>
            Submit
          </button>
          <button class="addCancel" onClick={cancelSubmit}>
            Cancel
          </button>
        </form>
      </Container>
    </Modal>
  );
}
