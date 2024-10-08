document.write('<link rel="stylesheet" href="/js/jsTree/css/style.css">');
//document.write('<script src="/js/jquery-3.6.1.js"></script>');
document.write('<script src="/js/jsTree/js/jstree.js"></script>');

var targetId = "";

var idx = 1;

function addRootNode(){

	var targetNode = $(targetId).jstree('create_node', '#', {'id' : "new_"+idx, 'text' : '명칭 변경',"li_attr" : { "isRegisted" : false}}, 'last');
	
	var node = $(targetId).jstree(true).get_node(targetNode);
	
	$(targetId).jstree().edit(node,null,function(node,status){
		treeProcess(0,node.text,0,0,1, node);
	});
	initEditor();
	offEditor();
	idx++;
	
}

function setNodeSelect(id){
	$(targetId).jstree("select_node",id);
}

function getNodeInfos(){

	var tmpArr= $(targetId).jstree(true).get_json('#', { flat: true });
	
	var array = new Array();
	var detailArr = new Array();
	
	var setSeq = 1;
	
	tmpArr.forEach(function(data,idx){
		var obj = new Object();
		
		var tmpSetEiiIdx = 0;
		if(!data.id.includes("new_")){
			tmpSetEiiIdx = data.id;
		}
		
		obj.eii_idx = tmpSetEiiIdx;
		obj.eii_title = data.text;
		
		var tmpSetRefIdx = 0;
		if(data.parent != "#"){
			tmpSetRefIdx = data.parent;
		}
		
		obj.eii_ref_idx = tmpSetRefIdx;
		obj.eii_seq = setSeq; 
		setSeq++;
		
		detailArr.push(obj);
	});
	
	var arrayObj = new Object();
	arrayObj.treeDatas =detailArr; 
	array.push(arrayObj);
	
	return JSON.stringify(arrayObj);
}


function getNodeInfos2(start, end, tmpArr){

	//var tmpArr= $(targetId).jstree(true).get_json('#', { flat: true });
	
	var array = new Array();
	var detailArr = new Array();
	
	var setSeq = start;
	
	for(var i = start - 1; i < end ; i++){
		var obj = new Object();
		
		var tmpSetEiiIdx = 0;
		
		if(typeof tmpArr[i] != 'undefined' &&  tmpArr[i].id != null){
			
			if(!tmpArr[i].id.includes("new_")){
				tmpSetEiiIdx = tmpArr[i].id;
			}
			
			obj.eii_idx = tmpSetEiiIdx;
			//obj.eii_title = tmpArr[i].text;
			
			var tmpSetRefIdx = 0;
			if(tmpArr[i].parent != "#"){
				tmpSetRefIdx = tmpArr[i].parent;
			}
			
			obj.eii_ref_idx = tmpSetRefIdx;
			obj.eii_seq = setSeq; 
			setSeq++;
			
			detailArr.push(obj);
		}
		
	}
	/*
	tmpArr.forEach(function(data,idx){
		var obj = new Object();
		
		var tmpSetEiiIdx = 0;
		if(!data.id.includes("new_")){
			tmpSetEiiIdx = data.id;
		}
		
		obj.eii_idx = tmpSetEiiIdx;
		obj.eii_title = data.text;
		
		var tmpSetRefIdx = 0;
		if(data.parent != "#"){
			tmpSetRefIdx = data.parent;
		}
		
		obj.eii_ref_idx = tmpSetRefIdx;
		obj.eii_seq = setSeq; 
		setSeq++;
		
		detailArr.push(obj);
	});
	*/
	var arrayObj = new Object();
	arrayObj.treeDatas =detailArr; 
	array.push(arrayObj);
	
	//console.log("getNodeInfos2 :::: " + start + " / "  + end);
	//console.log(JSON.stringify(arrayObj));
	
	return JSON.stringify(arrayObj);
}

function closeAll(){
	
	$(targetId).jstree('close_all');
}

function openAll(){
	$(targetId).jstree('open_all');
	//$(targetId).jstree(true).refresh();
}

function refreshNode(){
	$(targetId).jstree(true).settings.core.data = { url : "/adm/BOT/loadTree.do?egi_idx=" + $("#txtEgiIdx").val(), dataType: "json" };
	
	$(targetId).jstree(true).refresh();
	
	$(targetId).jstree('open_all');
}

var to = false;
function searchTree(targetSearchId){
	if(to) { clearTimeout(to); }
	to = setTimeout(function () {
		var v = $(targetSearchId).val();
		$(targetId).jstree(true).search(v);
	}, 250);
}


