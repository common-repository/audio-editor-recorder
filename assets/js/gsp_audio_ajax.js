jQuery(document).ready(function($) {
	//$('body').delegate('.postdata')
	function get_wavdata()
        {
        	var acontrol = $('#audioLayerControl')[0].audioLayerControl;
        	var wave = new WaveTrack();
            var sequenceList = [];
            for(var i = 0; i < acontrol.listOfSequenceEditors.length; ++i)
            {
                sequenceList.push(acontrol.listOfSequenceEditors[i].audioSequenceReference);
            }
            wave.fromAudioSequences(sequenceList);
            return wave.encodeWaveFile();
        }
     function convertaudio(){


		}
	$('body').delegate('.senddata','click',function(){
		if($(this).hasClass('disabled')){
			jQuery('body').append('<div class="a_modal-backdrop in"></div>');
			$('#limitexceedmodal').show();
		} else {

		var title = $('#title').val();
		var des = $('#description').val();
		var type = $(this).data('type');
		var categoriess = $('.categories');
		var categories=[];
		categoriess.each(function(){
			categories.push($(this).val());
		});
		   if ( !$('#audioLayerControl')[0].audioLayerControl.listOfSequenceEditors[0].audioSequenceReference ){
            	return;
            }
            $("#download_popup .modal-body").html("<i class='fa fa-refresh fa-spin'></i>  <span id='progress_sp_more'>initializing...</span>");
        	var acontrol = $('#audioLayerControl')[0].audioLayerControl;
			var wavdata = get_wavdata();
			var out_bitRate = '128k';
			$('#postdata .modal-body').append('<div class="a_loadingbox">&nbsp;</div>');

			var image = jQuery('.a_form-group.audio-image').find('input[name=featured_image]')[0].files[0];
			var input = document.getElementById('featured_image');
			console.log(image);
			audio_convert(
			wavdata,
			out_bitRate,
			2,
			'mp3',
			function process(pent){
			$("#progress_sp_more").html( pent + "%");
			},
			function done(audiodata,outputfile)
			{
			var blob = new Blob([audiodata]);
			var form  = new FormData();

			form.append('action', 'postaudio');
			form.append('image', image);
			form.append('title', title);
			form.append('des', des);
			form.append('categories', categories);
			var filemname = title.replace(/ /g,"_");
			form.append('audio', blob,filemname+'.mp3');
			form.append('type', type);
			$.ajax({
			url:ajax_object.ajax_url,
			data:form,
			type:'POST',
			dataType:'json',
			mimeType: "multipart/form-data",
			contentType: false,
			processData: false,
			beforeSend:function(){
			$('#postdata .modal-body').html('<div class="a_loadingbox">&nbsp;</div>');

			},
			success:function(data){
			console.log(data);
			console.log(jsVars); // Ajoutez ceci pour vérifier l'objet
			if(data.status==1){
			$('#postdata .modal-body').html('<div class="loadingbox1" style="text-align:center;">' + jsVars.translate_success_sent_message + '</div>');
			setTimeout(function(){
			var redirectUrl = jsVars.redirect_url;
			window.location.href=redirectUrl;
			//	alert(redirectUrl);
			},1000);
			}
			}
			});
			}
			);
}});


$('body').delegate('.updateaudio','click',function(){

		if($(this).hasClass('disabled')){
			jQuery('body').append('<div class="a_modal-backdrop in"></div>');
			$('#limitexceedmodal').show();
		} else {

		var title = $('#title').val();
		var des = $('#description').val();

		var type = $(this).data('type');
		var post_id = $(this).data('post_id');
		var categoriess = $('.categories');
		var categories=[];
		categoriess.each(function(){
			categories.push($(this).val());
		});



        if ( !$('#audioLayerControl')[0].audioLayerControl.listOfSequenceEditors[0].audioSequenceReference ){
            	return;
            }
            $("#download_popup .modal-body").html("<i class='fa fa-refresh fa-spin'></i>  <span id='progress_sp_more'>initializing...</span>");
        	var acontrol = $('#audioLayerControl')[0].audioLayerControl;
			var wavdata = get_wavdata();
			var out_bitRate = '128k';
			$('#postdata .modal-body').html('<div class="a_loadingbox">&nbsp;</div>');
			$('#postdata .modal-footer').remove();
			audio_convert(
			wavdata,
			out_bitRate,
			2,
			'mp3',
			function process(pent){
			$("#progress_sp_more").html( pent + "%");
			},
			function done(audiodata,outputfile)
			{
			var blob = new Blob([audiodata]);
			var form  = new FormData();
			var image = jQuery('#featured_image')[0].files[0];
			form.append('action', 'updatepostaudio');
			form.append('image', image);
			form.append('title', title);
			form.append('des', des);
			form.append('categories', categories);
			var filemname =title.replace(/ /g,"_");

			form.append('audio', blob,filemname+'.mp3');
			form.append('type', type);
			form.append('post_id', post_id);


			$.ajax({
			url:ajax_object.ajax_url,
			data:form,
			type:'POST',
			dataType:'json',
			mimeType: "multipart/form-data",
			contentType: false,
			cache: false,
			processData: false,

			beforeSend:function(){
			$('body').prepend('<div class="loadingboxnew"><div class="lds-dual-ring"></div></div>');
			},
			success:function(data){
			if(data==1){
				$('#postdata .modal-body').html('<div class="loadingbox1" style="text-align:center;">You have successfully Updated.</div>');
			setTimeout(function(){
				window.location.reload();
			},1000);
			}
			}
			});

			}
			);


    }

});


$('body').delegate('.categories_box .categories','keyup',function(){
	var value = $(this).val();
	$('.autocompletebox').remove();
	var valuedataid = $(this).data('id');
	tvalue = $.trim($(this).val());
	if(tvalue !=''){
		$.ajax({
            url:ajax_object.ajax_url,
            type:'POST',
			dataType:'json',
			data:{action:"audio_autocomplete",'value':value},
			success:function(data){

				if(data.length>0){
					var datahtml = '<ul class="autocompletebox">';
					for(var i=0;i<data.length;i++){
						datahtml += '<li class="a_listitem">'+data[i]+'</li>';
					}
					datahtml += '</ul>';
					$('.categories_box .categories[data-id="'+valuedataid+'"]').after(datahtml);
				}
			}
        });
	}
});
$('body').delegate('.a_listitem','click',function(){
		var hh = $(this).html();

		$(this).parents('.categories_box').find('.categories').attr('value',hh);
		$(this).parents('.categories_box').find('.categories').val(hh);
		$('.autocompletebox').hide();
	});
$('.postdatanewd').click(function(){
	var post_id = $(this).data('post_id');
	$.ajax({
            url:ajax_object.ajax_url,
            type:'POST',
			dataType:'html',
			data:{action:"get_user_audio_data",'post_id':post_id},
			success:function(data){
			$('.afteloadingbox').html(data);
			$('#postdata .modal-body .a_loadingbox').hide();
			$('#postdata .modal-body .afteloadingbox').show();
			}
        });
});
$('body').delegate('a.a_btn[data-dismiss="modal"],button[data-dismiss="modal"]','click',function(e){
	e.preventDefault();
	$(this).parents('.modal').hide();
	$('.a_modal-backdrop.in').remove();
});
});