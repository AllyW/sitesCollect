$(document).ready(function(){
	$(".c-menu").on("click", function(){
		$(".c-menu").removeClass("menuFocus");
		$(this).addClass("menuFocus");
		var id = this.id,
			tid = id.slice(-1);
		$(".c-content").removeClass("showContent");
		$("#i-content" + tid).addClass("showContent");
	});
});