function loadTree(){
	// inline data demo
	$(targetId).jstree({
		'get_selected' : true,
		'core' : {
			"check_callback" : function(operation, node, parent, position){
			
				//기초 이론 삭제시 처리
				if(operation == 'delete_node'){
					var deleteFlg = false; 
					if(node.li_attr.isRegisted){
						if(confirm(node.text + "이 이론정보가 등록되어져 있습니다.\n 삭제 하시겠습니까?")){
							 deleteFlg = true;
						}
					}else{
						if(confirm(node.text + "를 삭제 하시겠습니까?")){
							deleteFlg = true;
						}
					}
					
					if(deleteFlg){
						treeProcess(node.id, node.text,0, 0, 3, node);
					}else{
						return false;
					}
					
					return true;
				}
			}
			,
			'data' : { 
					url : "/adm/BOT/loadTree.do?egi_idx=" + $("#txtEgiIdx").val(), 
					dataType: "json", 
					dataFilter : function(data,type){
						var jsonData = jQuery.parseJSON(data);
						var sData = JSON.stringify(jsonData);
						return sData;
					}
				}
			
			
		},
		'types' : {
			'default' : {
				"icon": false
			}
		},
		"dnd" : {
			check_while_dragging : true 
		},
		"plugins" : [ "contextmenu","dnd","search","ui","types" ],
		"contextmenu":{
			"items": function () {
				return {
					"RootCreate": {
						"label": "최상위 추가",
						"icon" : "/images/icon/root_add.svg",
						"action": function (data) {
							var targetNode = $(targetId).jstree('create_node', '#', {'id' : "new_"+idx, 'text' : '명칭 변경',"li_attr" : { "isRegisted" : false}}, 'last');
							var node = $(targetId).jstree(true).get_node(targetNode);
							
							$(targetId).jstree().edit(node,null,function(node,status){
								//저장 루틴
								treeProcess(0,node.text,0,0,1, node);
							});
							initEditor();
							offEditor();
							idx++;
						}
					},
					"Create": {
						"separator_before" : true,
						"label": "서브 등록",
						"icon" : "/images/icon/sub_add.svg",
						"action": function (data) {
							var ref = $.jstree.reference(data.reference);
								sel = ref.get_selected();
							if(!sel.length) { return false; }
							sel = sel[0];
							sel = ref.create_node(sel,{'id' : "new_"+idx, 'text' : '명칭 변경',"li_attr" : { "isRegisted" : false}});
							if(sel) {
								ref.edit(sel,null,function(node,status){
									//저장 루틴
									treeProcess(0, node.text, node.parent, 0, 1, node);
								});
								initEditor();
								offEditor();
							}
							idx++;
						}
					},
					"Rename": {
						"separator_before" : true,
						"label": "이름 수정",
						"icon" : "/images/icon/edit.svg",
						"action": function (data) {
							var inst = $.jstree.reference(data.reference);
								obj = inst.get_node(data.reference);
							inst.edit(obj,null,function(node,status){
								
								//수정
								treeProcess(node.id, node.text, 0, 0, 2, node);
							});
						}
					},
					"Delete": {
						"separator_before" : true,
						"label": "삭제",
						"icon" : "/images/icon/remove.svg",
						"action": function (data) {
							var ref = $.jstree.reference(data.reference),
								sel = ref.get_selected();
							if(!sel.length) { return false; }
							ref.delete_node(sel);
						}
					}
					/*,
					"AddIntorduction": {
						"separator_before" : true,
						"separator_after" : false,
						"label": "이론 등록",
						"action": function (data) {
							var ref = $.jstree.reference(data.reference);
							//console.log(ref);
							sel = ref.get_selected();
							//console.log(sel[0]);
							var oElement = $("#" + sel[0]);
							var type = oElement.attr('isregisted');
							//console.log(typeof type + " // " + type);
							initEditor();
							onEditor();
							if(type === 'true'){
								//우측에 편집창 disable false => true
								
							}
							
						}
					}
					*/
				};
			}
		}
	}).on('loaded.jstree', function(event, data) {
		//tree가 불러 졌을때 처리 추가
		//먼저 트리를 불러와서 모두 펼쳐 놓기 진행
		$(this).jstree('open_all');
		//var jsonArr = $(this).jstree(true).get_json('#', { flat: true });
		//console.log(data.node);
		
		var jsonArr = $(this).jstree(true).get_json('#', { flat: true });
		
		jsonArr.forEach(function(item){
			//각 트리의 노드별로 이론이 등록되어 있는지 아닌지 아이콘으로 표시.
			var setHtml = "";
			if($("#"+item.id+" > a").find("span").length == 0){
				if(item.li_attr.isRegisted){
					setHtml = "<span style='padding-left:8px'><img src='/images/icon/check.svg' style='width:20px;height:20px'></span>";
				}else{
					setHtml = "<span style='padding-left:8px'><img src='/images/icon/uncheck.svg' style='width:20px;height:20px'></span>";
				}
				$("#"+item.id+" > a").append(setHtml);
			}
		});
		
		
	}).on("hover_node.jstree", function (node) {
		//node에 마우스 올렸을시 처리 추가
		//console.log(node);
		
	}).on("changed.jstree", function (node) {
		//상태변경시 처리 추가
		//console.log(node);
		//console.log("changed");
	}).on("open_node.jstree", function (event, data) {
		//console.log(data.node);
		var jsonArr = $(this).jstree(true).get_json('#', { flat: true });
		
		jsonArr.forEach(function(item){
			//각 트리의 노드별로 이론이 등록되어 있는지 아닌지 아이콘으로 표시.
			var setHtml = "";
			if($("#"+item.id+" > a").find("span").length == 0){
				if(item.li_attr.isRegisted){
					setHtml = "<span style='padding-left:8px'><img src='/images/icon/check.svg' style='width:20px;height:20px'></span>";
				}else{
					setHtml = "<span style='padding-left:8px'><img src='/images/icon/uncheck.svg' style='width:20px;height:20px'></span>";
				}
				$("#"+item.id+" > a").append(setHtml);
			}
		});
		/*
		var setHtml = "";
		//console.log($("#"+data.node.id+" > a").find("span").length);
		if($("#"+data.node.id+" > a").find("span").length == 0){
			if(data.node.li_attr.isRegisted){
				setHtml = "<span style='padding-left:8px'><img src='/images/icon/check.svg' style='width:20px;height:20px'></span>";
			}else{
				setHtml = "<span style='padding-left:8px'><img src='/images/icon/uncheck.svg' style='width:20px;height:20px'></span>";
			}
			$("#"+data.node.id+" > a").append(setHtml);
		}
		for(var i = 0; i < data.node.children.length; i++){
			
			var tmpnode = $(this).jstree(true).get_node(data.node.children[i]);
			
			var setChildrenHtml = "";
			if($("#"+tmpnode.id+" > a").find("span").length == 0){
				if(tmpnode.li_attr.isRegisted){
					setChildrenHtml = "<span style='padding-left:8px'><img src='/images/icon/check.svg' style='width:20px;height:20px'></span>";
				}else{
					setChildrenHtml = "<span style='padding-left:8px'><img src='/images/icon/uncheck.svg' style='width:20px;height:20px'></span>";
				}
				$("#"+tmpnode.id+" > a").append(setChildrenHtml);
			}
			
		}
		*/
		
		//console.log(data.node.children);
		//console.log(data.node.children.length);
		
	}).on("select_node.jstree",function(event, data){
	
		if($("#changeFlg").val() == 1){
			//초기화
			initEditor();
			onEditor();
			$("#txtEidIdx").val("0");
			$("#txtEiiIdx").val(data.node.id);
			
			//노드 선택시 저장버튼 표시
			$("#btnSave, #btnIndex").show();
			if(data.node.li_attr.isRegisted){
				//기초 이론 불러오기
				loadDetailInfo(data.node.id);
			}
			$("#changeFlg").val("1");
			
		}else{
		
			if($("#txtEiiIdx").val() != data.node.id){
				if(confirm("기초이론의 정보가 변경 되었습니다. \n 저장하지 않고 다른작업을 진행하시겠습니까?")){
					//초기화
					initEditor();
					onEditor();
					$("#txtEidIdx").val("0");
					$("#txtEiiIdx").val(data.node.id);
					
					//노드 선택시 저장버튼 표시
					$("#btnSave, #btnIndex").show();
					if(data.node.li_attr.isRegisted){
						//기초 이론 불러오기
						loadDetailInfo(data.node.id);
					}
					$("#changeFlg").val("1");
				}else{
					$(targetId).jstree("deselect_node",data.node.id);
					$(targetId).jstree("select_node",$("#txtEiiIdx").val());
				}
			}
		}
		
	}).bind("refresh.jstree", function(e,d){
	
		$(this).jstree('open_all');
		var jsonArr = $(this).jstree(true).get_json('#', { flat: true });
		
		jsonArr.forEach(function(item){
			if($("#"+item.id+" > a").find("span").length == 0){
				var setHtml = "";
				if(item.li_attr.isRegisted){
					setHtml = "<span><img src='/images/icon/check.svg' style='width:20px;height:20px'></span>";
				}else{
					setHtml = "<span><img src='/images/icon/uncheck.svg' style='width:20px;height:20px'></span>";
				}
				$("#"+item.id+" > a").append(setHtml);
			}
		});
	});
	
	$(document).bind('dnd_stop.vakata',function(e,data){
		treeSeqOrderProcess2();
	});
}

