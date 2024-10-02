$(document).ready(function () {
	Highcharts.chart('container', {
		chart: {
			zooming: {
				type: 'xy'
			}
		},
		title: {
			text: 'GT',
			align: 'left'
		},
		xAxis: [{
			categories: ['현재값', '기대값', '보정값'],
			crosshair: true
		}],
		yAxis: [{ // Primary yAxis
			labels: {
				format: '{value}%',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			},
			title: {
				text: '효율(HHV)',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			},
			min: 0, // 최소값 설정
			max: 100, // 최대값 설정
		}, { // Secondary yAxis
			title: {
				text: '출력(MW)',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			min: 0, // 최소값 설정
			max: 300, // 최대값 설정
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			opposite: true
		}],
		tooltip: {
			shared: true
		},
		legend: {
			align: 'left',
			verticalAlign: 'top',
			backgroundColor:
				Highcharts.defaultOptions.legend.backgroundColor || // theme
				'rgba(255,255,255,0.25)'
		},
		series: [{
			name: '출력',
			type: 'column',
			yAxis: 1,
			data: [
				{ y: 258.69, color: '#37A6FB' }, // 첫 번째 막대 색상
				{ y: 287.75, color: '#0060A9' }, // 두 번째 막대 색상
				{ y: 285.79, color: '#8800A3' }  // 세 번째 막대 색상
			],
			tooltip: {
				valueSuffix: ' MV'
			}
		}, {
			name: '효율',
			type: 'spline',
			data: [
				30.88, 36.04, 31.79
			],
			color: '#F24216', // 라인 색상 설정
			dashStyle: 'Dash', // 점선으로 설정
			tooltip: {
				valueSuffix: '%'
			}
		}]
	});

});