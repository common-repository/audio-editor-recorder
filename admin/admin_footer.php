<?php
global $post;
if(isset($post->post_type) && $post->post_type == 'audio'){
	add_action( 'admin_enqueue_scripts', 'gspaudio_admin_footer' );
		if( ! function_exists('gspaudio_admin_footer'))
		{
			function gspaudio_admin_footer() {
				wp_enqueue_style( 'gspaudio_admincss', plugins_url( '../assets/css/admin.css', __FILE__ ) );
			}
		}
?>
<script type="text/javascript" >
var $ = jQuery;
jQuery.noConflict();
jQuery(document).ready(function() {
jQuery('#download_popup').remove();
jQuery('body').prepend('<div class="modal" id="download_popup" ><div class="modal-body"></div></div>');

function gspaudio_wavdata()
{
	var acontrol = jQuery('#audioLayerControl')[0].audioLayerControl;
	var wave = new WaveTrack();
    var sequenceList = [];
    for(var i = 0; i < acontrol.listOfSequenceEditors.length; ++i)
    {
        sequenceList.push(acontrol.listOfSequenceEditors[i].audioSequenceReference);
    }
    wave.fromAudioSequences(sequenceList);
    return wave.encodeWaveFile();
}

var jj =0;
jQuery('body').delegate('.limitexceedmodalpopup','click',function(){
	jQuery('body').append('<div class="a_modal-backdrop in"></div>');
	jQuery('#limitexceedmodal').show();
});
jQuery('body').delegate('#publish,.editor-post-publish-button','click', function( event ) {
if(jj==0){
	event.preventDefault();
}
if(jQuery(this).hasClass('disabled')){
	jQuery('.limitexceedmodalpopup').trigger('click');
} else {
	var title = jQuery('input[name=post_title]').val();

	if(typeof title == 'undefined'){
		var title = jQuery('.editor-post-title textarea').text();
		if(title == ''){
			var title = jQuery('h1.editor-post-title').text();
		}
	}

	var fileara = jQuery('#audioLayerControl')[0].returnbloburl();
	var aul = document.createElement('audio');
	aul.src = fileara;
	var access = localStorage.getItem("access");
    if(access=='no'){
	aul.addEventListener('loadedmetadata', function(){
	var duration_l = aul.duration;
	duration = Number(duration_l);


	if(duration>60){
		jQuery('.limitexceedmodalpopup').trigger('click');
	} else {
			if ( !jQuery('#audioLayerControl')[0].audioLayerControl.listOfSequenceEditors[0].audioSequenceReference ){
            	return;
            }
            jQuery('.downl_modalpopup').trigger('click');
            jQuery("#download_popup .modal-body").html("<i class='fa fa-refresh fa-spin'></i>  <span id='progress_sp_more'>initializing...</span>");

			var postID=jQuery('#post_ID').attr('value');
        	var acontrol = jQuery('#audioLayerControl')[0].audioLayerControl;
			var wavdata = gspaudio_wavdata();
			var out_bitRate = '128k';
			audio_convert(
			wavdata,
			out_bitRate,
			2,
			'mp3',
			function process(pent){
			jQuery("#progress_sp_more").html( pent + "%");
			},
			function done(audiodata,outputfile)
			{
			var blob = new Blob([audiodata]);
			var form  = new FormData();
			var filemname = title.replace(/ /g,"_");
			form.append('audio', blob,filemname+'.mp3');
			form.append('action', 'audioupdatefromadmin');
			form.append('post_id', postID);

			var url = "<?php echo esc_url(admin_url('admin-ajax.php')); ?>";

			jQuery.ajax({
			type:'POST',
			url:url,
			data:form,
			dataType:'json',
			contentType: false,
			processData: false,
			beforeSend:function(){
			jQuery('body').prepend('<div class="loadingbox"><div class="lds-dual-ring"></div></div>');
			},
			success:function(data){
			jQuery('.loadingbox').remove();
			window.location.reload();
			if(jj==1){
			jj=-1;

			} else {
			//jQuery('.editor-post-publish-button').trigger('click');
			//jQuery('#publish').trigger('click');
			}

			jj++;

			}
			});




			}
			);






	}

	});
	} else {
		if ( !jQuery('#audioLayerControl')[0].audioLayerControl.listOfSequenceEditors[0].audioSequenceReference ){
		return;
		}
		jQuery('.downl_modalpopup').trigger('click');
		jQuery("#download_popup .modal-body").html("<i class='fa fa-refresh fa-spin'></i>  <span id='progress_sp_more'>initializing...</span>");
		var postID=jQuery('#post_ID').attr('value');
		var acontrol = jQuery('#audioLayerControl')[0].audioLayerControl;
		var wavdata = gspaudio_wavdata();
		var out_bitRate = '128k';
		audio_convert(
		wavdata,
		out_bitRate,
		2,
		'mp3',
		function process(pent){
		jQuery("#progress_sp_more").html( pent + "%");
		},
		function done(audiodata,outputfile)
		{
		var blob = new Blob([audiodata]);
		var form  = new FormData();
		var filemname = title.replace(/ /g,"_");
		form.append('audio', blob,filemname+'.mp3');
		form.append('action', 'audioupdatefromadmin');
		form.append('post_id', postID);

		var url = "<?php echo esc_url(admin_url('admin-ajax.php')); ?>";

		jQuery.ajax({
	type:'POST',
	url:url,
	data:form,
	dataType:'json',
	contentType: false,
	processData: false,
	beforeSend:function(){
		console.log('beforeSend');
	jQuery('body').prepend('<div class="loadingbox"><div class="lds-dual-ring"></div></div>');
	},
	success:function(data){
		jQuery('.loadingbox').remove();
			window.location.reload();
		if(jj==1){
			jj=-1;
			jQuery('.loadingbox').remove();
		} else {
		//jQuery('.editor-post-publish-button').trigger('click');
		//jQuery('#publish').trigger('click');
		}

		jj++;

	}
	});


		}
		);







}
}

});
jQuery('#save-post').one('click', function( event ) {
event.preventDefault();
event.stopImmediatePropagation();


if(jQuery(this).hasClass('disabled')){
	jQuery('.limitexceedmodalpopup').trigger('click');
} else {
	if ( !jQuery('#audioLayerControl')[0].audioLayerControl.listOfSequenceEditors[0].audioSequenceReference ){
		return;
		}
	jQuery('.downl_modalpopup').trigger('click');
	jQuery("#download_popup .modal-body").html("<i class='fa fa-refresh fa-spin'></i>  <span id='progress_sp_more'>initializing...</span>");
	var title = jQuery('input[name=post_title]').val();

	if(typeof title == 'undefined'){
		var title = jQuery('.editor-post-title textarea').text();
		if(title == ''){
			var title = jQuery('h1.editor-post-title').text();
		}
	}
	var postID=jQuery('#post_ID').attr('value');
	var blob = jQuery('#audioLayerControl')[0].returnblob();
	var form  = new FormData();
	var filemname = title.replace(/ /g,"_");
	form.append('audio', blob,filemname+'.mp3');
	form.append('action', 'audioupdatefromadmin');
	form.append('type', 'draft');
	form.append('post_id', postID);
	var url = "<?php echo esc_url(admin_url('admin-ajax.php')); ?>";
	jQuery.ajax({
	type:'POST',
	url:url,
	data:form,
	dataType:'json',
	contentType: false,
	processData: false,
	beforeSend:function(){
	jQuery('body').prepend('<div class="loadingbox"><div class="lds-dual-ring"></div></div>');
	},
	success:function(data){
		jQuery('.loadingbox').remove();
			window.location.reload();
	//console.log('dfdsfsd');
	//jQuery('#save-post').trigger('click');
	}
	});
}

});
});
</script>
<input type="hidden" id="home_url" data-href="<?php echo esc_url(home_url());?>">
<?php }?>