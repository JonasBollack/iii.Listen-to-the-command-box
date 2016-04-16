

var runBtn=document.getElementById("runBtn");
var runIpt=document.getElementById("runIpt");
var textarea=document.getElementById("textarea");
var tbody=document.getElementsByTagName("tbody")[0];
var direction=["top","right","bottom","left"]
var interval=null;
var WIDTH=61;
var HEIGHT=61;
var nowPosition={
	X:0,
	Y:0,
    action:null,
    turn:0,
    rotate:0
};


function _mkAction(){
	var odiv=document.createElement("div");
	odiv.className="action";
	odiv.style.width=WIDTH+"px";
	odiv.style.height=HEIGHT-10+"px";
	odiv.style.borderTop="10px solid blue";
	odiv.style.backgroundColor="red";
	odiv.style.position="absolute";
	var ox=Math.floor(Math.random()*10);
	var oy=Math.floor(Math.random()*10);
	odiv.style.left=ox*WIDTH+"px";
	odiv.style.top=oy*HEIGHT+"px";
	nowPosition.X=ox+1;
	nowPosition.Y=oy+1;
	nowPosition.action=odiv;
	tbody.appendChild(odiv);
}



function Move(num,times){
	var go;
    if(times==0)
    	return false;
	if(num==undefined||num===null)
		go=nowPosition.turn;
	else
	if(num===0)
		go=num;
	else
		go=num;
    if(go==0){
    	if(nowPosition.Y>1)
    		nowPosition.Y--;
    }
    if(go==1){
    	if(nowPosition.X<10)
    		nowPosition.X++;
    }

    if(go==2){
    	if(nowPosition.Y<10)
    		nowPosition.Y++;
    }
    if(go==3){
    	if(nowPosition.X>1)
    		nowPosition.X--;
    }
    nowPosition.action.style.top=(nowPosition.Y-1)*HEIGHT+"px";
    nowPosition.action.style.left=(nowPosition.X-1)*WIDTH+"px";	
    times&&Move(num,times-1);
}

// 设置方向函数
function Turn(direct,rotate){
	if(direct!=null)
	switch(direct){
		case "TUN RIG":
		nowPosition.rotate=(nowPosition.rotate+90);
		console.log(nowPosition);
		nowPosition.action.style.transform="rotate("+nowPosition.rotate+"deg)";
		nowPosition.turn=(nowPosition.turn+1)%4;
		console.log(nowPosition.rotate);
		console.log(nowPosition.turn);
		break;
		case "TUN LEF":
		nowPosition.rotate=(nowPosition.rotate-90);
		nowPosition.action.style.transform="rotate("+nowPosition.rotate+"deg)";
		nowPosition.turn=(4+(nowPosition.turn-1)%4)%4;
		console.log(nowPosition.rotate);
		console.log(nowPosition.turn);
		break;
		case "TUN BAC":
		nowPosition.rotate=(nowPosition.rotate+180);
		nowPosition.action.style.transform="rotate("+nowPosition.rotate+"deg)";
		nowPosition.turn=(nowPosition.turn+2)%4;
				console.log(nowPosition.rotate);
		console.log(nowPosition.turn);
		break;
	}
	else{
		nowPosition.rotate=rotate;
		nowPosition.action.style.transform="rotate("+nowPosition.rotate+"deg)";
		if(nowPosition.rotate>=0)
			nowPosition.turn=(nowPosition.rotate/90)%4;
	    else if(nowPosition.rotate<0)
	    	nowPosition.turn=(4+(nowPosition.rotate/90)%4)%4;
	    // Move(nowPosition.turn);
	}
}

var handler={
		"GO":function(num){
			console.log(num);
			Move(null,num);
		},
		"TUN LEF":function(num){
			Turn("TUN LEF");
		},
		"TUN RIG":function(num){
			Turn("TUN RIG");
		},
		"TUN BAC":function(num){
			Turn("TUN BAC");
		},
		"TRA LEF":function(num){
		    Move(3,num);
		},
	     "TRA TOP":function(num){
	     	Move(0,num);
	    },
	     "TRA RIG":function(num){
	     	Move(1,num);
	    },
	     "TRA BOT":function(num){
	     	Move(2,num);
	    },
	     "MOV LEF":function(num){
	     	Turn(null,-90);
	     	Move(null,num);
	    },
	     "MOV TOP":function(num){
	     	Turn(null,0);
	     	Move(null,num);
	    },
	     "MOV RIG":function(num){
	     	Turn(null,90);
	     	Move(null,num);
	    },
	     "MOV BOT":function(num){
	     	Turn(null,180);
	     	Move(null,num);
	    }
}

