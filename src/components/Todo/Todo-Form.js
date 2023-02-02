
import { getAuth } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { getDatabase, set, ref} from "firebase/database";

//Function input data and update data 
export function TodoForm(props){
    const user = getAuth().currentUser;
    const userEUID = user.displayName;
    const [input, setIput]= useState(props.edit ? props.edit.value :'');
    const inputRef = useRef(null)
    const db =getDatabase()
    const todoid = userEUID+"_"+ Date.now()
  
    useEffect(() =>{
        inputRef.current.focus()
    })
    
    const handleChange =e=>{
        setIput(e.target.value)
    }
  //set todo databse
    const handleSubmit=e=>{
        e.preventDefault();
        props.onSubmit({
            id: todoid,
            isComplete: false,
            text: input
        })
        if (!input || /^\s*$/.test(input)){
          return
        }
        else{
        set(ref(db, "todos/" + userEUID + "/" + todoid),{
            id: todoid,
            isComplete: false,
            text: input
        })
      }

        setIput('')
  }
  //set new todo text
    const handleSubmitEdit=e=>{
      e.preventDefault();
      props.onSubmit({  
          text: input
      })

      setIput('')
  }
    return(
        <form onSubmit={handleSubmit} className='todo-form'>
      {props.edit ? (
        <>
          <textarea
            placeholder='Update your item'
            value={input}
            onChange={handleChange}
            name='text'
            ref={inputRef}
            className='todo-input edit'
          />
          <button onClick={handleSubmitEdit} className='todo-button edit'>
            Update
          </button>
        </>
      ) : (
        <>
          <textarea
            placeholder='Add a todo'
            value={input}
            onChange={handleChange}
            name='text'
            className='todo-input'
            ref={inputRef}
          />
          <button onClick={handleSubmit} className='todo-button'>
            Add todo
          </button>
        </>
      )}
    </form>
    )
}