function treeProcess(idx,title,refIdx,seq, processType, node){
	
	$.ajax({
		url:"/adm/BOT/treeInfoProcess.do",
		type:"POST",
		data : {
			eii_idx : idx,
			eii_title : title,
			eii_ref_idx : refIdx,
			eii_seq : seq,
			processType : processType,
			egi_idx : $("#txtEgiIdx").val()
			
		},
		dataType : "json",
		success: function(data){
			if(data.result == 1){
				if(processType == 1){
					$(targetId).jstree(true).set_id(node,data.getEiiIdx);
				}
			}
		},
		complete : function(){
			//treeSeqOrderProcess();
			treeSeqOrderProcess2();
		},
		error:function(request,status,error){
			console.log("code:"+request.status+"\n message:"+request.responseText+"\n error:"+error);
		}
	});
}

function treeSeqOrderProcess(){
	$.ajax({
		url:"/adm/BOT/treeOrderProcess.do",
		type:"POST",
		data : "jsonData=" +getNodeInfos(),
		dataType : "json",
		success: function(data){
			if(data.result == "1"){
				console.log("ordering completed!");
			}else{
				console.log("ordering failed");
			}
		},
		error:function(request,status,error){
			console.log("code:"+request.status+"\n message:"+request.responseText+"\n error:"+error);
		},
		complete : function(){
			$(targetId).jstree(true).settings.core.data = { url : "/adm/BOT/loadTree.do?egi_idx=" + $("#txtEgiIdx").val(), dataType: "json" };
			setTimeout($(targetId).jstree(true).refresh(),200);
		}
	});
}

