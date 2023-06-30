export const Message = ({text, name, sent}) => {
	let sentCol = sent? "#22c55e": "rgb(180, 180, 180)";
	let justify = sent? "flex-end": "flex-start";
	return (
		<div style={{justifyContent: justify}} className="w-full h-auto mb-2 drop-shadow-xl flex items-center ">
			<div style={{backgroundColor: sentCol}} className="bg-green-500 max-w-md inline-block p-2 rounded-xl text-lg font-semibold">
				{text}
			</div>
		</div>
	)
}