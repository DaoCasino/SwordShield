import './style.less'
import $ from 'jquery'

document.addEventListener('DOMContentLoaded', ()=>{
	$('body').append('<div id="log"></div>')

	var $log = $('#log')

	$log.append('<div>'+window.location.hash+'</div>')
})