function treeSeqOrderProcess2(){
	
	var tmpArr= $(targetId).jstree(true).get_json('#', { flat: true });
	
	//console.log(tmpArr.length);
	
	var listLength = tmpArr.length;
	var tmpA = Math.floor(listLength / 50);
	var tmpB = listLength % 50;
	
	//console.log(tmpA + " / " + tmpB);
	
	var setCnt = tmpA;
	
	if(tmpB > 0){
		 setCnt = setCnt + 1;
	}
	
	var setStart = 1;
	var setEnd = 0;
	//console.log(tmpArr.length);
	//var loopflg = false;
	for(var i = 1 ; i < setCnt ; i++){
		
		if(tmpA != i){
			setStart = setEnd + 1;
			setEnd = i * 50;
		}else{
			setStart = setEnd + 1;
			setEnd = tmpArr.length;
		}
		
		//console.log(i + " ====== "  + setStart + " ~ " + setEnd);
		
		$.ajax({
			url:"/adm/BOT/treeOrderProcess.do",
			type:"POST",
			data : "jsonData=" + getNodeInfos2(setStart, setEnd, tmpArr),
			//dataType : "json",
			success: function(data){
				//console.log(i + " result ========= " + data.result);
				if(data.result == "1"){
					//console.log("ordering completed!");
				}else{
					//console.log("ordering failed");
				}
				//console.log("tmpA :::::::" + tmpA + "/ i ::::::" +i);
			},
			error:function(request,status,error){
				console.log("code:"+request.status+"\n message:"+request.responseText+"\n error:"+error);
			},
			complete : function(){
				if(tmpA == (i - 1)){
					//$(targetId).jstree(true).settings.core.data = { url : "/adm/BOT/loadTree.do?egi_idx=" + $("#txtEgiIdx").val(), dataType: "json" };
					setTimeout($(targetId).jstree(true).refresh(),200);
					//console.log("aaaaaa");
				}
			}
		});
		/*
		console.log("tmpA :::::::" + tmpA + "/ i ::::::" +i);
		if(tmpA == i){
			//setTimeout($(targetId).jstree(true).refresh(),3000);		
			console.log("bbbbb");
		}
		*/
	}
	
	
}

function loadDetailInfo(eiiIdx){
	//console.log("loading bar 활성화");
	$("#ajaxing").show();
	$.ajax({
		url:"/adm/BOT/loadDetailInfo.do",
		type:"POST",
		data : "eii_idx=" + eiiIdx,
		dataType : "json",
		success: function(data){
			var result = data.result;
			var detailContent = data.detailContent;
			var eididx = data.eididx;
			if(result == "1"){
				setContent(detailContent);
				$("#txtEidIdx").val(eididx);
			}
		},
		error:function(request,status,error){
			console.log("code:"+request.status+"\n message:"+request.responseText+"\n error:"+error);
		},
		complete : function(){
			//console.log("loading bar 비활성화");
			$("#ajaxing").hide();
		}
	});
}

