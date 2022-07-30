import React, { useState, useEffect } from "react";

//create your first component
const Home = () => {
	//useStates
	const [task, setTask] = useState({
		label: "",
		done: false
	})
	const [listTask, setListTask] = useState([])
	//********************************************* */

	//Url Data
	let urlBase = "https://assets.breatheco.de/apis/fake/todos/user"
	let urlUser = "ibrahim"
	//********************************************* */

	//Add a task to list with APIs
	const addTaskToList = async (event) =>{
		try{
			//Get task on keypress Enter
			if(event.key === "Enter"){
				//Check that task isn't empty
				if(task.label.trim() !== ""){
					//Get API
					let response = await fetch(`${urlBase}/${urlUser}`, 
					{
						method:"PUT",
						headers: {
							"Content-Type":"application/json"
						},
						//push listTask and the current task into the API
						body: JSON.stringify([...listTask, task])
					})
					//Check if API is ok, then clear task and update listTask
					if(response.ok){
						setTask({label:"", done:false})
						getTodos()
					}
				}
			}
		}catch(error){
			console.log(`Explote este es el error: ${error}`)
		}
	}
	//******************************************* */

	//Update task value as it writes input
	const handleTaskValue  = (givenTask) =>{
		setTask({
			...task,
			[givenTask.target.name]: givenTask.target.value
		})
	}
	//******************************************* */

	//Get data from API and push it into the task lisk
	const getTodos = async () => {
		try{
			//fetch and push data into task lisk
			let response = await fetch(`${urlBase}/${urlUser}`)
			if(response.ok){
			let data = await response.json()
				if(response.status !== 404){
					setListTask(data)
				}
			//if there is no data to push, post a new, empty list. Then recurse
			}else{
				let responseTodos = await fetch(`${urlBase}/${urlUser}` , 
				{
					method:"POST",
					headers: {
						"Content-Type":"application/json"
					},
					body: JSON.stringify([])
				})
				if(responseTodos.ok){
					getTodos()
				}
			}
		//Catch error
		}catch(error){
			console.log(`Explote este es el error: ${error}`)
		}
	}
	//******************************************* */

	//Delete task from list, currently doesn't interact with the API
	const deleteTask = async (id) =>{
		let newList = listTask.filter((item, index) => {
			if(id !== index){
				return item
			}
		})

		try {
			let response = await fetch(`${urlBase}/${urlUser}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newList)
			})
			if(response.ok){
				getTodos()
			}
		} catch (error) {
			console.log(`Explote este es el error: ${error}`)
		}
	}
	//******************************************* */

	useEffect(()=>{
		getTodos()
	}, [])

	return (
		<>
		<div className="container d-flex justify-content-center">
			<div className="row">
				<div className="col-12 d-flex justify-content-center">
				<h1 className="fancy topText">TODOS</h1>
				</div >
				{/* This input gets data for task */}
				<div className="col-12">
					<input 
						className="fancy inputText"
						onChange={handleTaskValue} 
						onKeyDown={addTaskToList} 
						name="label" value={task.label} 
						placeholder="What is on your mind?" 
						type="text"
					/>
				</div>
				<ul>
					{listTask.map(
						(element, index) => {
						return	(
							<div className="col-12 fancy inputText d-flex justify-content-between py-1" key={index}>
								{element.label}
								{/* This button deletes a task upon click */}
								<button className=" fancy icon-li px-5" onClick={() => deleteTask(index)}>X</button>
							</div>	
						)}
					)}
				</ul>
				<div className="col-12 d-flex justify-content-left fancy fs-1">
					Items on list: {listTask.length}
				</div>		
				
			</div>
		</div>
		
		</>
	);
};

export default Home;
