document.write('<link rel="stylesheet" href="/js/jsTree/css/style.css">');
//document.write('<script src="/js/jquery-3.6.1.js"></script>');
document.write('<script src="/js/jsTree/js/jstree.js"></script>');

var targetId = "";

var idx = 1;

function setNodeSelect(id){
	$(targetId).jstree("select_node",id);
}

function closeAll(){
	
	$(targetId).jstree('close_all');
}

function openNode(nodeid){
	
	$(targetId).jstree("oepn_node",nodeid);
}



function openAll(){
	$(targetId).jstree('open_all');
	//$(targetId).jstree(true).refresh();
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
	
	$(targetId).jstree({
		'get_selected' : true,
		"core" : {
			"data" : { 
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
		"plugins" : [ "search","ui","types" ]
		
	}).on('loaded.jstree', function(event, data) {
		//tree가 불러 졌을때 처리 추가
		//먼저 트리를 불러와서 모두 펼쳐 놓기 진행
		$(this).jstree('close_all');
		
	}).on("hover_node.jstree", function (node) {
		//node에 마우스 올렸을시 처리 추가
		//console.log(node);
		
	}).on("changed.jstree", function (node) {
		//상태변경시 처리 추가
		//console.log(node);
		//console.log("changed");
		
	}).on("open_node.jstree", function (event, data) {
		//console.log(data.node);
		
		
	}).on("select_node.jstree",function(event, data){
	
		$(this).jstree("open_node",data.node.id);
		loadDetailInfo(data.node.id,data.node.text);
		
	});
}

function loadDetailInfo(eiiIdx,title){
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
			var settitle = data.eiiTitle;
			$("#liTitle").text(settitle);
			$("#h2Title").text(settitle);
			$(".sun-editor-editable").empty();
			
			if(result == "1"){
				$(".sun-editor-editable").html(detailContent);
			}else{
				$(".sun-editor-editable").append('<div class="error-comment">\n<img src="/images/common/er-preparing.png" alt="준비중입니다.">\n<p><span>준비중</span>입니다.</p>\n</div>');
			}
			
			window.scrollTo({top:0,behavior:'smooth'});
			
		},
		error:function(request,status,error){
			console.log("code:"+request.status+"\n message:"+request.responseText+"\n error:"+error);
		},
		complete : function(){
			//console.log("loading bar 비활성화");
			$("#ajaxing").hide();
			
			var item = $('.sun-editor-editable .katex');
			item.parent().addClass('katex-item');
		
			$('.katex-item').each(function(key,val) {
		
				//공백제거
				if( $(this).length ) {
					$(this).html( $(this).html().replaceAll( /\u200B/g , "" ) );
					$(this).html( $(this).html().replaceAll( "<br>" , "" ) );
				}
		
				var oldCount = $(this).text();
				var newCount = $(this).find('.katex').text();
		
				if( oldCount.length == newCount.length ) {
					//스타일 추가
					$(this).removeClass('katex-item').addClass( 'katex-block' );
				} else {
					//
					$(this).addClass( 'katex-item' );
				}
			});
			
			//img viewer - 확대보기
			var theoryImg = $(".se-image-container img");
			console.log(theoryImg);
			
			theoryImg.each(function (key, val) {
		
				//add enlarge button
				$(this).wrap('<div class="img-viewer"></div>');
		
				//크기 비교 후 원본이 클 경우에만, 확대보기 버튼 추가
				var oriWidth = $(this).prop('naturalWidth');
				var imgWidth = $(this).width();
		
				//console.log( theoryImg[key] );
				console.log( '원본크기: ' + oriWidth + ' / 출력크기: ' + imgWidth );
				
				//if( oriWidth > imgWidth ) {
				//	$(this).after("<button type='button' class='btn btn-sm btn-secondray' title='이미지 크게보기'><i class='bi bi-arrows-angle-expand'></i></button>");
				//}
				$(this).after("<button type='button' class='btn btn-sm btn-secondray' title='이미지 크게보기'><i class='bi bi-arrows-angle-expand'></i></button>");
		
			});
			
		}
	});
}

