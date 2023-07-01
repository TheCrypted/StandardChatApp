
import io from "socket.io-client"
import {Message} from "../components/Message.jsx";
import {useEffect, useRef, useState} from "react";

const socket = io.connect("http://localhost:3030")
export const Home = () => {
	const [messages, setMessages] = useState([])
	const [user, setUser] = useState('')
	const [users, setUsers] = useState([])
	const [otherUserTyping, setOtherUserTyping] = useState(null)
	const [room, setRoom] = useState("Room1")
	let scrollRef = useRef()
	const inputRef = useRef();
	const userRef = useRef();
	function setUserStart(e){
		e.preventDefault()
		setUser(userRef.current.value)
	}
	function changeUserRoom(room){
		setRoom(room)
		socket.emit("changeRoom", {room, user})
	}
	function userTyping(){
		if(inputRef.current.value === ""){
			socket.emit("userDoneTyping",{
				user
			})
			return;
		}
		socket.emit("userTyping",{
			user
		})
	}
	function sendMessage(e){
		e.preventDefault();
		if(inputRef.current.value === ""){
			return;
		}
		socket.emit("sendMessage", {
			message: inputRef.current.value,
			user
		})
		socket.emit("userDoneTyping",{
			user
		})
		const updatedMessages = [
			...messages,
			{
				message: inputRef.current.value,
				user: user,
				received: false,
			},
		];
		setMessages(updatedMessages);
		inputRef.current.value = ""
	}
	useEffect(()=>{
		const receiveMessage = (data) => {
			let message = data.message;
			setMessages((prevMessages) => [
				...prevMessages,
				{
					message,
					user: data.user,
					received: true,
				},
			]);
			console.log(messages);
		};

		const otherUserTyping = (data) => {
			setOtherUserTyping(data.user)
		}
		const otherUserDoneTyping = (data) => {
			setOtherUserTyping(null)
		}

		const userChange = (data)=>{
			setUsers(data.users)
			console.log(data.users)
		}

		socket.on("receiveMessage", receiveMessage);
		socket.on("otherUserTyping", otherUserTyping);
		socket.on("otherUserDoneTyping", otherUserDoneTyping);
		socket.on("userOnline", userChange)
		socket.on("userOtherDisconnected", userChange)

		return () => {
			socket.off("receiveMessage", receiveMessage);
			socket.off("otherUserTyping", otherUserTyping);
			socket.off("otherUserDoneTyping", otherUserDoneTyping);
			socket.on("userOnline", userChange)
			socket.on("userDisconnected", userChange)
		};
	}, [socket])

	useEffect(()=>{
		const cleanup = () => {
			socket.emit("userDisconnected", {user})
		}
		window.addEventListener("beforeunload", cleanup)
		return () => {
			window.removeEventListener("beforeunload", cleanup)
		}
	}, [user])

	useEffect(()=>{
		scrollRef.current.scrollTop = scrollRef.current.scrollHeight
	}, [messages, otherUserTyping])

	return (
		<>
			{!user && <div className="w-full h-full absolute bg-black bg-opacity-70 z-10 flex items-center justify-center">
				<div className="w-1/4 rounded-xl p-3 shadow-xl h-1/5 bg-zinc-800 text-white font-semibold text-xl">
					Enter name:
					<form className="w-full h-full flex  items-center">
						<input ref={userRef} type="text" className="w-[80%] h-2/6 bg-zinc-900 focus:outline-none pl-2" placeholder="Enter name here"/>
						<button type="submit" className="w-[20%] h-2/6 bg-zinc-950" onClick={(e) => {
							setUserStart(e)
						}
						}>Submit
						</button>
					</form>
				</div>
			</div>}
			<div style={{backgroundImage: "url(https://i.pinimg.com/originals/1a/04/69/1a046940247ca498deffecad4b839fc8.jpg)"}} className="flex items-center justify-center bg-cover w-full h-full">
				<div className="bg-zinc-800 bg-opacity-60 backdrop-blur-2xl rounded-2xl h-5/6 w-5/6 grid grid-cols-[23%_54%_23%] shadow-2xl">
					<div className="rounded-l-2xl overflow-y-auto p-3">
						{
							users.map((user, index)=>{
								return (
									<div key={user} className="mb-2 shadow-xl w-full h-[10%] bg-zinc-950 bg-opacity-40 rounded-xl grid grid-rows-[55%_45%]">
										<div className="flex justify-center items-end text-white text-lg font-semibold">{user}</div>
										<div className="flex justify-center text-white"> <b className="font-extrabold mr-2 text-green-500">·</b> User online</div>
									</div>
								)
							})
						}
					</div>
					<div style={{boxShadow: "inset 0px 0px 100px rgba(0,0,0,0.3)"}} className="overflow-y-auto bg-zinc-800 h-full w-full bg-opacity-60 grid grid-rows-[90%_10%]">
						<div ref={scrollRef} style={{ scrollBehavior: "smooth" }} className="overflow-y-auto pb-2 w-full h-full scrollbar pl-2 pt-2  pr-1">
							{
								messages.map((message, index)=>{
									let previousItemUser = index > 0 ? messages[index-1].user : null;
									let nextItemUser = index + 1 < messages.length - 1 ? messages[index + 1].user : null;
									return (
										<Message key={message.id} text={message.message} sent={!message.received} userPrev={previousItemUser} name={message.user} />
									)
								})
							}
							{otherUserTyping && <Message text={otherUserTyping + " is typing"} sent={false} name={otherUserTyping} />}
						</div>
						<div>
							<form className="w-full h-full flex row-span-1">
								<input ref={inputRef} type="text" className="focus:outline-none bg-zinc-900 w-5/6 h-full text-white text-2xl font-semibold pl-4" placeholder={`Enter message for ${room}`} onChange={userTyping}/>
								<button type="submit" className="bg-green-500 w-1/6 h-full text-2xl bg-opacity-40 hover:bg-opacity-80 font-semibold" onClick={(e)=> sendMessage(e)}>Send</button>
							</form>
						</div>
					</div>
					<div className="m-3 overflow-y-auto">
						<div onClick={()=>changeUserRoom("Room1")} style={{boxShadow: "inset 0px 0px 100px rgba(0,0,0,0.3)"}} className="text-white text-2xl font-semibold flex justify-center items-center bg-zinc-900 bg-opacity-40 hover:cursor-pointer transition-all hover:bg-zinc-800 rounded-2xl h-1/5 mb-3 w-full">Family Chat</div>
						<div onClick={()=>changeUserRoom("Room2")} style={{boxShadow: "inset 0px 0px 100px rgba(0,0,0,0.3)"}} className="text-white text-2xl font-semibold flex justify-center items-center bg-zinc-900 transition-all hover:bg-zinc-800 bg-opacity-40 hover:cursor-pointer rounded-2xl h-1/5 mb-3 w-full">General</div>
						<div style={{boxShadow: "inset 0px 0px 100px rgba(0,0,0,0.3)"}} className="text-white text-5xl font-bold flex justify-center items-center transition-all hover:bg-zinc-950 hover:cursor-pointer bg-zinc-900 bg-opacity-40 rounded-2xl h-1/5 w-full">+</div>
					</div>
				</div>


			</div>
		</>
	)
}