document.write('<link rel="stylesheet" href="/js/jsTree/css/style.css">');
//document.write('<script src="/js/jquery-3.6.1.js"></script>');
document.write('<script src="/js/jsTree/js/jstree.js"></script>');

var targetId = "";

// 부모 트리 모두 펼치기
function openParentNode(parentsNode) {
	var parentsArr = parentsNode;
	if (parentsArr.length > 0 & parentsArr[0] != "#") {
		parentsArr.reverse();
	}
	
	$.each(parentsArr, function(index, element) {
		$(targetId).jstree("open_node", $(targetId).jstree(true).get_node(element));
	});
}

function setNodeSelect(id){
	$(targetId).jstree("deselect_all");
	//$(targetId).jstree("select_node",id);
	
	// 현재 노드의 부모 트리 펼치기
	openParentNode($(targetId).jstree(true).get_node(id).parents);
	// 선택한 노드 포커스
	$("#" + id).find('a').attr('aria-selected', true);
	$("#" + id).find('a').addClass('jstree-clicked');
	
	var detail_json = $(targetId).jstree(true).get_node(id).li_attr;
	//console.log($(targetId).jstree(true).get_node(id).original.parent);
	
	var selected_egi_idx = detail_json.egi_idx;
	var selected_eot_idx = detail_json.eot_idx;
	var selected_id = detail_json.id;
	var selected_sort_num = detail_json.sort_num;
	var selected_level_1 = detail_json.level_1;
	var selected_level_2 = detail_json.level_2;
	var selected_level_3 = detail_json.level_3;
	var selected_level_4 = detail_json.level_4;
	
	reloadHeader($(targetId).jstree(true).get_node(id));
	
	setBtnDetailProcedure(selected_egi_idx, selected_eot_idx, selected_id, selected_sort_num, selected_level_1, selected_level_2, selected_level_3, selected_level_4);
}

// 이전, 다음 버튼 클릭 function 변경
function setBtnDetailProcedure(selected_egi_idx, selected_eot_idx, selected_id, selected_sort_num, selected_level_1, selected_level_2, selected_level_3, selected_level_4) {
	//befer, after
	$("#befer").removeAttr("onclick");
	$("#after").removeAttr("onclick");
	
	var beferFunction = "reloadSvgViewAndProcedure(0, " + selected_egi_idx + ", " + selected_eot_idx + ", '" + selected_id + "', " + selected_sort_num + ", " + selected_level_1 + ", " + selected_level_2 + ", " + selected_level_3 + ", " + selected_level_4 + ")";
	var afterFunction = "reloadSvgViewAndProcedure(1, " + selected_egi_idx + ", " + selected_eot_idx + ", '" + selected_id + "', " + selected_sort_num + ", " + selected_level_1 + ", " + selected_level_2 + ", " + selected_level_3 + ", " + selected_level_4 + ")";
	
	$("#befer").attr("onclick", beferFunction);
	$("#after").attr("onclick", afterFunction);
}

// 헤더 영역 목차 변경
function reloadHeader(dataNode) {
	$("[id^='li_dcs_header_depth_']").remove();
	
	var parentsArr = dataNode.parents;
	if (parentsArr.length > 0 & parentsArr[0] != "#") {
		parentsArr.reverse();
	}
	
	$.each(parentsArr, function(index, element) {
		if (element == "#") {
			return true;
		}
		
		var headerDepthText = $(targetId).jstree(true).get_node(element).text;
		var headerDepthTextHtml = "<li id='li_dcs_header_depth_" + index + "'><h6>" + headerDepthText + "</h6></li>";
		
		$("#ul_dcs_header").append(headerDepthTextHtml); 
	});
}

