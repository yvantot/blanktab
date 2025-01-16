const storage = chrome.storage.local;

const DEFAULT = {
	preferences: {
		title: "New Tab",
		color: "#242424",
		textcolor: "#838383",
		textsize: "1.5",
		note: "",
	},
};

(() => {
	const preferLogo = document.getElementById("preferLogo");

	preferLogo.addEventListener("click", async () => {
		// Use Babel to transpile
		const hasSetting = document.getElementById("preferContainer");

		if (hasSetting) {
			// Remove the preference container if it exists
			hasSetting.remove();
		} else {
			const data = await storage.get(null);

			addPreferUI(data);
			addPreferStyle();

			document.getElementById("reset").addEventListener("click", resetData);
			document.getElementById("set").addEventListener("click", setData);
		}
	});
})();

function addPreferStyle() {
	// Avoid polluting the DOM by only adding once
	const hasStyle = document.getElementById("preferStyle");
	if (hasStyle) return;

	const style = document.createElement("style");
	style.setAttribute("id", "preferStyle");
	style.innerHTML = `	                       
        @keyframes openPrefer {
            0%{
                transform: translateX(100%);
            }
            100%{
                transform: translateX(0%);
            }
        }        
        .title {
            font-size: 1.2rem;
            text-align: center;
            margin-bottom: 2rem;
        }
        .setting {
           animation: openPrefer 1.5s ease; 
            position: absolute;
            top: 0;
            bottom: 0;
            margin: 1rem;
            padding: 1.5rem;
            border-radius: 10px;
            right: 0;
            width: 250px;
            background-size: 100% 100%;
            background-position: 0px 0px,0px 0px;
            background-image: radial-gradient(100% 100% at 95% 6%, #D4D4D4FF 0%, #FFFFFF00 100%),radial-gradient(75% 75% at 424% 261%, #00FFFF00 0%, #FFFFFFFF 100%);
        }
        input {
            padding: 5px;
            border-radius: 5px;
            width: 100%;
            border: 1px solid rgba(0,0,0,0.2);            
        }
        .container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 1rem;
        }        
        .btnContainer{
            margin-top: 2rem;
            justify-content: space-around;
            display: flex;
            gap: 1rem;
        }            
        button{
            cursor: pointer;
            padding: 10px 25px;
            border-radius: 5px;
            background: rgba(0,0,0,0.1);
            border: 1px solid white;
            box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
        }        
    `;
	document.head.appendChild(style);
}

storage.get(null, async (data) => {
	if (Object.keys(data).length === 0) {
		const { title, color, textcolor, textsize, note } = DEFAULT.preferences;

		await storage.set({
			preferences: {
				title,
				color,
				textcolor,
				textsize,
				note,
			},
		});

		const data = await storage.get("preferences");

		changeData(data.preferences);
	} else {
		changeData(data.preferences);
	}
});

chrome.storage.onChanged.addListener(async () => {
	const data = await storage.get(null);
	changeData(data.preferences);
});

function changeData(prefer) {
	const { title, color, note, textcolor, textsize } = prefer;

	document.body.setAttribute("style", `background: ${color};`);
	document.getElementById("usernote").textContent = note;
	document.getElementById("usernote").setAttribute("style", `color: ${textcolor}; font-size: ${textsize}rem;`);
	document.title = title;
}

function addPreferUI(data) {
	const preferContainer = document.createElement("div");
	preferContainer.setAttribute("id", "preferContainer");
	preferContainer.setAttribute("class", "setting");

	preferContainer.innerHTML = `
        <p class="title">Customize</p>
        <div class="container">
            <p>Change Newtab title</p>
            <input id="title" type="text" value="${data.preferences.title}" />
        </div>
        <div class="container">
            <p>Add note</p>
            <input id="note" type="text" value="${data.preferences.note}"/>
        </div>			
        <div class="container">
            <p>Background</p>
            <input id="color" type="color" value="${data.preferences.color}" />
        </div>
        <div class="container">
            <p>Text Color</p>
            <input id="textcolor" type="color" value="${data.preferences.textcolor}" />
        </div>		
        <div class="container">
            <p>Text Size</p>
            <input id="textsize" type="text" value="${data.preferences.textsize}" />
        </div>	
        <div class="btnContainer">
            <button id="reset">Reset</button>
            <button id="set">Set</button>    			
        </div>
    `;

	document.body.appendChild(preferContainer);
}

async function resetData() {
	const { title, color, textcolor, textsize, note } = DEFAULT.preferences;

	await storage.set({
		preferences: {
			title,
			color,
			textcolor,
			textsize,
			note,
		},
	});

	document.getElementById("title").value = title;
	document.getElementById("note").value = note;
	document.getElementById("color").value = color;
	document.getElementById("textcolor").value = textcolor;
	document.getElementById("textsize").value = textsize;
}

async function setData() {
	const title = document.getElementById("title")?.value;
	const note = document.getElementById("note")?.value;
	const color = document.getElementById("color")?.value;
	const textcolor = document.getElementById("textcolor")?.value;
	const textsize = document.getElementById("textsize")?.value;

	await storage.set({
		preferences: {
			title,
			note,
			color,
			textcolor,
			textsize,
		},
	});
}
