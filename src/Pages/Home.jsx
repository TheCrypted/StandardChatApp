
import io from "socket.io-client"
import {Message} from "../components/Message.jsx";
import {useEffect, useRef, useState} from "react";

const socket = io.connect("http://localhost:3030")
export const Home = () => {
	const [messages, setMessages] = useState([])
	let scrollRef = useRef()
	const inputRef = useRef();
	function sendMessage(e){
		e.preventDefault();
		if(inputRef.current.value === ""){
			return;
		}
		socket.emit("sendMessage", {
			message: inputRef.current.value
		})
		const updatedMessages = [
			...messages,
			{
				message: inputRef.current.value,
				user: "Aman",
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
					user: "Aman",
					received: true,
				},
			]);
			console.log(messages);
		};

		socket.on("receiveMessage", receiveMessage);

		return () => {
			socket.off("receiveMessage", receiveMessage);
		};
	}, [socket])

	useEffect(()=>{
		scrollRef.current.scrollTop = scrollRef.current.scrollHeight
	}, [messages])

	return (
		<>
			<div style={{backgroundImage: "url(https://i.pinimg.com/originals/1a/04/69/1a046940247ca498deffecad4b839fc8.jpg)"}} className="flex items-center justify-center bg-cover w-full h-full">
				<div className="bg-zinc-800 bg-opacity-60 backdrop-blur-2xl rounded-2xl h-5/6 w-5/6 grid grid-cols-[23%_54%_23%] shadow-2xl">
					<div className="rounded-l-2xl"></div>
					<div style={{boxShadow: "inset 0px 0px 100px rgba(0,0,0,0.3)"}} className="overflow-y-auto bg-zinc-800 h-full w-full bg-opacity-60 grid grid-rows-[90%_10%]">
						<div ref={scrollRef} style={{ scrollBehavior: "smooth" }} className="overflow-y-auto w-full h-full scrollbar pl-2 pr-1">
							{/*<div className="bg-white h-1/4 m-2">Hello</div>*/}
							{/*<div className="bg-white h-1/4 m-2">Hello</div>*/}
							{/*<div className="bg-white h-1/4 m-2">Hello</div>*/}
							{/*<div className="bg-white h-1/4 m-2">Hello</div>*/}
							{/*<div className="bg-white h-1/4 m-2">Hello</div>*/}
							{
								messages.map((message, index)=>{
									return (
										// <div className="w-full">
										// 	<div key={message.id} className="w-full h-auto mb-2 drop-shadow-xl bg-white flex items-center justify-end">
										// 		<div className="bg-green-500 max-w-md inline-block p-2 rounded-xl text-lg font-semibold">
										// 			{message.message}
										// 		</div>
										// 	</div>
										<Message key={message.id} text={message.message} sent={!message.received} name={message.user} />
										/*</div>*/
									)
								})
							}
						</div>
						<div>
							<form className="w-full h-full flex row-span-1">
								<input ref={inputRef} type="text" className="focus:outline-none bg-zinc-900 w-5/6 h-full text-white text-2xl font-semibold pl-4" placeholder="Enter message"/>
								<button type="submit" className="bg-green-500 w-1/6 h-full text-2xl bg-opacity-40 hover:bg-opacity-80 font-semibold" onClick={(e)=> sendMessage(e)}>Send</button>
							</form>
						</div>
					</div>
					<div className=""></div>
				</div>


			</div>
		</>
	)
}