var handTextArea = (function(){
    var textarea=document.getElementById("textarea");
	var showRow=document.getElementsByClassName("show-row")[0];
    var enterRagExp=/\n/g;
    var row=0;
	function _addRow(enterRow){
		if(row!=enterRow){
			var el;
			var temp=document.createDocumentFragment();
			showRow.innerHTML="<div class='rol-el'>1</div>";
			for(var i=1;i<=enterRow;i++){
				el=document.createElement("div");
				el.className="rol-el";
				el.innerHTML=i+1;
				temp.appendChild(el);
			}
			showRow.appendChild(temp);
			row=enterRow;
		}
	}
    return {
    	addShow: function(){
            var value=textarea.value;
            if(value.match(enterRagExp))
	            var enterRow=value.match(enterRagExp).length;
            _addRow(enterRow);
    	},
    	matchConsole: function(){
    	    var value=textarea.value;
    	    var consoleArr=value.split(enterRagExp);
    	    console.log(consoleArr);
    		return consoleArr;
    	},
    	showRowScroll: function(scrollTop){
            showRow.scrollTop=scrollTop;
    	}
    }
}());



var checkConsoleArr= (function(){
	var checkExp=/MOV|GO|TRA/;
	var arrStr="";
	for(key in handler){
		if(checkExp.test(key))
			arrStr+="^"+key+"(\\s+[0-9]+)?$|";
	    else
	    	arrStr+="^"+key+"$|";
	}
	arrStr=arrStr.slice(0,-1);
	arrStr=new RegExp(arrStr);
	console.log(arrStr);
	function _processArr(arr){
    return  arr && arr.map(function(item,index){
        	item=item.replace(/^\s+|\s+$/g,"");
            if(arrStr.test(item))
            	return item;
            else
            	return false;
        });
	}
	return {
		exec: function(){
	        var consoleArr=_processArr(handTextArea.matchConsole());
	        var i=0;
	        var fn=handler[consoleArr[i].replace(/\s+[0-9]+$/,"")];
	        var num=consoleArr[i].match(/[0-9]+/)&&consoleArr[i].match(/[0-9]+/)[0];
	        console.log(fn);
	        console.log(num);
	        fn(num);
	        var userInterval=setInterval(function(){
	        	i++;
		        var fn=handler[consoleArr[i].replace(/\s+[0-9]+$/,"")];
		        var num=consoleArr[i].match(/[0-9]+/)&&consoleArr[i].match(/[0-9]+/)[0];
		        fn(num);
		        if(i>=consoleArr.length)
		        	clearInterval(userInterval);
	        },1000);
		},
		check: function(){
			var showRow=document.getElementsByClassName("show-row")[0];
            var flag=true;
            var consoleArr=_processArr(handTextArea.matchConsole());
            consoleArr.map(function(item,index){
                if(item==false){
                	showRow.children[index].style.backgroundColor="red";
                    flag=false;
                }
                else
                	showRow.children[index].style.backgroundColor="";
            });
            return flag;
          }
		
	};

}());


// 解决浏览器兼容
function addEventHandler(obj,event,handler){
	if(obj.addEventListener){
		obj.addEventListener(event,handler,false);
	}else if(obj.attachEvent){
        obj.attachEvent("on"+event,handler);
	}else
        obj["on"+event]=handler;
}



function init(){
	var shouElIterval=setInterval(handTextArea.addShow,500);
    addEventHandler(runBtn,"click",function(){
    	if(checkConsoleArr.check())
    	    checkConsoleArr.exec();
    });
    addEventHandler(textarea,"scroll",function(event){
    	event=event||window.event;
    	handTextArea.showRowScroll(event.target.scrollTop);
    });
    _mkAction();
}

init();