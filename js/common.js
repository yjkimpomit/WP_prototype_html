$(function () {
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

	// Util-box show/hide on scroll
	$(window).on('scroll', function () {
		const utilBox = $('.utill-box .user-top');
		const scrollTop = $(window).scrollTop();
		const winH = $(window).height();

		utilBox.css('display', scrollTop >= winH ? 'inline-flex' : 'none');
	});
});

/* lnb */
const gnbMenu = document.getElementById('gnb');
const toggleButton = document.getElementById('toggle-button');
const toggleIcon = document.getElementById('toggle-icon');
const sideMenu = document.getElementById('side-menu');
const menuItems = document.querySelectorAll('.menu-item');

// Add 'closed' class on initial load
gnbMenu.classList.add('closed');

// 동적으로 인덱스 번호 할당
menuItems.forEach((item, index) => {
	item.setAttribute('data-index', index + 1); // data-index 속성 추가
});

toggleButton.addEventListener('click', () => {
	const isOpen = sideMenu.classList.toggle('open');
	gnbMenu.classList.toggle('closed', !isOpen);
	gnbMenu.classList.toggle('open', isOpen);  // Add or remove the 'open' class
	sideMenu.classList.toggle('closed', !isOpen);
	toggleButton.classList.toggle('open', !isOpen);

	// ARIA 속성 업데이트
	toggleButton.setAttribute('aria-expanded', isOpen);
	sideMenu.setAttribute('aria-hidden', !isOpen);

	// 아이콘 텍스트 업데이트
	toggleIcon.textContent = isOpen ? 'chevron_left' : 'chevron_right'; // 아이콘 변경
});

// 메뉴 아이템 클릭 시 active 클래스 토글
menuItems.forEach(item => {
	item.addEventListener('click', () => item.classList.toggle('active'));
});


/* external html file to modal */
/* 
document.querySelectorAll('.menu-link').forEach(link => {
	link.addEventListener('click', (e) => {
		e.preventDefault(); // Prevent default behavior

		// Get the URL of the external HTML file from the data-url attribute
		const url = link.getAttribute('data-url');

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
				document.getElementById('modal-placeholder').innerHTML = html;

				// Initialize the modal and show it
				let modal = new bootstrap.Modal(document.getElementById('externalModal'));
				modal.show();
			})
			.catch(error => {
				// If file not found or an error occurs, show alert message
				alert('준비중입니다.');
			});
	});
});
 */
/* 
document.querySelectorAll('.menu-link').forEach(link => {
	link.addEventListener('click', (e) => {
		e.preventDefault(); // Prevent default behavior

		// Get the URL of the external HTML file from the data-url attribute
		const url = link.getAttribute('data-url');

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
				document.getElementById('modal-placeholder').innerHTML = html;

				// Check if jstree is present in the loaded content
				if (document.getElementById('jstree')) {
					// Initialize jstree
					initializeJSTree();
				}

				// Initialize the modal and show it
				let modal = new bootstrap.Modal(document.getElementById('externalModal'));
				modal.show();
			})
			.catch(error => {
				// If file not found or an error occurs, show alert message
				alert('준비중입니다.');
			});
	});
}); */

$(document).ready(function () {
	$('.menu-link').on('click', function (e) {
		e.preventDefault(); // 기본 동작 방지

		const url = $(this).data('url'); // data-url 값 가져오기
		const modalContent = $('#modal-content'); // 모달 콘텐츠 요소 선택

		if (url) {
			// data-url이 있는 경우 해당 HTML 파일을 로드
			modalContent.load(url, function (response, status, xhr) {
				if (status == "error") {
					modalContent.html("<p>모달 내용을 로드하는 중 오류가 발생했습니다.</p>");
				}
			});
		} else {
			// data-url이 없는 경우 준비 중 메시지 표시
			alert('준비중입니다.');
		}
	});

	//모달드래그 적용
	// 드래그 상태 변수
	var isDragging = false;
	var offset = { x: 0, y: 0 };

	// 드래그 기능을 설정하는 함수
	function enableDrag() {
		$(document).on('mousedown', '.modal-move .modal-header', function (e) {
			isDragging = true;
			var modal = $(this).closest('.modal'); // 현재 모달 가져오기
			offset.x = e.clientX - modal.offset().left;
			offset.y = e.clientY - modal.offset().top;
		});

		$(document).on('mousemove', function (e) {
			if (isDragging) {
				var modal = $('.modal-move.show'); // 보이는 modal-move 모달
				modal.css({
					left: e.clientX - offset.x,
					top: e.clientY - offset.y,
					position: 'absolute'
				});
			}
		});

		$(document).on('mouseup', function () {
			isDragging = false;
		});
	}

	// 드래그 기능 활성화
	enableDrag();
});

/* 대시보드 모달 띄우기 */
/* 
// Automatically load modal-06.html on page load
window.addEventListener('load', () => {
	const url = 'modal-01.html';  // URL of the default modal file

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
			document.getElementById('modal-placeholder').innerHTML = html;

			// Initialize the modal and show it
			let modal = new bootstrap.Modal(document.getElementById('externalModal'));
			modal.show();
		})
		.catch(error => {
			// If file not found or an error occurs, show alert message
			alert('준비중입니다.');
		});
});
 */



//Initialize popovers
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
	return new bootstrap.Popover(popoverTriggerEl);
});

//
function showAlert() {
    alert("준비중입니다.");
}


