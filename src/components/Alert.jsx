export const Alert = ({message, color}) => {
	console.log(color)
	return (
		<div className="w-full mb-10 h-[8.5%] flex justify-center">
		<div  className={"mt-4  w-[60%] h-full bg-white rounded-md bg-opacity-60 " + color + " drop-shadow-2xl flex items-center text-white font-semibold text-xl flex items-center justify-center flex-wrap"}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="m-3 w-6 h-6">
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
			</svg>
			{message}
		</div>
		</div>
	)
}