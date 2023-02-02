//import React, { Component } from 'react';
import { Button } from '../Dashboard/Button';
import { useState, useEffect } from 'react';
// import '../LiveChat/ChatPage.css';
import './Milestones.css';
import Navbar from '../Dashboard/Navbar';
import data from '../Dashboard/data';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import Comments from "../Comments/Comments";
import FileUpload from "../FileUpload/FileUpload";
import { getAuth } from "firebase/auth";
import { getDatabase, get, child, ref, set, push } from "firebase/database";
import InputField2 from '../Login/InputField2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CardItem from '../Dashboard/CardItem';
import '../Dashboard/Cards.css';
import MilestoneItem from './MilestoneItem';
// import { ChatSide } from './ChatSide';
// import { ChatMain } from './ChatMain';
import _, { map, sortBy } from 'underscore';

// Gets current user
const dbRef = ref(getDatabase());
const db = getDatabase();

const user = getAuth().currentUser;
var name = "No user";
var currUserID;



function onSubmit() {



}



function compareNumbers(a, b) {
    if (a.urgency > b.urgency)
        return 1;
    else if (a.urgency < b.urgency)
        return -1;
    else if (a.urgency === b.urgency)
        return 0;
    return 0;
}

var key1;


function p2Num(p) {
    if (p == "Low")
        return 0;
    else if (p == "Medium")
        return 1;
    else if (p == "High")
        return 2;
    else if (p == "Critical")
        return 3;
}

const SortedMilestones = ({ data }) => data ?
    <h2>{data}</h2>
    : <h2>There was no result!</h2>

