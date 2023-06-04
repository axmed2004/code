try{
via.toast("рџ‘ЊPress againвќпёЏ_v2");
_.body.insertAdjacentHTML("beforeEnd", setsDataHtml());
//var sets=SETS;
var workCss= document.head.newChild("style");
workCss.innerHTML= SETS.css;
var sheet=document.head.newChild("style").sheet;
try{
/*0&&$("details.css").newChild(
"iframe",{
onerror:alert,
src: URL.createObjectURL(
new File([SETS.css],"",{type :'text/html'})
)},
alert);*/
}catch(e){alert(e.stack)}

fillForm();
$("dialog").oninput=function(e){
try{
	var el=e.target;
	if(!el.dataset.css)
		return;
	sheet.insertRule(
	el.dataset.css.replace("$value",el.value),
		sheet.cssRules.length);
}catch(e){dlog(e.stack)}
}
$("dialog").onchange=function(e){
try{
	var el=e.target;
	el.parentElement.classList.add('changed');
	el.dataset.changed=true;
	if(el.dataset.var)
		SETS[el.dataset.var]=
			el.type=="checkbox"
			? el.checked
			: el.value;
	if(el.dataset.css && el.type=="checkbox"){
		if(el.checked)
			workCss.append(el.dataset.css+"\n");
		else
			workCss.innerHTML =workCss.innerHTML.replace(el.dataset.css,"");
	}
if(e.target!=$("textarea"))
	$('textarea').value=readFromForm().css;

}catch(e){dlog(e.stack)}
}
function exportCss(){
	var txt=resultCss();
	txt=JSON.stringify({
		settings:btoa(JSON.stringify({
							csstheme:btoa(txt)
							})
	)});
	var url = URL.createObjectURL(
		new File([txt],'viaHomeSets.txt',{type :'text/txt'})
	);
/*var pre=_.createElement("pre");
pre.innerText=txt;

txt="<code>"+pre.innerHTML+"</code><script>alert('Copy to Settings>>>CSS')</script>";
//alert(txt);
return txt;*/
alert("Save this as file. Then import.")
$("a[download1]").href=url;
$("a[download1]").click();
setTimeout(function(){via.openSettings(1)},10000);
}
function copyCss(){
//$("textarea").value=resultCss();
$("textarea").select();
document.execCommand("copy");
alert('Settings copied. Go to Settings>>CSS and paste.')
}
function copyAllCss(){
$("textarea").value=resultCss();
$("textarea").select();
document.execCommand("copy");
alert('Settings copied. Go to Settings>>CSS and relace.')
}

function resultCss(){
	var txt=SETS.css;
	txt+="</style>\n<script src=http://viable.at.ua/cdn/beta.ac.js?";
	var arr=[];
	for (var key in SETS){
		if (key=="localPath" && SETS[key])
			arr.push(key+"="+SETS[key])
		else if (SETS[key] && key!="css")
			arr.push(key);
	}
	txt+=arr.join("&");
	txt+=">\n</script><style>";
	return txt;
	
}
function readFromText(){
try{
SETS.css=workCss.innerHTML=$('textarea').value;
clearForm();
return SETS;
}catch(e){dlog(e.stack)}
}
function readFromForm(){
try{
SETS.css=workCss.innerHTML;
[].slice.call( _.querySelectorAll("[data-changed]")).forEach(function(el){
	if(el.dataset.var)
		SETS[el.dataset.var]=
			el.type=="checkbox"
			? el.checked
			: el.value;
	else if(el.type!="checkbox" && el.dataset.css)
		SETS.css+=el.dataset.css.replace("$value",el.value)+"\n";
});
return SETS;
}catch(e){dlog(e.stack)}
}
function saveSettings(){
try{
	readFromForm();
	confirm("Save Settings?\n"+keys(SETS,"\n"))
		&& MAIN.settingStore(SETS);
	 workCss.innerHTML =SETS.css;
}catch(e){dlog(e.stack)}
}
function clearForm(){
try{
while(sheet.cssRules.length)
	sheet.deleteRule(0);
[].slice.call( _.querySelectorAll(".changed")).forEach(function(el){
	el.classList.remove('changed');
	});
[].slice.call ( _.querySelectorAll ("[data-changed]")).forEach(function(el){
	el.removeAttribute("data-changed")
});
if($("#box_container"))
	$("#box_container").style.cssText="";
_.body.style.backgroundColor="";
fillForm();

}catch(e){dlog(e.stack)}
}
function fillForm(){

[].slice.call( _.querySelectorAll("[data-var]")).forEach(function(el){
	if(el.type=="checkbox")
		el.checked= SETS[el.dataset.var];
	else
		el.value = SETS[el.dataset.var]||"";
});
[].slice.call( _.querySelectorAll("[data-css]")).forEach(function(el){
if(el.type=="checkbox")
	el.checked = ~ $("style").innerHTML .indexOf(el.dataset.css)
		|| ~workCss.innerHTML.indexOf(el.dataset.css);
else{
	var sel=el.dataset.css.split("{")[0];
	var attr=el.dataset.css .split("{")[1].split(":")[0];
var value='';

	try{
		value = getComputedStyle($(sel))[attr];

	}catch(e){}
if (~value.indexOf("rgb")){

	el.value= rgb2hex(value)[0];
}
else el.value=parseInt(value);
}
});
setRanges();
$('dialog textarea').value=readFromForm().css;
}
function clearSettings(){
MAIN.settingStore(null, function(settings){
	if(!confirm("Clear Form to?\n"+keys(settings,"\n")))
		return;
	SETS=settings;
	workCss.innerHTML=SETS.css;
	clearForm();
});
};

color.oninput=transp.oninput=function(e){
try{
	bg(hexToRGB(color.value, transp.valueAsNumber/100));
	e.target.parentElement.dataset.css= "body{background-color:"+bg()+";}";
	e.target.parentElement.dataset.changed= true;
}catch(e){dlog(e.stack)}
};

function setRanges(){
try{
transp.value=rgb2hex(bg())[1]*100;
color.value= rgb2hex(bg())[0];
}catch(e){dlog(e.stack)}
}
function bg(rgba){
	if(rgba) _.body.style.backgroundColor= rgba;
	return getComputedStyle(document.body).backgroundColor;
}
function rgb2hex(rgb) {
    rgb=rgb.match(/[0-9.]+/g);
    return ["#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]),rgb[3]];
}
function hex(x) {
        return ("0"+parseInt(x).toString(16)).slice(-2);
    }
function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}
}catch(e){dlog(e.stack)}


