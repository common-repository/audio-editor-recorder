<?php
if( ! function_exists('gspaudio_editor_shortcode'))
{
function gspaudio_editor_shortcode( $atts ) {
if(is_user_logged_in()){

		$message = gspaudio_short_code_get_html( $atts );

} else {
		$message = gspaudio_short_code_get_html( $atts );

}

return $message;
}
}

add_shortcode('audio-editor', 'gspaudio_editor_shortcode');


if( ! function_exists('gspaudio_short_code_get_html'))
{
function gspaudio_short_code_get_html( $atts ) {
	$a = shortcode_atts( array(
		'mini' => 'false',
		'color' => '#505050',
		'remove-buttons' => '',
		'button-text' => '',
		'logged-in-only' => 'true',
		'review' => 'true',
		'redirect-url' => '', // Ajout de l'attribut pour l'URL de redirection personnalisée
	), $atts );

wp_enqueue_style( 'gsp-font-awesome', plugins_url( '../assets/css/font-awesome.min.css?id='.rand(), __FILE__ ),false,true );
wp_enqueue_script( 'gsp-bootstrap-edit', plugins_url( '../assets/js/custom.js?id='.rand(),  __FILE__ ),false,false );
    $translation_array = array(
		'plugins_url' =>plugins_url(),
		'redirect_url' => $a['redirect-url'] ? $a['redirect-url'] : home_url('/' . __('my-audios', 'audio-editor-recorder')), // Utilisation de redirect_url
		'translate_success_sent_message' => __('Your audio was successfully sent.', 'audio-editor-recorder'), // Utilisation de redirect_url
		'translate_click' => __('Click', 'audio-editor-recorder'), // Utilisation de redirect_url
		'translate_to_record' => __('to record', 'audio-editor-recorder'), // Utilisation de redirect_url
		'translate_to_upload' => __('to upload a file', 'audio-editor-recorder'), // Utilisation de redirect_url
	);
wp_localize_script( 'gsp-bootstrap-edit', 'jsVars', $translation_array );

ob_start();
if (is_user_logged_in() || (!is_user_logged_in() && $a['logged-in-only'] == 'false') ){
?>
<?php if ($a['color'] == '#505050') : ?>
<style>
.audiolayout .editor-toolbar .fa.fa {
color: #505050 !important;
}
.audiolayout .editor-toolbar i.fa.fa-stop-circle {
    color: red !important;
}

</style>
<?php else : ?>
<style>
.audiolayout .editor-toolbar .fa.fa {
color: <?php echo $a['color']; ?> !important;
}

</style>
<?php endif;
if ( $a['remove-buttons'] ) {
        // Parse type into an array. Whitespace will be stripped.
        $a['remove-buttons'] = array_map( 'trim', str_getcsv( $a['remove-buttons'], ',' ) );
 ?>
<style>
	<?php
	foreach ($a['remove-buttons'] as $remove_button) {
	 ?>.audiolayout .<?php echo $remove_button ?> {display: none !important;}
	<?php } ?>
</style>
<?php } ?>
    <div class="audiolayout<?php if ($a['mini'] == 'true') : ?> mini<?php endif; ?>" <?php if ($a['mini'] == 'true') : ?>style="display:table;width:auto;"<?php endif; ?>>
    <div class="a_f_m modal" id="download_popup" >
				<div class="modal-body">

				</div>
			</div>
	<div class="row">
		<div class="col-sm-12 position_inherit editor-container" <?php if ($a['mini'] == 'true') : ?>style="padding:0 20px;"<?php endif; ?>>
			<div class="span12ww" style="display: none">
			<h6>Spectrum</h6>
			<div class="well">
			<div id="spectrum"></div>
			</div>
			</div>
			<div class="audiolayout-right" <?php if ($a['mini'] == 'true') : ?>style="display:inline-block;"<?php endif; ?>>

				<div class="audiowavesec" <?php if ($a['mini'] == 'true') {echo 'style="height:0!important;width:0!important;overflow:hidden;margin:0;"';} ?>>
					<div class="audioLayerControl" data-id="audioLayerControl" style="width: 100%">
					<div class="audioLayerControlmainbox">
					<div id="audioloader" class="none"><i class="fa fa-refresh fa-spin"></i></div>
					<audioLayerControl id="audioLayerControl" title="CloudCompany.mp3" ></audioLayerControl>
					</div>
					</div>
				</div>





				<div class="editor-toolbar">

				<div class="top-audiobar">
					<div class="microphone cursor_pointer tooltip_a_box record" data-toggle="tooltip" title="Start Record" id="btnstart_new"><i class="fa fa-microphone"></i>
					<br />
					<div class="audio-button-text"><?php _e('Record', 'audio-editor-recorder'); ?></div>
					</div>
					<div class="microphone cursor_pointer tooltip_a_box record"  id="btnstop_new" data-toggle="tooltip" title="Stop Record" style="display: none;"><i class="fa fa-stop-circle"></i>
					<br />
					<div class="audio-button-text"><?php _e('Stop', 'audio-editor-recorder'); ?></div>
					</div>

					<div class="upload fileupload file-upload cursor_pointer tooltip_a_box" data-toggle="tooltip" title="Upload" ><i class="fa fa-upload"></i>
					<br />
					<div class="audio-button-text"><?php _e('Upload', 'audio-editor-recorder'); ?></div>
					<input type="file" style="opacity: 0;display: none;" id="audio_file" accept="audio/*" />
					</div>
                    <div class="audioplayerbox" id="audioplayerbox" style="width: auto;height: 100%; border: 0;border-radius: 0;"></div>
					<div class="plus file-upload cursor_pointer combineaudio tooltip_a_box" data-toggle="tooltip" title="Upload" onClick="jQuery('#combineaudio_file').trigger('click');"><i class="fa fa-upload"></i>
					<br />
					<div class="audio-button-text"><?php _e('Upload', 'audio-editor-recorder'); ?></div>
					</div>
					<input type="file" style="opacity: 0;display: none;" id="combineaudio_file" accept="audio/*" multiple="" />
					<div class="play playbtn cursor_pointer tooltip_a_box" data-toggle="tooltip" title="Play" onclick="play_fun();" id="btn_play"><i class="fa fa-play"></i>
					<br />
					<div class="audio-button-text"><?php _e('Play', 'audio-editor-recorder'); ?></div>
					</div>
					<div class="play playbtn resetbtn re-select cursor_pointer tooltip_a_box" data-toggle="tooltip" title="Re-select" onclick="stop_fun();" id="btn_play" <?php if ($a['mini'] == 'true') {echo 'style="display:none;"';} ?>><i class="fa fa-i-cursor"></i><div class="audio-button-text"><?php _e('Re-select', 'audio-editor-recorder'); ?></div></div>

					<?php if ($a['mini'] == 'true') : ?>
					<?php else : ?>
					<div class="microphone zoom-in cursor_pointer tooltip_a_box" data-toggle="tooltip" title="Zoom in" onclick="audio_zoom_selection()"><i class="fa fa-search-plus"></i>
					<br />
					<div class="audio-button-text"><?php _e('Zoom in', 'audio-editor-recorder'); ?></div>
					</div>
					<div class="microphone zoom-out cursor_pointer" data-toggle="tooltip" title="Zoom out" onclick="audio_zoom_fit()"><i class="fa fa-search-minus"></i>
					<br />
					<div class="audio-button-text"><?php _e('Zoom out', 'audio-editor-recorder'); ?></div>
					</div>
					<?php endif; ?>
				</div>
				<div class="bottom-audiobar">
					<?php if ($a['mini'] == 'true') : ?>
					<?php else : ?>
					<div class="cut cursor_pointer" data-toggle="tooltip" title="Cut" onclick="audio_cut();"><i class="fa fa-cut"></i>
					<br />
					<div class="audio-button-text"><?php _e('Cut', 'audio-editor-recorder'); ?></div>
					</div>
                    <div class="paste copy cursor_pointer" data-toggle="tooltip" title="Copy" onclick="audio_copy();"><i class="fa fa-copy"></i>
					<br />
					<div class="audio-button-text"><?php _e('Copy', 'audio-editor-recorder'); ?></div>
					</div>
					<div class="paste cursor_pointer" data-toggle="tooltip" title="Paste" onclick="audio_paste();"><i class="fa fa-paste"></i>
					<br />
					<div class="audio-button-text"><?php _e('Paste', 'audio-editor-recorder'); ?></div>
					</div>
                    <div class="paste crop cursor_pointer" data-toggle="tooltip" title="Crop" onclick="audio_crop();"><i class="fa fa-crop"></i>
					<br />
					<div class="audio-button-text"><?php _e('Crop', 'audio-editor-recorder'); ?></div>
					</div>
					<div class="trash delete cursor_pointer" data-toggle="tooltip" title="Delete" onclick="audio_del();"><i class="fa fa-trash"></i>
					<br />
					<div class="audio-button-text"><?php _e('Delete', 'audio-editor-recorder'); ?></div>
					</div>
					<?php endif; ?>
					<div class="download cursor_pointer lk" data-toggle="tooltip" title="Download" onclick="audio_save_link(this);"><i class="fa fa-download"></i>
					<br />
					<div class="audio-button-text"><?php _e('Download', 'audio-editor-recorder'); ?></div>
					</div>

					<div class="reload cursor_pointer" data-toggle="tooltip" title="Reload page" onclick="window.location.reload();"><i class="fa fa-repeat"></i>
					<br />
					<div class="audio-button-text"><?php _e('Reload', 'audio-editor-recorder'); ?></div>
					</div>

				</div>
				</div>
				<a href="#" class="postdata cursor_pointer" data-toggle="tooltip" title="Post" style="display:none;"><i class="fa fa-wordpress" ></i> Publish audio</a>
			</div>
    <div class="a_f_m modal canceled" id="postdata" <?php if ($a['mini'] == 'true') : ?>style="display:inline-block;padding-bottom: 9px;margin: 0;vertical-align: middle;"<?php endif; ?> >
	<?php if ($a['mini'] == 'true') : ?>
	<?php else : ?>
      <div class="modal-header">
        <h4><?php _e('Audio Post Information', 'audio-editor-recorder'); ?></h4>
      </div>
	<?php endif; ?>
      <div class="modal-body">
			<form class="form-inlinef">
			<div class="a_form-group" <?php if ($a['mini'] == 'true') {echo 'style="margin-bottom:0;"';} ?>>
	<?php if ($a['mini'] == 'true') : ?>
				<input type="text" class="a_form-control" id="title" placeholder="<?php _e('Title', 'audio-editor-recorder'); ?>" value="<?php _e('Audio Title', 'audio-editor-recorder'); ?>" style="height:0 !important;width:0!important;border:0;padding:0;">

	<?php else : ?>
			<input type="text" class="a_form-control" id="title" placeholder="<?php _e('Title', 'audio-editor-recorder'); ?>" value="<?php _e('Audio Title', 'audio-editor-recorder'); ?>" style="height:42px;">
	<?php endif; ?>
			</div>
	<?php if ($a['mini'] == 'true') : ?>
	<?php else : ?>
			<div class="a_form-group">
			<textarea row="25" cols="25" placeholder="<?php _e('Description', 'audio-editor-recorder'); ?>" style="width: 100%;height: 90px;" id="description"></textarea>
			</div>
		<?php endif; ?>
			<div class="a_form-group audio-image"  <?php if ($a['mini'] == 'true') : ?>style="height:0;width:0;overflow:hidden;"<?php endif; ?>>
				<img src="<?php echo esc_attr(plugin_dir_url( __FILE__ ));?>../images/default_avater.png" id="preview_ie" style="width: 50px;">
				<button type="button" class="a_btn btn-primary" id="image_upload"><?php _e('Upload image', 'audio-editor-recorder'); ?></button>
				<input type="file" name="featured_image" style="opacity: 0" id="featured_image" accept="image/*">

			</div>
	<?php if ($a['mini'] == 'true') : ?>
	<?php else : ?>
			<div class="a_form-group categoriesbox">
				<button type="button" class="a_btn btn-primary addbutton"><i class="fa fa-plus"></i> <?php _e('Add categories', 'audio-editor-recorder'); ?></button>
			</div>

		<?php endif; ?>
			<div class="a_form-group save-audio">
	<?php if ($a['mini'] == 'true') : ?>
	<?php else : ?>
				<button type="button" class="a_btn btn-default senddata" data-type="draft"><?php _e('Save as draft', 'audio-editor-recorder'); ?></button>
	<?php endif; ?>

				<button type="button" class="a_btn btn-default senddata" id="senddata" data-type="<?php if ($a['review'] == 'false') : ?>publish<?php else : ?>pending<?php endif; ?>">
				<?php if ($a['button-text']) {
				echo $a['button-text'];
				}
				else {
				    if ($a['review'] == 'false') {
					echo _e('Publish', 'audio-editor-recorder');
					}
					else
					{
					echo _e('Send for review', 'audio-editor-recorder');
					}
					}
					?></button>
			</div>
			</form>
      </div>
      <div class="modal-footer" style="display:none;">
        <a href="#" class="a_btn" data-dismiss="modal"><?php _e('Close', 'audio-editor-recorder'); ?></a>
      </div>
    </div>

		</div>
	</div>
</div>


      <div class="row" style="display: none;">
        <div class="span4 offset4">
          <div class="progress progress-striped active">
            <div id="app-progress" class="bar" style="width: 0%;"></div>
          </div>
        </div>
      </div>
      <style type="text/css">
      	canvas:not(.audioLayerEditor){
      		display: none !important;
      	}
      </style>
	 <script type="text/javascript">
		var getid = 'audioLayerControl';
		jQuery('.fileupload').click(function(){
			jQuery('#audio_file').trigger('click');
				ob_end_clean();
		});

		function getgspaudio_wavdata()
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

        function gspaudio_download_audio(bitRate=0){
			if ( !jQuery('#audioLayerControl')[0].audioLayerControl.listOfSequenceEditors[0].audioSequenceReference )
            	return;
            jQuery("#download_popup .modal-body").html("<i class='fa fa-refresh fa-spin'></i>  <span id='progress_sp_more'>initializing...</span>");
            jQuery('body').append('<div class="a_modal-backdrop in"></div>');
        	jQuery("#download_popup").show();


        	var acontrol = jQuery('#audioLayerControl')[0].audioLayerControl;
			var wavdata = getgspaudio_wavdata();
			if(bitRate==0){
			var out_bitRate = '128k';
			} else {
			var out_bitRate = bitRate;
			}
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
					var url = window.URL.createObjectURL(blob);

					var a = document.createElement('a');
					a.href = url;
					a.download = 'export.mp3';
					a.style.display = 'none';
					document.body.appendChild(a);
					a.click();
					delete a;
					jQuery("#download_popup").removeClass('autoheight');
					jQuery('.a_modal-backdrop.in').remove();
					jQuery("#download_popup").hide();
					}
					);
        }

        jQuery('body').delegate('#savelink_more','click',function(){
        	var download_popup = jQuery('#download_popup input[name=more_bitRate]:checked').val();
        	console.log(download_popup);
        	gspaudio_download_audio(download_popup);
        });


		function audio_save_link(e){
			//console.log(e);
		if(jQuery('.download.cursor_pointer').hasClass('disabled')){
			jQuery('body').append('<div class="a_modal-backdrop in"></div>');
			jQuery('#limitexceedmodal').show();
		} else {
			 if ( !jQuery('#audioLayerControl')[0].audioLayerControl.listOfSequenceEditors[0].audioSequenceReference )
              return;
          	 jQuery("#download_popup .modal-header").remove();
			 var datahtml = '<div class="col-xs-12 col-sm-12"><h4 style="text-align: left;border-bottom: 1px solid #cdcdcd;margin-bottom: 15px;">Please select Bitrate<p></p></h4><div class="more_bitRate" style=" display: flex; align-items: center;"><label style=""><input type="radio" name="more_bitRate" value="96k" style=" margin: 0;"><span style="margin-left: 5px;">96k</span></label><label><input type="radio" name="more_bitRate" value="112k" style=" margin: 0;"><span style=" margin-left: 5px;">112k</span></label><label><input type="radio" name="more_bitRate" value="128k" checked="" style=" margin: 0;"><span style=" margin-left: 5px;">128k</span></label><label><input type="radio" name="more_bitRate" value="192k" style=" margin: 0;"><span style=" margin-left: 5px;">192k</span></label><label><input type="radio" name="more_bitRate" value="224k" style=" margin: 0;"><span style=" margin-left: 5px;">224k</span></label><label><input type="radio" name="more_bitRate" value="256k" style=" margin: 0;"><span style=" margin-left: 5px;">256k</span></label><label><input type="radio" name="more_bitRate" value="320k" style=" margin: 0;"><span style=" margin-left: 5px;">320k</span></label></div></div><div class="row top-buffer" style="padding-left: 25px; padding-right: 25px; text-align: center;"><div class="col-xs-12 col-sm-12" style="margin-top: 30px;"><div class="input-group" style="width:100%;text-align:center;"><a class="a_btn btn-sm btn-default" id="savelink_more"><i class="fa fa-save" style="margin-right: 10px !important;"></i>Save</a></div></div></div>';
			 jQuery("#download_popup").addClass('autoheight');
			jQuery("#download_popup .modal-body").before('<div class="modal-header"><button type="button" class="close closePop" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button><h4 class="modal-title">Save &amp; Export Audio</h4></div>');
            jQuery("#download_popup .modal-body").html("<div class='download_bitrate_html'>"+datahtml+"</div>");
			jQuery('body').append('<div class="a_modal-backdrop in"></div>');
    		jQuery('#download_popup').show();
		}
		}
		function audio_zoom_fit(){
		jQuery('#'+getid)[0].zoomToFit();
		}
		function audio_zoom_selection(){
		jQuery('#'+getid)[0].zoomIntoSelection();
		}
		function audio_all_select(){
		jQuery('#'+getid)[0].selectAll();
		}
		function audio_stop(){
		jQuery('#'+getid)[0].stop();
		}
		function audio_pause(){
		jQuery('#'+getid)[0].pause();
		}
		function audio_del(){
		jQuery('#'+getid)[0].del();
		}
		function audio_crop(){
		jQuery('#'+getid)[0].crop();
		}
		function audio_paste(){
		jQuery('#'+getid)[0].paste();
		}
		function audio_copy(){
		jQuery('#'+getid)[0].copy();
		}
		function audioplay(){
		// alert('play');
		jQuery('#'+getid)[0].play();
		}
		function audio_cut(){
		// alert('play');
		jQuery('#'+getid)[0].cut();
		}
	</script>
	<?php

	?>
	<script type="text/javascript">
		var plugin_url = '<?php echo esc_attr(plugin_dir_url( __FILE__ ));?>../assets/';

	</script>
    <script type="text/javascript">


              function refresh_statu()
            {
            	if ( jQuery('#audioLayerControl')[0].my_status() == "play" )
            	{
            		jQuery("#btn_play").html("<i class='fa fa-pause'>");
            	}
            	else
            	{
            		jQuery("#btn_play").html("<i class='fa fa-play'>");
            	}

            	if ( jQuery('#audioLayerControl')[0].my_status() == "play" ||
            		jQuery('#audioLayerControl')[0].my_status() == "pause" )
            	{
            		jQuery("#btn_set_start").removeClass("disabled");
            		jQuery("#btn_set_end").removeClass("disabled");
            	}
            	else
            	{
            		jQuery("#btn_set_start").addClass("disabled");
            		jQuery("#btn_set_end").addClass("disabled");
            	}

            }


            function play_fun()
            {
            	if ( jQuery('#audioLayerControl')[0].playStatu == "play" )
            	{
            		jQuery('#audioLayerControl')[0].my_pause();
            	}
            	else
            	{
					jQuery('#audioLayerControl')[0].my_setupdateui(refresh_statu);
					jQuery('#audioLayerControl')[0].my_play();
            	}
            	refresh_statu();
            }

            function stop_fun()
            {
            	jQuery('#audioLayerControl')[0].my_stop();
            	refresh_statu();
            }





                 setTimeout(function(){



            onDocumentLoaded();

            	   function handleFileSelect2(evt) {
            	 		   evt.stopPropagation();
             		   evt.preventDefault();
             		   var files = evt.target.files;
             		   //console.log(files);
             		  jQuery('#audioLayerControl')[0].loadfile(files,(jQuery(evt.currentTarget).attr('id') == "combineaudio_file") );
             		  this.value = null;
            		}

              		document.getElementById('audio_file').addEventListener('change', handleFileSelect2, false);
            	  	document.getElementById('combineaudio_file').addEventListener('change', handleFileSelect2, false);


            	   let audioIN = { audio: true };
    //  audio is true, for recording

    // Access the permission for use
    // the microphone
    navigator.mediaDevices.getUserMedia(audioIN)

      // 'then()' method returns a Promise
      .then(function (mediaStreamObj) {




        // Start record
        let start = document.getElementById('btnstart_new');

        // Stop record
        let stop = document.getElementById('btnstop_new');

        // This is the main thing to recorde
        // the audio 'MediaRecorder' API
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        // Pass the audio stream

        // Start event
        var i=0;
        start.addEventListener('click', function (ev) {
          document.getElementById('audioplayerbox').innerHTML = '';

           // Connect the media stream to the




          document.getElementById('audioplayerbox').innerHTML = '<audio id="audio-player" controls="controls"></audio>';
          let audio = document.getElementById('audio-player');

          //returns the recorded audio via 'audio' tag
          audio.muted=true;
          // 'srcObject' is a property which
          // takes the media object
          // This is supported in the newer browsers
          if ("srcObject" in audio) {
          audio.srcObject = mediaStreamObj;
          }
          else {   // Old version
          audio.src = window.URL
          .createObjectURL(mediaStreamObj);
          }
          mediaRecorder.start();
          audio.play();
          start.style.display='none';
          stop.style.display='block';

        })

        // Stop event
        stop.addEventListener('click', function (ev) {
           mediaRecorder.stop();
           start.style.display='block';
          stop.style.display='none';
        });

        // If audio data available then push
        // it to the chunk array
        mediaRecorder.ondataavailable = function (ev) {
          dataArray.push(ev.data);
        }

        // Chunk array to store the audio data
        let dataArray = [];

        // Convert the audio data in to blob
        // after stopping the recording
        mediaRecorder.onstop = function (ev) {

          // blob of type mp3
          let audioData = new Blob(dataArray,
                    //{ 'type': 'video/ogg' });
                   { 'type': 'audio/mpeg-3' });


          //console.log(audioData);

          // After fill up the chunk
          // array make it empty
          dataArray = [];

          // Creating audio url with reference
          // of created blob named 'audioData'
          let audioSrc = window.URL
              .createObjectURL(audioData);
            document.getElementById('audioplayerbox').innerHTML = '';
            document.getElementById('audioplayerbox').innerHTML = '<audio id="audio-player" controls="controls" src="'+audioSrc+'"></audio>';

           var files = [];
            const myFile = new File([audioData], "audiorecording.mp3", {
            //type: 'video/ogg',
            'type': 'audio/mpeg-3',
            });
            files.push(myFile);
            var dddd = document.getElementsByTagName("audiolayercontrol")[0];
            //handleFiles(myFile,dddd.masterObj);
            jQuery('#audioLayerControl')[0].loadfile(files,true );
        }
      })

      // If any error occurs then handles the error
      .catch(function (err) {
        console.log(err.name, err.message);
      });


                  },5000);

         </script>




    <div class="a_f_m modal" id="limitexceedmodal" <?php if ($a['mini'] == 'true') : ?>style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;"<?php endif; ?>>
      <div class="modal-body">
	  <p><b>You have exceeded the maximum 1 minute saving time</b></p>
        <br />
        <p>Please delete some of your audio to keep under 1 minute.</p>
        <p>You can also buy the pro license (See settings)</p>
      	</div>
      <div class="modal-footer">
        <a href="#" class="a_btn" data-dismiss="modal">Close</a>
      </div>
    </div>
    <div class="clear"></div>
    <script type="text/javascript">
    	var jj= 1;
    	jQuery('.addbutton').click(function(){
    		jQuery('.categoriesbox').append('<div class="categories_box"><input type="text" placeholder="Enter Category" name="categories[]" class="categories a_form-control" data-id="'+jj+'"><i class="fa fa-minus deleteca"></i><div style="clear:both"></div></div>');
    		jj++;
    	});
    	jQuery('body').delegate('.deleteca','click',function(){
    		jQuery(this).parent().remove();
    	});
    	jQuery('#image_upload').click(function(){
    		jQuery('#featured_image').trigger('click');
    	});
		jQuery("#featured_image").change(function(){
			readURL(this);
		});
		function readURL(input) {
			var url = input.value;
			var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
			if (input.files && input.files[0]&& (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
			var reader = new FileReader();

			reader.onload = function (e) {
			jQuery('#preview_ie').attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]);
			}else{
			jQuery('#preview_ie').attr('src', '<?php echo esc_attr(plugin_dir_url( __FILE__ ));?>../images/default_avater.png');
			}
		}
    	jQuery('.senddata').click(function(){
    		if(jQuery(this).hasClass('disabled')){
    			jQuery('body').append('<div class="a_modal-backdrop in"></div>');
    			jQuery('#limitexceedmodal').show();
    		} else {
    			jQuery('body').append('<div class="a_modal-backdrop in"></div>');
    			jQuery('#postdata').show();
			}

    	});
    </script>
<?php
}

else {
	echo _e('You are logged out with no access to this ressource', 'audio-editor-recorder');
}
return ob_get_clean();
 }

}


?>