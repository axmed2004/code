var tooltipHpadding=20;
var tooltipVpadding=0;
window.onload=function(){
    setTimeout(() => {
        var css = '.hglightblock { background-color:#ccf !important;}',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style'),
        popuptooltip=document.createElement('div');
        popuptooltip.id="popuptooltip";
        //popuptooltip.style.position="absolute";
        //popuptooltip.style.zIndex="10000";
        let tooltipCss="position:absolute;z-index:1000;max-width:600px;word-wrap: break-word;white-space:normal;padding:5px;border:1px solid black;background-color:white;";
        popuptooltip.style=tooltipCss;
        head.appendChild(style);
        document.getElementsByTagName('body')[0].appendChild(popuptooltip);
        style.type = 'text/css';
        if (style.styleSheet){
             // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } 
        else {
            style.appendChild(document.createTextNode(css));
        }

        document.querySelectorAll("body *")
        .forEach(function(c){
            let tag="<span style='color:black'>"+c.tagName+"</span>";
            let cid=c.getAttribute("id")!=null?"<b style='color:blue'>#"+c.getAttribute("id")+"</b>":"";
            let clss="";
            if(c.getAttribute("class")!=null){
                clss="<b style='color:green'>."+(c.classList.toString().replace(/^\s/,"").replace(/\s/,"."))+"</b>"
            }
            //let cl=c.className!=null&&c.className.length>0?c.className:"";

            c.addEventListener("mousemove",function(e){
                document.querySelector("#popuptooltip").innerHTML=tag+(cid!=""?cid:"")+(clss!=""?clss:"")//+(cl!=""?"<b style='color:green'>."+cl+"</b>":"")
                +(tag=="IMG"?"<br>src="+c.src:"")
                +(tag=="A"?"<br>href="+c.getAttribute("href"):"");
                var tooltipW=document.querySelector("#popuptooltip").offsetWidth;
                var tooltipH=document.querySelector("#popuptooltip").offsetHeight;
                var winwidth=window.innerWidth;
                var winheight=document.body.clientHeight;
                var leftpos="",toppos="";

                if(e.pageX+tooltipW+tooltipHpadding>winwidth)
                    leftpos="right:"+(winwidth-e.pageX+tooltipHpadding)+"px;";
                else leftpos="left:"+(e.pageX+tooltipHpadding)+"px;";

                if(e.pageY+tooltipH+tooltipVpadding>winheight)
                    toppos="bottom:"+(winheight-e.pageY+tooltipHpadding)+"px;";
                else toppos="top:"+(e.pageY+tooltipVpadding)+"px;";

                document.querySelector("#popuptooltip").style=tooltipCss+toppos+leftpos;
                //.setAttribute("style", tooltipCss+toppos+leftpos);
                e.stopPropagation();
            })
            c.addEventListener("mouseover",function(e){
                c.classList.add("hglightblock")
                e.stopPropagation();
            })
            c.addEventListener("mouseout",function(e){
                c.classList.remove("hglightblock")
                e.stopPropagation();
            })
        })
    }, 1000);
    
}
