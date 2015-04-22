var lightN2S = false;
var lightE2W = true;            //初始是东西方向绿灯（true为可以通行）
var color = ['red', 'green'];
var s = [1,1,1,1,1,1,1,1];      //半条道上的同步信号量
var maxCars = 16;
var flag = false;
var speed = [0.25,0.4];       //special car is faster
var ready = [false, false, false, false, false, false, false, false,false,false,false,false,false,false,false,false];
var waiting = [false, false, false, false, false, false, false, false,false,false,false,false,false,false,false,false];
var isMoving = [false, false, false, false, false, false, false, false,false,false,false,false,false,false,false,false]
var distanceOfWE = [350/3,0,-350/3,0];
var distanceOfSN = [0,-150/3,0,150/3];
var crossBusy = [false,false,false,false];


$(document).ready(function() {
	$(".btn").click(function(){
		flag = !flag;
		if(flag){
			$(".btn").html("Stop");
		}
		else{
			$(".btn").html("Start");
		}
		
})
	setInterval(function() {
		lightChange();
		traverseCar();
	}, 8000);
});
function randomStart(){
		var id;
		setInterval(function() {
		if(!flag) return;
		id = Math.random()*16;
		id = parseInt(id/1);
		carMoving(id);
	}, 500);
}
function waitingToReady(id){
	waiting[id] = false;
	var left3 = [350/3, 0, -350/3, 0];
	var top3 = [0, -150/3, 0, 150/3];
	var direct = parseInt((id%8)/2);
	var type = id % 2;
	var varLeft = "+=" + left3[direct];
	var varTop = "+=" + top3[direct];
	var time = Math.abs(left3[direct] + top3[direct])/speed[type];       //加速过马路
	$('#car'+id).animate({
		left: varLeft,
		top: varTop},
		time, function() {
		/* stuff to do after animation is complete */
		ready[id] = true;
		canCross(id);

	});
}
function traverseCar(){
	for(var i = 0;i < 16;i++){
		if(ready[i] === true){
			crossRoad(i);
		}
	}
}
function crossRoad(id){
	if(id>7){
		// console.log(waiting[id-8]);
		if(waiting[id-8] === true){
			waiting[id-8] = false;
			waitingToReady(id-8);
			ready[id-8] = true;
		}else{

		}
	}	
	var left2 = [250, 0, -250, 0];
	var top2 = [0, -250, 0, 250];
	var type = id % 2;
	var varLeft = "+=" + left2[direct];
	var varTop = "+=" + top2[direct];
	var time = 250/speed[type]-200;       //加速过马路

	var direct = parseInt((id%8)/2);         //0,1,8,9    -> W2E -> 0
											//2,3,10,11  -> S2N -> 1
											//4,5,12,13  -> E2W -> 2
											//6,7,14,15  -> N2S -> 3

	crossBusy[direct] = true;
	$('#car'+id).animate({
		left: varLeft,
		top: varTop}, time,'linear',function(){
			s[id%8]++;
			crossBusy = false;
			continueMove(id);
		});
}
var left3 = [450, 0, -450, 0];
var top3 = [0, -350, 0, 350];
var left4 = [-1050, 0, 1050, 0];
var top4 = [0, 550, 0, -550];

function continueMove(id){
	var road = parseInt((id%8)/2);
	var type = id % 2;
	var varLeft = "+=" + left3[road];
	var varTop = "+=" + top3[road];
	var returnLeft = "+=" + left4[road];
	var returnTop = "+=" + top4[road];
	var time = Math.abs(left3[road]+top3[road])/speed[type];

	$('#car'+id).animate({
		left: varLeft,
		top: varTop
	}, time, 'linear', function(){
		carMoving[id] = false;
		$('#car'+id).css({
			'left': returnLeft,
			'top': returnTop
		},function(){
			isMoving[id] = false;
		});
	});
}
function canCross(id){
	var type = id % 2;
	if(id%8 === 0 || id%8 === 1 || id%8 === 4 || id%8 === 5){
		console.log("light:  "+ lightE2W);
				if (lightE2W) {
					console.log("lightE2W!")
					ready[id] = false;
					crossRoad(id);
				}else if (type && !crossBusy[0] && !crossBusy[1]
					&& !crossBusy[2] && !crossBusy[3]) {
					ready[id] = false;
					crossRoad(id);	
				};
			}
			else{
				if (lightN2S) {
					ready[id] = false;
					crossRoad(id);
				}else if (type &&  !crossBusy[0] && !crossBusy[1]
					&& !crossBusy[2] && !crossBusy[3]) {
					ready[id] = false;
					crossRoad(id);	
				};
			}
}
//function can exceed
function carMoving(id){
	//alert("sada");
	if (isMoving[id]) return;
	isMoving[id] = true;
	var direct = parseInt((id%8)/2);         //0,1,8,9    -> W2E -> 0
											//2,3,10,11  -> S2N -> 1
											//4,5,12,13  -> E2W -> 2
											//6,7,14,15  -> N2S -> 3
	var lightFlag;
	if(direct === 0 || direct === 2){
		lightFlag = lightE2W;
	}
	else{
		lightFlag = lightN2S;
	}
	var type = id%2;                        //0 -> normal, 1 -> special
	if(s[id%8] === 1 || lightFlag){                 //s = 1,ready态
		ready[id] = true;
		s[id%8] --;							//ready,占有资源
		var left1 = [350, 0, -350, 0];
		var top1 = [0, -150, 0, 150];       
		var WestEast = "+=" + left1[direct];
		var NorthSouth = "+=" + top1[direct];
		var time = Math.abs(left1[direct] + top1[direct])/speed[type];
		$('#car' + id).animate({
			left:WestEast,
			top:NorthSouth
		},time,canCross(id)
		);
	}	
	else{
		var left1 = [350*4/5, 0, -350*4/5, 0];
		var top1 = [0, -150*1/2, 0, 150*1/2];
		waiting[id] = true;    
		var WestEast = "+=" + left1[direct];
		var NorthSouth = "+=" + top1[direct];
		var time = Math.abs(left1[direct] + top1[direct])/speed[type];
		$('#car' + id).animate({
			left:WestEast,
			top:NorthSouth
		},time);
		//alert("waiting!!");
	}
}

function lightChange(){
	lightN2S = !lightN2S;   
	lightE2W = !lightE2W;
	$('.lightNS').css('background-color',color[lightN2S+0]);
	$('.lightEW').css('background-color',color[lightE2W+0]);
}