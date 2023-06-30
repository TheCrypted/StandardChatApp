export const Message = ({text, name, sent}) => {
	let sentCol = sent? "#22c55e": "rgb(180, 180, 180)"
	return (
		<div className="w-full">
			<div style={{backgroundColor: sentCol, textAlign: "left"}} className="text-lg font-semibold m-2 bg-green-500 inline-block rounded-xl p-3 drop-shadow-xl">
				{text}
			</div>
		</div>

	)
}