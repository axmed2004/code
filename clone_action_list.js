
(function(){
	if(document.querySelectorAll("div.topActionList").length==0){
		$cap=document.querySelector("div.caption");
		$b=[...document.querySelectorAll("div.game_actions ul.action_list li")].slice(0,3);

		urlstr=document.querySelectorAll("div.game_actions ul.action_list li a")[0].href;
		url=new URL(urlstr);
		t=url.searchParams.get("t");

		tAL="<style>.topActionList li{display:inline}</style><div class='topActionList' style='background:#ffecc7;'>";

		$b.forEach(function(el){
			tAL+=el.outerHTML; //аДаОаБаАаВаЛаЕаНаИаЕ баЕбаЕаЗ баИаКаЛ аДаЛб баОббаАаНаЕаНаИб аКаОаЛаИбаЕббаВаА аДаЕаЙббаВаИаЙ аВ баКаОаБаКаАб
		});
		tAL+="<div style='padding:10px 0px;'>";
		tAL+="<li><img width='16' height='16' alt='o' src='/Themes/images/warehouse.png'> <a href='/Warehouse'>аЁаКаЛаАаД</a></li> ";
		tAL+="<li><img width='16' height='16' alt='o' src='/Themes/images/cart.png'> <a href='/Purchases?t="+t+"'>ааАаГаАаЗаИаН</a></li> ";
		tAL+="<li><img width='16' height='16' alt='o' src='/Themes/images/exchange.png'> <a href='/Exchanger?t="+t+"'>ааБаМаЕаНаНаИаК</a></li> ";
		//tAL+="<li><img width='16' height='16' alt='o' src='/Themes/images/cabinet-icon.png'> <a href='/Cabinet?t="+t+"'>ааАаБаИаНаЕб</a></li> "
		tAL+="</div>";

		tAL+="</div>";
		$cap.innerHTML+=tAL;

		$topInfo=document.createElement('div');
		$topInfo.className="notify smallfont block";
		$topInfo.innerHTML=document.querySelector("div.notify.smallfont.block").innerHTML;
		//$foot="<div class='notify smallfont block'>"+document.querySelector("div.notify.smallfont.block").innerHTML+"</div>"
		document.querySelector("body>div").insertBefore($topInfo,document.querySelector("div.content"));
		// $topInfo.insertBefore(document.querySelector("div.content"))

		//document.querySelector("#treasuresLink").style.display="block"
		
	}
})()