function MilestonesBlock({ isVisible, project_id }) {
    var first = true;
    var sorted = [{

    }];
    var totalRendered = 0;
    const rows = [];
    let columns = [];

    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [project, setProject] = useState({});

    const [projects, setProjects] = useState([]);
    const [display, setDisplay] = useState(false);
    const [projectID, setProjectID] = useState("");
    const [milestoneTitle, setMilestoneTitle] = useState("");
    const [milestones, setMilestones] = useState([]);
    const [milestonesOrdered, setMilestonesOrdered] = useState([]);
    const [addingM, setAddingM] = useState(false);
    const [checked, setChecked] = useState(true);
    
    var _loading = true;

    const [_date, setDate] = useState(new Date);

    const [projInfo, setProjInfo] = useState({
        name: "",
        description: "",
        date: new Date(),
        tasks: [""], //tasks is an array of strings
        students: [] //list of involved students' euids as an array of strings 
    });


    const [p0, setP0] = useState([]);
    const [p1, setP1] = useState([]);
    const [p2, setP2] = useState([]);
    const [p3, setP3] = useState([]);
    const [allMiles, setAllMiles] = useState(p0, p1, p2, p3);
    const [mError, setmError] = useState("");
    const [inp1, setInp1] = useState("");
    const [inp2, setInp2] = useState("");
    const [inp3, setInp3] = useState("");
    const [dropdown, setDropdown] = useState({ value: "Low" });
    const [sortOrder, setSortOrder] = useState(true);  // 1 for [High → Low], 0 for [Low → High]
    // var tempMiles = [{}, {}, {}, {}];
    var tempMiles = [p0, p1, p2, p3];
    // var tempMiles = new Array(4);


    function selectDate(e) {
        let updatedValue = { date: e };
        setDate(e);
        setProjInfo({ ...projInfo, ...updatedValue });
    }


    const closeInput = () => {
        setAddingM(false);
        console.log("unsorted:");
        console.log(tempMiles);
        console.log("sorted:");
        // console.table(tempMiles);
        // _.sortBy(tempMiles)
        // console.log(tempMiles[0][0].key);
        tempMiles.map((parent, i) => {
            parent.map((item, j) => {
                console.log(i + ", " + item.name);
            });
        });

        //   console.log(inner);

        tempMiles.forEach((parent, i1) => {
            // parent.forEach((item) => {
            //     console.log(item);
            // });
            // console.log(i1);
            // console.log(parent);
            // console.log(parent.length);

            // if (i1 === 0) {
            //     console.log(parent[0]);

            // }
        });
    }

    const handleClickSort = event => {
        setSortOrder(+!sortOrder);  // Swap sortOrder between zero and one.
    }

    const handleChange1 = event => {
        setInp1(event.target.value);
    };
    const handleChange2 = event => {
        setInp2(event.target.value);
    };

    const handleChangeDate = event => {
        setDate(event.target.value);
    };
    const handleChange3 = event => {
        setInp3(event.target.value);
    };
    const changeDropdown = event => {
        setDropdown({ value: event.target.value });
    };
    var projPath = "";
    const location = useLocation();
    const fullDataPath = location.pathname;
    const dataPath = fullDataPath.replace("/Projects/", '');
    if (project_id != "") {
        projPath = "projects/" + project_id + "";
        // alert(projPath);
    }
    // alert(project_id);
    const navigate = useNavigate();
    function isEmptyOrSpaces(str) {
        // alert(str.toString());
        return str === null || str.toString().match(/^ *$/) !== null;
    }
    function readMilestones() {
        // alert(milestones[0].name);
    }
    function addMilestone(p_key, p_name, m_name, m_description, m_date, m_complete, m_priority) {
        const user = getAuth().currentUser;
        // alert(project_id);
        if (m_description === '') {
            alert('null');
            m_description = "\n";

        }
        if (user !== null) {
            const email = user.email;
            const displayName = user.displayName; // (euid)
        }
        else {
            console.log("No User");

        }
        if (addingM) {
            // alert("1");

            if (isEmptyOrSpaces(m_name) && m_date === null) {

                setmError("Please add a title and date for the milestone.");
            }
            else if (isEmptyOrSpaces(m_name)) {

                setmError("Please add a title for the milestone.");
            }
            else if (m_date === null) {

                setmError("Please add a date for the milestone.");
            }
            else {
                let dbRefMilestones = ref(db, "projects/" + project_id + "/milestones/");
                push(dbRefMilestones, {
                    name: m_name,
                    user_id: user.displayName,
                    description: m_description,
                    date: _date.toDateString(),
                    complete: false,
                    priority: m_priority,
                    urgency: p2Num(m_priority)
                }).then(() => {
                    // alert(m_name + " pushed");
                    // navigate("/Projects/" + p_name); //refresh page after adding new milestone 
                    //console.log("navigating");
                    window.location.reload();
                    setAddingM(false);
                });
            }
        }
        else setAddingM(true);
    }






    useEffect(() => {

        totalRendered = 0;
        if (location.state != null) {
            key1 = location.state.key;
        }

        // Get/Read Milestones
        var unsubcribe = getAuth().onAuthStateChanged(function (user) {
            if (user) {
                get(child(dbRef, "projects/" + location.state.key + "/milestones"))
                    .then((snapShot) => {
                        if (snapShot.exists()) {

                            // Read project milestones
                            snapShot.forEach(userShot => {
                                const curr = userShot.val();

                                let mile1 = {
                                    key: userShot.key,
                                    name: curr.name,
                                    desc: curr.description,
                                    date: curr.date,
                                    done: curr.complete,
                                    user: curr.user_id,
                                    src: "images/img-1.png",
                                    priority: curr.priority,
                                    urgency: curr.urgency,
                                    complete: curr.complete
                                };
                                var i = parseInt(curr.urgency);
                                setMilestones((miles) => [...miles, mile1]);

                                // Add curr milestone to correct list (P0 = low, P1 = medium, etc.)
                                tempMiles[i].push(mile1);


                                // if (i == 0) {
                                //     setP0((miles) => [...miles, mile1]);
                                // }
                                // else if (i == 1) {
                                //     setP1((miles) => [...miles, mile1]);
                                // }
                                // else if (i == 2) {
                                //     setP2((miles) => [...miles, mile1]);
                                // }
                                // else if (i == 3) {
                                //     setP3((miles) => [...miles, mile1]);
                                // }
                                // console.log(tempMiles);

                                setMilestonesOrdered(tempMiles);
                            });
                        }
                        // _loading = false;
                        setLoading(false);
                    });
                // sorted = _.sortBy(milestones, 'priority');
                // alert(milestones[0].priority +", " + sortedObjs[0].priority);
                setAllMiles([p0, p1, p2, p3]);
                // setMilestones(_.sortBy())
                // setLoading(false);

                // console.log(tempMiles[0]);

            }

        })
    }, []);
    return (
        <>
            <div className='m_Block'>
                {/* {loading ? <>Loading</> : <>Not Loading</>} */}
                {addingM ?  // Show input fields after clicking 'add milestone' button.
                    <div className='addingMContainer'>
                        <div className='addingM'>
                            <div className='labels'>
                                <div className="xBtn3" onClick={closeInput}>
                                    <i className="fas fa-times xButton2" />
                                </div>

                                <label htmlFor="milestoneName" className='label3'>
                                    Title
                                </label>
                                <input
                                    type={"text"}
                                    id={"titleInp"}
                                    name={"titleInp"}
                                    onChange={handleChange1}
                                    value={inp1}
                                />  <br />


                                <div className='dates'>
                                    <label htmlFor='dateInp' className="label4">
                                        Date
                                    </label>
                                    <DatePicker /* using datepicker for selecting duedate from calendar */
                                        id="dateInp"
                                        name="dateInp"
                                        className="datePicker"
                                        selected={_date}
                                        onChange={(d) => setDate(d)}
                                    />
                                </div>


                                <br />
                                <label htmlFor="milestoneDesc" className='label3'>
                                    Description
                                </label>
                                <input
                                    type={"text"}
                                    id={"descInp"}
                                    name={"descInp"}
                                    onChange={handleChange3}
                                    value={inp3}
                                />
                                <br />

                                <label htmlFor="priorities" className='label3'>Priority</label>
                                <select name="priorities" id="priorities" className='priorities0'
                                    value={dropdown.value}
                                    onChange={(e) => { changeDropdown(e) }}
                                >
                                    <option value="Critical">       Critical </option>
                                    <option value="High">           High     </option>
                                    <option value="Medium">         Medium   </option>
                                    <option value="Low">            Low      </option>
                                </select>

                                <div className='mErrorText'>
                                    {mError}
                                </div>
                            </div>  {/* labels (end)*/}
                        </div>      {/* addingM (end)*/}
                    </div> :
                    <></>   // Otherwise hide input fields
                }


                <div className='buttonMilestone'>
                    <button className='bt milestoneBtn'
                        onClick={() => {
                            if (addingM)
                                addMilestone(project_id, '', inp1, inp3, _date.value, '', dropdown.value);
                            else
                                setAddingM(true);
                        }
                        }
                    >
                        Add milestone
                    </button>
                </div>
                
                {loading ?
                    <div className='errorNoMiles'>Loading...</div>                      // Not done loading database
                :   milestones.length ?                             
                        <></>
                    :   <div className='errorNoMiles'>No milestones available.</div>    // No milestones (and already loaded database)
                }
                <div className='mainWrap'>
                    {milestones.length  ?
                        (
                            <div className='noSelect centered'>
                            <span className='sortByText'>
                                Sort by: {"  "}
                                <a onClick={handleClickSort}>
                                    {sortOrder ?
                                        <span className='hiLo'>High → Low</span> :
                                        <span className='hiLo'>Low → High</span>
                                    }
                                </a>
                        </span>
                        <span className='checkboxContainer'>
                            <input type='checkbox'
                                id='showAllBox' name='showAllBox'
                                className='showCheckbox'
                                checked={checked}
                                onChange={() => { setChecked(!checked) }} />

                            <label for='showAllBox'>Show Completed</label>
                        </span>

                        </div>
                        ):
                            
                            <>{}</>
                    }


                    {/* Container for displaying user milestones */}
                    <div id="milestoneContainer">
                        <div className='milestoneWrapper'>
                            <div className='contentWrapper'>

                                {
                                    !milestones.length ?
                                        <></> :
                                        sortOrder ?
                                            <ul className='noBullets'>
                                            {(      // High → Low
                                                    tempMiles.slice(0).reverse().map((parent, i) => {

                                                        return (parent.map((item, j) => {
                                                            totalRendered++;
                                                            if (item.complete == false || checked) {

                                                                return (<li><MilestoneItem
                                                                    key={item.key}
                                                                    title={item.name}
                                                                    date={item.date}
                                                                    m_key={item.key}
                                                                    description={item.desc}
                                                                    projectID={project_id}
                                                                    priority={item.priority}
                                                                    complete={item.complete}
                                                                /></li>);
                                                            }
                                                        }))
                                                    })
                                                )}
                                            </ul> :
                                            // Low → High
                                            <ul className='noBullets'>
                                            {(   // High → Low
                                                    tempMiles.slice(0).map((parent, i) => {
    
                                                        return (parent.map((item, j) => {
                                                            totalRendered++;
                                                            // console.log(totalRendered + ": " + i + ", " + j);
                                                            if (item.complete == false || checked) {
    
                                                                return (<li><MilestoneItem
                                                                    key={item.key}
                                                                    title={item.name}
                                                                    date={item.date}
                                                                    m_key={item.key}
                                                                    description={item.desc}
                                                                    projectID={project_id}
                                                                    priority={item.priority}
                                                                    complete={item.complete}
                                                                /></li>);
                                                            }

                                                        }))
                                                    })
                                            )}</ul>
                                }
                            </div>




                            {/* { ( () => 
                {
                    if (milestones.length == 0) { 
                            return (<h4>No milestones available.</h4>)
                    } else {
                        if (sortOrder) {    // High → Low
                            tempMiles.slice(0).reverse().map((parent, i) => {
                                return (parent.map((item, j) => {
                                    // console.log(i + ", " + item.name);
                                    return (<MilestoneItem
                                        key={j}
                                        title={item.name}
                                        date={item.date}
                                        m_key={item.key}
                                        description={item.desc}
                                        projectID={project_id}
                                        priority={item.priority}
                                    />);
                                }))
                            })
                        } else {    // Low → High
                            tempMiles.slice(0).map((parent, i) => {
                                return (parent.map((item, j) => {
                                    // console.log(i + ", " + item.name);
                                    return (<MilestoneItem
                                        key={j}
                                        title={item.name}
                                        date={item.date}
                                        m_key={item.key}
                                        description={item.desc}
                                        projectID={project_id}
                                        priority={item.priority}
                                    />);
                                }))
                            })
                        }
                    }
                }
            )} */}

                        </div>
                    </div>
                </div>

            </div>

        </>
    );
}
export default MilestonesBlock;