function setsDataHtml(){
return "<style>  .ad.box {     float: right;     transform: scale(0.7); }  .ad.box .title {     background: rgba(34, 34, 200, 0.5); }  dialog {     z-index: 999;     text-align: left;     background: rgba(100, 100, 100, .7);     background: fixed no-repeat linear-gradient(90deg, rgba(50, 50, 59, .9), rgba(100, 100, 100, .6));     width: 100%;     height: auto;     /*	position: fixed; */     border-radius: 5px;     color: white;     line-height: 24px; } .changed {     background: no-repeat linear-gradient(to right top, rgba(196, 0, 0, 0.8), rgba(0, 255, 0, .5)); }  dialog label {     box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 1px rgba(0, 0, 0, 0.2); } aside{ right:.2em; position: fixed; float: right; top: .5em; position:sticky; position:-webkit-sticky;  z-index: 9999999; } dialog textarea{ width:100%; } /*dialog textarea:focus { height:100vh; position:fixed; top:0px; left:0px; } */ dialog button { 	width:4em; 	margin: 0.3em;      background: white;     font-size: 12px;     line-height: 30px;     border-radius: 5px; }  dialog summary,  h2 {     border: 1px solid rgba(255, 255, 255, 0.1);     border-radius: 100px;     box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);     font-size: 20px;     line-height: 30px; }  input[type=color] {     width: 30%;     line-height: 50px; }  input[type=number] {     width: 15%; }  input[type=range], input[type=url] {     width: 100%; } </style>  <dialog>     <aside>      <button onclick=$('dialog').close()>Hide</button>     <br><button onclick=clearSettings()>Clear</button>      <br><button onclick=saveSettings()>Save</button>     <br><button onclick=exportCss()>Export</button>      </aside>     <h2>Home Settings</h2>     <details>         <summary>General</summary>         <p><label><input data-var=saveSearches type=checkbox>Save Search History</label></p>         <p><label><input data-var=title type=checkbox>Clock & Battery in Title</label></p>         <p><label><input data-var=inputTricks type=checkbox>Tricks for Input</label></p>         <p><label>Use Local Icons <input data-var=localPath placeholder=/storage/emulated/0/download/icons/ type='url'> </label></p>         <p><label><input data-var=noSugs type=checkbox>No Suggestions</label></p>         <p><label><input data-var=noSets type=checkbox>No Settings</label></p>         <p hidden><label><input onchange=MAIN.reverse_children($('#box_container')) data-var=reverse type=checkbox>Reverse Bookmarks(Slow)</label></p>             <p><label><input data-var=noUp type=checkbox>No Up</label></p>          <p><label><input data-var=debug type=checkbox>Debug</label></p>          </details>     <details>         <summary>On Search</summary>         <p hidden><label>Correct Content Height <input onchange=$('#search_input').focus() data-css='#content.focus{top:$valuepx;}'          min=-"+screen.height/2+" max="+ screen.height+"        type=range></label></p>         <p><label>Correct Content Height <input onchange=$('#search_input').focus() data-css='#content{top:$valuepx;}'         min=-"+screen.height/2+" max="+ screen.height+"          type=range></label></p>         <p><label><input data-css='#content.focus{position:fixed;}' type=checkbox> Fix Search Bar</label></p>         <p><label><input data-css='.ad.box.focus,a.logo+a.focus,#bookmark_part.focus{display:none;}\n.frosted-glass.focus{background-color:rgba(50,50,50,0.5);}\na.logo.focus{visibility:hidden;}' type=checkbox> Hide Content</label></p>         <p hidden><label><input data-css='a.logo.focus{display:none;}\n.frosted-glass.focus{background-color:rgba(50,50,50,0.5);}' type=checkbox> Hide Logo</label></p>         <p><label><input data-css='.search_bar,.frosted_glass{transition:ease-in .2s;}\n.search_bar.focus{width:100%;}' type=checkbox> Animatable Input</label></p>         <p><label><input data-var=toDown type=checkbox>Sugs Under SearchBar</label></p>         <p hidden><label><input data-css='#content.focus{top:0.2em;}' type=checkbox> Jump Up SearchBar</label></p>     </details>     <details>         <summary>Appearance</summary>         <p><label>Background: Color <input id=color type=color> Transparency <input id=transp type=range></label></p>         <p><label>BookMarks Text Color <input data-css='.url{color:$value}' type=color>         <p><label>Letter's Color <input data-css='.title{color:$value}' type=color> </label></p>     </details>     <details>         <summary>Icons</summary>         <p><label><input data-css='#box_container{display:flex;flex-wrap:wrap-reverse;}' type=checkbox> Reverse Icons (Fast)</label></p>         <p><label>Width:min-max          <input data-css='.title img{min-width:$valuepx;}' type=number>          -<input data-css='.title img{max-width:$valuepx;}' type=number> </label>         <label>Actual Width<input data-css='.title img{width:$valuepx;}' max=100 type=range> </label>          <label>Border Radius<input data-css='.title img{border-radius:$valuepx;}' max=50 type=range> </label> </p>         <p><label>Transparency <input data-css='#box_container{filter:opacity($value);}'min=0 max=1 step=0.1 type=range></label>          <label>With Of Box Container <input data-css='#box_container{width:$valuepx;}'          min="+ screen.width/3+" max="+ screen.width+"      type=range></label></p>     </details>          <details class=css><summary>CSS Text</summary>     <button onclick=copyAllCss()>CopyAll</button>     <button onclick=copyCss()>Copy</button>     <button onclick=readFromText()>Ok</button>      <button onclick={$('textarea').value=readFromForm().css}>Cancel</button>     <textarea rows=10 oenfocus={$('#hidBut').hidden=0} onbelur={$('#hidBut').hidden=1}>     </textarea>     <a hidden download1=viaHomeSets.txt>Export</a>      </details>      </dialog>"
};