// 오른쪽 절차절 새로고침
function reloadSvgViewAndProcedure(click_event_flag, selected_egi_idx, selected_eot_idx, selected_id, selected_sort_num, selected_level_1, selected_level_2, selected_level_3, selected_level_4) {
	$.ajax({
		url:"/adm/FOM/detailMenuBeforeAfterById.do",
		type:"POST",
		data : {
			"click_event_flag" : click_event_flag,
			"egi_idx" : selected_egi_idx,
			"eot_idx" : selected_eot_idx,
			"id" : selected_id,
			"sort_num" : selected_sort_num,
			"level_1" : selected_level_1,
			"level_2" : selected_level_2,
			"level_3" : selected_level_3,
			"level_4" : selected_level_4,
		}, 
		dataType : "json",
		success: function(data){
			result = data.result;
			//subInfo = data.subInfo;
			//console.log(subInfo);
		},
		error:function(request,status,error){
			console.log("code:"+request.status+"\n message:"+request.responseText+"\n error:"+error);
		},
		complete:function(){
			//console.log(result);
			
			if (typeof(result) != 'undefined' && result != null && result != 0) {
				// 이전, 다음 버튼 클릭 했을 경우 트리 포커스
				if (click_event_flag == 0 || click_event_flag == 1) {
					setNodeSelect(result);
				}
				
				//console.log($(targetId).jstree(true).get_node(result));
				
				var detail_json = $(targetId).jstree(true).get_node(result).li_attr;
				
				var detail_egi_idx = detail_json.egi_idx;
				var detail_eot_idx = detail_json.eot_idx;
				var detail_level_1 = detail_json.level_1;
				var detail_level_2 = detail_json.level_2;
				var detail_level_3 = detail_json.level_3;
				var detail_level_4 = detail_json.level_4;
				
				$.ajax({
					url:"/adm/FOM/detailProcedure.do",
					type:"POST",
					data : {
						"egi_idx" : detail_egi_idx,
						"eot_idx" : detail_eot_idx,
						"level_1" : detail_level_1,
						"level_2" : detail_level_2,
						"level_3" : detail_level_3,
						"level_4" : detail_level_4,
					}, 
					dataType : "html",
					success: function(data){
						$("#detailProcedure").html(data);
					},
					error:function(request,status,error){
						console.log("code:"+request.status+"\n message:"+request.responseText+"\n error:"+error);
					},
					complete:function(){
					}
				});
				
				$.ajax({
					url:"/adm/FOM/detailSvgView.do",
					type:"POST",
					data : {
						"egi_idx" : detail_egi_idx,
						"eot_idx" : detail_eot_idx,
						"level_1" : detail_level_1,
						"level_2" : detail_level_2,
						"level_3" : detail_level_3,
						"level_4" : detail_level_4,
					}, 
					dataType : "html",
					success: function(data){
						$("#detailSvg").html(data);
					},
					error:function(request,status,error){
						console.log("code:"+request.status+"\n message:"+request.responseText+"\n error:"+error);
					},
					complete:function(){
					}
				});
			} else {
				// 이전 버튼
				if (click_event_flag == 0) {
					alert('이전 절차절이 존재하지 않습니다.');
				// 다음 버튼
				} else if (click_event_flag == 1) {
					alert('다음 절차절이 존재하지 않습니다.');
				} else {
					alert('선택 된 절차절이 존재하지 않습니다.');
				}
			}
		}
	});
}

// 트리 노트 로드
function loadTree(egi_idx, eot_idx){
	// inline data demo
	$(targetId).jstree({
		'get_selected' : true,
		'core' : {
			'data' : { 
					url : "/adm/FOM/detailMenuLoadTree.do?egi_idx=" + egi_idx + "&eot_idx=" + eot_idx, 
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
		}
	}).on('loaded.jstree', function(event, data) {
		//먼저 트리를 불러와서 모두 펼쳐 놓기 진행
		//$(this).jstree('open_all');
	}).on("hover_node.jstree", function (node) {
		//node에 마우스 올렸을시 처리 추가
		//console.log(node);
	
	}).on("changed.jstree", function (node) {
		//상태변경시 처리 추가
		//console.log(node);
		//console.log("changed");
		
	}).on("select_node.jstree",function(event, data){
		//console.log('select_node.jstree------------');
		//console.log(data.node);
		//console.log(data.node.li_attr);
		
		var selected_egi_idx = data.node.li_attr.egi_idx;
		var selected_eot_idx = data.node.li_attr.eot_idx;
		var selected_id = data.node.li_attr.id;
		var selected_sort_num = data.node.li_attr.sort_num;
		var selected_level_1 = data.node.li_attr.level_1;
		var selected_level_2 = data.node.li_attr.level_2;
		var selected_level_3 = data.node.li_attr.level_3;
		var selected_level_4 = data.node.li_attr.level_4;
		
		// 4레벨 일 경우에만 바꿈
		if (selected_level_4 != 0 && selected_level_4 != 99999) {
			reloadHeader(data.node);
			
			setBtnDetailProcedure(selected_egi_idx, selected_eot_idx, selected_id, selected_sort_num, selected_level_1, selected_level_2, selected_level_3, selected_level_4);
			reloadSvgViewAndProcedure(2, selected_egi_idx, selected_eot_idx, selected_id, selected_sort_num, selected_level_1, selected_level_2, selected_level_3, selected_level_4);
		}
	});
	
	$(document).bind('dnd_stop.vakata',function(e,data){
		treeSeqOrderProcess();
	});
}