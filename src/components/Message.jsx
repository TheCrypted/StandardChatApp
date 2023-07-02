
function tagSplit(text){
	let messageWords = text.split(" ")
	let firstHalf = text.split("@")[0]
	let secondHalf = text.split("@")[1]
	let taggedContent = messageWords.filter(word => word.includes("@"))[0]
	let taggedWord = taggedContent.slice(1)
	secondHalf = secondHalf.replace(taggedWord, "")
	return {
		firstHalf,
		secondHalf,
		taggedContent
	}
}
export const Message = ({text, name, sent, userPrev}) => {
	let sentCol = sent? "#22c55e": "rgb(180, 180, 180)";
	let justify = sent? "flex-end": "flex-start";
	let rounded = sent? "0.75rem 0 0.75rem 0.75rem" : "0 0.75rem 0.75rem 0.75rem";
	let userColor = sent? "#15803d": "rgb(130, 130, 130)";
	let displayName = userPrev !== name;
	let marginBottom = displayName ? "mt-2" : "mt-1";
	let tag = text.includes("@");
	let messageComp;

	if(tag){
		messageComp = tagSplit(text)
	}
	return (
		<div style={{justifyContent: justify}} className={"w-full h-auto " + marginBottom + " drop-shadow-xl flex items-center flex-wrap"}>
			{displayName && <div style={{justifyContent: justify}} className="w-full flex items-center text-sm">
				<div style={{backgroundColor: userColor}} className=" pl-1 pr-1 rounded-t-md">
					{name}
				</div>
			</div>}
			{!tag && <div style={{backgroundColor: sentCol, minWidth: "60px", borderRadius: rounded}} className="bg-green-500  max-w-md inline-block p-2  text-lg font-semibold">
				{text}
			</div>}
			{tag && <div style={{backgroundColor: sentCol, minWidth: "60px", borderRadius: rounded}} className=" bg-green-500  max-w-md inline-block p-2  text-lg font-semibold">
				{messageComp.firstHalf}
				<b className={"hover:cursor-pointer font-semibold text-blue-800 "}>{messageComp.taggedContent}</b>
				{messageComp.secondHalf}
			</div>}
		</div>
	)
}