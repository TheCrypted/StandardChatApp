export const Message = ({text, name, sent, userPrev}) => {
	let sentCol = sent? "#22c55e": "rgb(180, 180, 180)";
	let justify = sent? "flex-end": "flex-start";
	let rounded = sent? "0.75rem 0 0.75rem 0.75rem" : "0 0.75rem 0.75rem 0.75rem"
	let userColor = sent? "#15803d": "rgb(130, 130, 130)";
	let displayName = userPrev !== name
	let marginBottom = displayName ? "mt-2" : "mt-1";
	return (
		<div style={{justifyContent: justify}} className={"w-full h-auto " + marginBottom + " drop-shadow-xl flex items-center flex-wrap"}>
			{displayName && <div style={{justifyContent: justify}} className="w-full flex items-center text-sm">
				<div style={{backgroundColor: userColor}} className=" pl-1 pr-1 rounded-t-md">
					{name}
				</div>
			</div>}
			<div style={{backgroundColor: sentCol, minWidth: "60px", borderRadius: rounded}} className="bg-green-500  max-w-md inline-block p-2  text-lg font-semibold">
				{text}
			</div>
		</div>
	)
}