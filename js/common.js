$(document).ready(function () {
	// Device dimensions
	const { availWidth, availHeight } = window.screen;

	// Store user's device details
	const details = navigator.userAgent;

	// Check if it's a mobile device
	const isMobileDevice = /android|iphone|kindle|ipad/i.test(details);
	if (isMobileDevice) {
		// 모바일용 옵션 처리
	}

	// Load SVG images
	$('img[src$=".svg"]').each(function () {
		const img = $(this);
		const imgURL = img.attr('src');
		const attributes = img.prop("attributes");

		$.get(imgURL, function (data) {
			const svg = $(data).find('svg').removeAttr('xmlns:a');

			$.each(attributes, function () {
				svg.attr(this.name, this.value);
			});

			img.replaceWith(svg);
		}, 'xml');
	});

	// PDF viewer click event
	$("#js-pdf").find("li > ul > li").on("click", function () {
		const page = $(this).find("a").prop("hash").split("#pdf")[1];
		const pdfSrc = $("#pdf").attr("src");

		if (!page || !pdfSrc) {
			console.error("페이지 해시 또는 PDF URL이 없습니다.");
			return;
		}

		const pdfURL = pdfSrc.split("#page=")[0];
		$("#pdf").attr("src", `${pdfURL}#page=${page}`);
		$("html, body").animate({ scrollTop: 0 }, 1000);
	});

	/* side-menu */
	const sideMenu = document.getElementById('side-menu');
	const toggleButton = document.getElementById('toggle-button');
	const toggleIcon = document.getElementById('toggle-icon');
	const menuList = document.getElementById('menu-list');
	const menuItems = document.querySelectorAll('.menu-item');

	// Add 'closed' class on initial load
	sideMenu.classList.add('closed');

	// 동적으로 인덱스 번호 할당
	menuItems.forEach((item, index) => {
		item.setAttribute('data-index', index + 1); // data-index 속성 추가
	});

	toggleButton.addEventListener('click', () => {
		const isOpen = menuList.classList.toggle('open');
		sideMenu.classList.toggle('closed', !isOpen);
		sideMenu.classList.toggle('open', isOpen);  // Add or remove the 'open' class
		menuList.classList.toggle('closed', !isOpen);
		toggleButton.classList.toggle('open', !isOpen);

		// ARIA 속성 업데이트
		toggleButton.setAttribute('aria-expanded', isOpen);
		menuList.setAttribute('aria-hidden', !isOpen);

		// 아이콘 텍스트 업데이트
		toggleIcon.textContent = isOpen ? 'chevron_left' : 'chevron_right'; // 아이콘 변경
	});

	// 메뉴 아이템 클릭 시 active 클래스 토글
	menuItems.forEach(item => {
		item.addEventListener('click', () => item.classList.toggle('active'));
	});

	//메뉴 클릭시 모달팝업 실행
	$('.menu-link').on('click', function (e) {
		e.preventDefault(); // 기본 클릭 동작 막기

		var modalUrl = $(this).data('url'); // 호출할 모달 HTML 주소
		var modalClass = $(this).data('class'); // 추가할 클래스

		// URL이 비어 있거나 없는 경우 처리
		if (!modalUrl) {
			$('#externalModal .modal-content').html('<div class="not-ready">준비중입니다.</div>');
			$('#externalModal').addClass(modalClass).modal('show');
		} else {
			/* // 모달 HTML을 비동기적으로 불러오기
			$('#externalModal .modal-content').load(modalUrl, function () {
				// 모달 로드 후 클래스를 추가
				$('#externalModal').addClass(modalClass).modal('show');
			}); */
			// 모달 HTML을 비동기적으로 불러오기
			$('#externalModal .modal-content').load(modalUrl, function () {
				// 모달 로드 후 클래스를 추가
				$('#externalModal').addClass(modalClass).modal('show');
				
				// fac 클래스가 있는 경우 collapsed 클래스 추가
				if ($('#externalModal').hasClass('facility')) {
					// 드래그 기능 활성화
					//makeModalDraggable('#externalModal');
				}

			});
		}
	});

	function makeModalDraggable(modalSelector) {
		const modal = $(modalSelector);
		const modalHeader = modal.find('.modal-header'); // modal-header 요소 선택
		const modalContent = modal.find('.modal-content'); // modal-content 요소 선택
		let offset = { top: 0, left: 0 };
		let isDragging = false;
	
		// modal-header에 마우스 이벤트 추가
		modalHeader.on('mousedown', function(e) {
			e.preventDefault(); // 기본 동작 방지
			isDragging = true;
	
			// 클릭한 위치에 대한 오프셋 계산
			offset = {
				top: e.clientY - modalContent.offset().top, // 마우스 클릭 시 Y좌표에서 modal-content의 Y좌표를 뺌
				left: e.clientX - modalContent.offset().left // 마우스 클릭 시 X좌표에서 modal-content의 X좌표를 뺌
			};
	
			// 드래그 중 마우스 움직임 처리
			$(document).on('mousemove.drag', function(e) {
				if (isDragging) {
					// 새로운 위치 계산
					const newTop = e.clientY - offset.top;  // mouse Y - 클릭 시 offset Y
					const newLeft = e.clientX - offset.left; // mouse X - 클릭 시 offset X
	
					// 모달의 새로운 위치 계산 (modal-content의 크기로 제한)
					const modalHeight = modalContent.outerHeight();
					const modalWidth = modalContent.outerWidth();
					const windowHeight = $(window).height();
					const windowWidth = $(window).width();
	
					// 화면 크기를 고려하여 modal-content 이동 범위 제한
					const constrainedTop = Math.min(Math.max(newTop, 0), windowHeight - modalHeight);
					const constrainedLeft = Math.min(Math.max(newLeft, 0), windowWidth - modalWidth);
	
					// modal-content 위치 업데이트
					modalContent.css({
						top: constrainedTop + 'px',
						left: constrainedLeft + 'px',
						position: 'absolute' // 드래그 시 position을 absolute로 변경
					});
	
					// 마우스 포인터와 modal-content 위치 출력
					console.log(`Mouse Position: (${e.clientX}, ${e.clientY})`);
					console.log(`Modal Content Position: (${modalContent.offset().left}, ${modalContent.offset().top})`);
				}
			});
		});
	
		// 드래그 종료 시 이벤트 리스너 제거
		$(document).on('mouseup.drag', function() {
			if (isDragging) {
				isDragging = false;
				$(document).off('mousemove.drag'); // mousemove 이벤트 해제
			}
		});
	
		// 모달이 닫힐 때 좌표값 초기화
		$(modalSelector).on('hidden.bs.modal', function() {
			modalContent.css({
				top: '0',
				left: '0',
				position: 'relative' // 초기 상태로 되돌림
			});
		});
	}
	

	$('#externalModal').on('hidden.bs.modal', function () {
		$(this).attr('class', 'modal fade'); // 기존 클래스 초기화
	});

	/*
	// 모달 드래그 기능 함수
	function makeModalDraggable(modalSelector) {
		$(modalSelector).draggable({
			handle: '.modal-header', // 드래그 핸들을 모달 헤더로 설정
			containment: 'window' // 드래그 범위를 윈도우로 제한
		});
	} */

	// 모달이 닫힐 때 추가된 클래스를 제거 (다음 호출에 영향 없도록)
	$('#externalModal').on('hidden.bs.modal', function () {
		// 현재 활성화된 메뉴 아이템에서 active 클래스 제거
		menuItems.forEach(item => {
			if (item.classList.contains('active')) {
				item.classList.remove('active');
			}
		});
	
		// 기존 클래스 초기화 (기본 클래스 유지)
		$(this).attr('class', 'modal fade'); // 기본 클래스만 남김
	});

	

	var $table = $('.table');

	// 테이블이 존재할 경우에만 처리
	if ($table.length > 0) {
		var $theadClone = $table.find('thead').clone();

		// 헤더 클론을 추가할 div가 있는지 확인하고 처리
		if ($('.table-header').length > 0) {
			$('.table-header').append($('<table class="table"></table>').append($theadClone));
		} else {
			console.warn('.table-header 요소가 존재하지 않습니다. 헤더 복사가 수행되지 않습니다.');
		}
	}


	/* 
	//Initialize popovers
	var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
	var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
		return new bootstrap.Popover(popoverTriggerEl);
	});

	// Popover가 제대로 초기화되었는지 확인
	if (popoverList.length > 0) {
		console.log('Popover가 성공적으로 초기화되었습니다.');
	} else {
		console.warn('Popover 초기화에 실패했습니다.');
	} 
	*/

});

// 함수가 전역에 정의되어야 팝업에서도 호출 가능
function showAlert() {
	alert("준비중입니다.");
}


/* 대시보드 모달 맨처음 띄우기 */
/* 
// Automatically load modal-06.html on page load
window.addEventListener('load', () => {
	const url = 'modal-06.html';  // URL of the default modal file

	// Fetch the external HTML content
	fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error('File not found');
			}
			return response.text();
		})
		.then(html => {
			// Insert the fetched HTML into the placeholder element
			document.getElementById('modal-content').innerHTML = html;

			// Add 'facility' and 'unfolded' classes to the modal
			let modalElement = document.getElementById('externalModal');
			//modalElement.classList.add('facility', 'unfolded');

			// Initialize the modal and show it
			let modal = new bootstrap.Modal(modalElement);
			modal.show();
		})
		.catch(error => {
			// If file not found or an error occurs, show alert message
			alert('준비중입니다.');
		});
});
 */




