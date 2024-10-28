<?php
if( ! function_exists('gspaudio_edit_shortcode'))
{
function gspaudio_edit_shortcode($atts='') {
  if(is_user_logged_in()){
    $datahref = $atts['datahref'];
    $message = gspaudio_user_audio_edit($datahref);
} else {
  $message = '<div class="container_audio audiolayout" style="background: #fff !important;text-align:center;">'. e_('Login Required!', 'audio-editor-recorder') . '</div>';
}
return $message;
}
}
add_shortcode('user-audio-edit', 'gspaudio_edit_shortcode');
if( ! function_exists('gspaudio_user_audio_edit'))
{
function gspaudio_user_audio_edit($datahref){
wp_enqueue_script( 'gsp-bootstrap', plugins_url( '../assets/js/custom.js?id=8892gg',  __FILE__ ),false,true );
$translation_array = array( 'plugins_url' =>plugins_url(),
'translate_click' => __('Click', 'audio-editor-recorder'), // Utilisation de redirect_url
'translate_to_record' => __('to record', 'audio-editor-recorder'), // Utilisation de redirect_url
'translate_to_upload' => __('to upload a file', 'audio-editor-recorder'), // Utilisation de redirect_url
'translate_save' => __('Save', 'audio-editor-recorder'), // Utilisation de redirect_url
'translate_save_export' => __('Save &amp; Export Audio', 'audio-editor-recorder'), // Utilisation de redirect_url
);
wp_localize_script( 'gsp-bootstrap', 'jsVars', $translation_array );
wp_enqueue_style( 'gsp-font-awesome', plugins_url( '../assets/css/font-awesome.min.css?id='.rand(), __FILE__ ),false,true );
ob_start();
?>
	<script type="text/javascript">
		var datahref = "<?php echo esc_attr($datahref);?>";
	</script>
    <div class=" audiolayout editorm_box">
      <div class="a_f_m modal" id="download_popup" >
        <div class="modal-body"></div>
      </div>
	<div class="row">
		<div class="col-sm-1dd2 fullwidth">
			<div class="span12ww none">
			<h6><?php _e('Spectrum', 'audio-editor-recorder'); ?></h6>
			<div class="well">
			<div id="spectrum"></div>
			</div>
			</div>
			<div class="audiolayout-right">
				<div class="audiowavesec">
					<div class="audioLayerControl" data-id="audioLayerControl" style="width: 100%">
					<div class="audioLayerControlmainbox">
            <div id="audioloader" class="none"><i class="fa fa-refresh fa-spin"></i></div>
					<audioLayerControl id="audioLayerControl" title="CloudCompany.mp3" ></audioLayerControl>
					</div>
					</div>

				</div>
        <div class="editor-toolbar">

				<div class="top-audiobar">
					<div class="microphone cursor_pointer" data-toggle="tooltip" title="Start Record"  id="btnstart_new"><i class="fa fa-microphone"></i>
						<br />
					<div class="audio-button-text"><?php _e('Record', 'audio-editor-recorder'); ?></div>
					</div>
					<div class="microphone cursor_pointer"  id="btnstop_new" itle="Stop Record"  style="display: none;"><i class="fa fa-stop-circle"></i>
						<br />
					<div class="audio-button-text"><?php _e('Stop', 'audio-editor-recorder'); ?></div>
					</div>
					<div class="upload fileupload cursor_pointer" title="Upload" style="display: none"><i class="fa fa-upload"></i>
						<br />
					<div class="audio-button-text"><?php _e('Upload', 'audio-editor-recorder'); ?></div>
					</div>
          <div class="plus cursor_pointer combineaudio" data-toggle="tooltip" title="Upload" onclick="jQuery('#combineaudio_file').trigger('click');" data-original-title="Upload"><i class="fa fa-upload"></i>
						<br />
					<div class="audio-button-text"><?php _e('Upload', 'audio-editor-recorder'); ?></div>
					</div>
					<input type="file" style="opacity: 0;display: none;" id="audio_file" accept="audio/*" />
                   <div class="play playbtn cursor_pointer" title="Play" onclick="play_fun();" id="btn_play"><i class="fa fa-play"></i>
						<br />
					<div id="play_text" class="audio-button-text"><?php _e('Play', 'audio-editor-recorder'); ?></div>
					</div>
					<div class="play playbtn cursor_pointer" onclick="stop_fun();" title="Reset" id="btn_play"><i class="fa fa-i-cursor"></i>
						<br />
					<div class="audio-button-text"><?php _e('Select', 'audio-editor-recorder'); ?></div>
					</div>
				   <div class="audioplayerbox" id="audioplayerbox" style="width: auto;height: 100%; border: 0;border-radius: 0;"></div>
					<input type="file" style="opacity: 0;display: none;" id="combineaudio_file" accept="audio/*" multiple="" />
          <div class="microphone cursor_pointer" data-toggle="tooltip" title="Zoom" onclick="audio_zoom_selection()"><i class="fa fa-search-plus"></i>
						<br />
					<div class="audio-button-text"><?php _e('Zoom in', 'audio-editor-recorder'); ?></div>
					</div>
          <div class="microphone cursor_pointer" data-toggle="tooltip" title="Zoom out" onclick="audio_zoom_fit()" data-original-title="Zoom out"><i class="fa fa-search-minus"></i>
						<br />
					<div class="audio-button-text"><?php _e('Zoom out', 'audio-editor-recorder'); ?></div>
					</div>
				</div>
				<div class="bottom-audiobar">
					<div class="cut cursor_pointer" data-toggle="tooltip" title="Cut" onclick="audio_cut();"><i class="fa fa-cut"></i>
						<br />
					<div class="audio-button-text"><?php _e('Cut', 'audio-editor-recorder'); ?></div>
					</div>
                    <div class="copy cursor_pointer" data-toggle="tooltip" title="Copy" onclick="audio_copy();"><i class="fa fa-copy"></i>
						<br />
					<div class="audio-button-text"><?php _e('Copy', 'audio-editor-recorder'); ?></div>
					</div>
					<div class="paste cursor_pointer" data-toggle="tooltip" title="Paste" onclick="audio_paste();"><i class="fa fa-paste"></i>
						<br />
					<div class="audio-button-text"><?php _e('Paste', 'audio-editor-recorder'); ?></div>
					</div>
                    <div class="crop cursor_pointer" data-toggle="tooltip" title="Crop" onclick="audio_crop();"><i class="fa fa-crop"></i>
						<br />
					<div class="audio-button-text"><?php _e('Crop', 'audio-editor-recorder'); ?></div>
					</div>
					<div class="trash cursor_pointer" data-toggle="tooltip" title="Delete" onclick="audio_del();"><i class="fa fa-trash"></i>
						<br />
					<div class="audio-button-text"><?php _e('Delete', 'audio-editor-recorder'); ?></div>
					</div>
					<div class="download cursor_pointer lkl" data-toggle="tooltip" title="Download" onclick="audio_save_link();"><i class="fa fa-download"></i>
						<br />
					<div class="audio-button-text"><?php _e('Download', 'audio-editor-recorder'); ?></div>
					</div>
				</div>
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
      <button type="button" class="limitexceedmodalpopup" style="opacity: 0;" data-toggle="modal" data-target="#limitexceedmodal"><?php _e('Click', 'audio-editor-recorder'); ?></button>
      <button type="button" class="downl_modalpopup" style="opacity: 0;" data-toggle="modal" data-target="#download_popup"><?php _e('Click', 'audio-editor-recorder'); ?></button>
      <div class="a_f_m modal kk" id="limitexceedmodal" >
      <div class="modal-body">
        <?php
        if(is_admin()) {
        ?>
        <?php _e('
        <p>You have exceeded the maximum 1 minute saving time</p>
        <br />
        <p>Please delete some of your audio to keep under 1 minute.</p>
        <p>You can also buy the pro license (See settings)</p>
          ', 'audio-editor-recorder'); ?>
      <?php } else { ?>
      <?php _e('
        <p>You have exceeded the maximum 1 minute saving time</p>
        <br />
        <p>Please delete some of your audio to keep under 1 minute.</p>
        <p>You can also buy the pro license (See settings)</p>
        ', 'audio-editor-recorder'); ?>
      <?php } ?>
        </div>
      <div class="modal-footer">
        <a href="#" class="a_btn" data-dismiss="modal"><?php _e('Close', 'audio-editor-recorder'); ?></a>
      </div>
    </div>
    <div class="clear"></div>
	 <script type="text/javascript">
    jQuery(document).ready(function(){
      jQuery('#limitexceedmodal').appendTo('body');
    });
		var getid = 'audioLayerControl';
		jQuery('.fileupload').click(function(){
		  jQuery('#audio_file').trigger('click');
		});

    function get_custom_gsp_audio_wavdata()
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

    function download_audio(bitRate=0){
      if ( !jQuery('#audioLayerControl')[0].audioLayerControl.listOfSequenceEditors[0].audioSequenceReference )
              return;
            jQuery("#download_popup .modal-body").html("<i class='fa fa-refresh fa-spin'></i>  <span id='progress_sp_more'><?php _e('initializing...', 'audio-editor-recorder'); ?></span>");

          var acontrol = jQuery('#audioLayerControl')[0].audioLayerControl;
      var wavdata = get_custom_gsp_audio_wavdata();
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
          jQuery("#download_popup .modal-header").remove();
          jQuery("#download_popup").removeClass('autoheight');
          if(jQuery('body').hasClass('wp-admin')){
              jQuery('.a_modal-backdrop.in').remove();
              jQuery("#download_popup").hide();
            } else {
              jQuery('.a_modal-backdrop.in').remove();
              jQuery("#download_popup").hide();
            }
          }
          );
    }
     jQuery('body').delegate('#savelink_more','click',function(e){
      e.preventDefault();
          var download_popup = jQuery('#download_popup input[name=more_bitRate]:checked').val();
          download_audio(download_popup);
        });
		function audio_save_link(){
      if(jQuery('.download').hasClass('disabled')){
        jQuery('body').append('<div class="a_modal-backdrop in"></div>');
        jQuery('#limitexceedmodal').show();
      } else {
        if ( !jQuery('#audioLayerControl')[0].audioLayerControl.listOfSequenceEditors[0].audioSequenceReference )
          return;
        console.log('lkldssss')
        jQuery("#download_popup .modal-header").remove();
        var datahtml = '<div class="col-xs-12 col-sm-12"><h4 style="text-align: left;border-bottom: 1px solid #cdcdcd;margin-bottom: 15px;">Please select Bitrate</h4><div class="more_bitRate" style=" display: flex; align-items: center;"><label style=""><input type="radio" name="more_bitRate" value="96k" style=" margin: 0;"><span style="margin-left: 5px;">96k</span></label><label><input type="radio" name="more_bitRate" value="112k" style=" margin: 0;"><span style=" margin-left: 5px;">112k</span></label><label><input type="radio" name="more_bitRate" value="128k" checked="" style=" margin: 0;"><span style=" margin-left: 5px;">128k</span></label><label><input type="radio" name="more_bitRate" value="192k" style=" margin: 0;"><span style=" margin-left: 5px;">192k</span></label><label><input type="radio" name="more_bitRate" value="224k" style=" margin: 0;"><span style=" margin-left: 5px;">224k</span></label><label><input type="radio" name="more_bitRate" value="256k" style=" margin: 0;"><span style=" margin-left: 5px;">256k</span></label><label><input type="radio" name="more_bitRate" value="320k" style=" margin: 0;"><span style=" margin-left: 5px;">320k</span></label></div></div><div class="row top-buffer" style="padding-left: 25px; padding-right: 25px; text-align: center;"><div class="col-xs-12 col-sm-12" style="margin-top: 30px;"><div class="input-group" style="width:100%;text-align:center;"><a class="a_btn btn-sm btn-default" id="savelink_more"><i class="fa fa-save" style="margin-right: 10px !important;"></i>' + jsVars.translate_save + '</a></div></div></div>';
        jQuery("#download_popup").addClass('autoheight');
        jQuery("#download_popup .modal-body").before('<div class="modal-header"><button type="button" class="close closePop" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button><h4 class="modal-title">' + jsVars.translate_save_export + '</h4></div>');
        jQuery("#download_popup .modal-body").html("<div class='download_bitrate_html'>"+datahtml+"</div>");
        if(jQuery('body').hasClass('wp-admin')){
              jQuery('body').append('<div class="a_modal-backdrop in"></div>');
              jQuery('#download_popup').show();
            } else {
              jQuery('body').append('<div class="a_modal-backdrop in"></div>');
              jQuery("#download_popup").show();
            }



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

    <script type="text/javascript">
            var str_drag = "Click \uf130  to record"
            var str_dragnew = "Click \uf093 to upload"
            var str_leftc = "";
            var str_rightc = "";
            var str_position = ":";
            var str_selection = "";

            var procepid = "";

              function refresh_statu()
            {
            	if ( jQuery('#audioLayerControl')[0].my_status() == "play" )
            	{
            		jQuery("#btn_play").html("<i class='fa fa-pause'>");
            	}
            	else
            	{
            		jQuery("#btn_play").html("<i class='fa fa-play'><br><div id=\"play_text\" class=\"audio-button-text\"></div>");
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
          if(jQuery('body').hasClass('wp-admin')){
           setTimeout(function(){
            onDocumentLoaded();
          },5000);

         } else {
          setTimeout(function(){
            onDocumentLoaded();
          },5000);
         }


                 //jQuery(window).load(function()
                 //{





            	   function handleFileSelect2(evt) {
            	 		   evt.stopPropagation();
             		   evt.preventDefault();
             		   var files = evt.target.files;
             		  jQuery('#audioLayerControl')[0].loadfile(files,(jQuery(evt.currentTarget).attr('id') == "combineaudio_file") );
             		  this.value = null;
            		}

              	document.getElementById('audio_file').addEventListener('change', handleFileSelect2, false);
            	  	document.getElementById('combineaudio_file').addEventListener('change', handleFileSelect2, false);


            	   var audioIN = { audio: true };
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
                    { 'type': 'video/ogg' });


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
            const myFile = new File([audioData], "audiorecording.ogg", {
            type: 'video/ogg',
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


                 //});

  if(typeof datahref !='undefined' && datahref !=''){
      console.log(datahref);
      fetch(datahref)
  .then(res => res.blob()) // Gets the response and returns it as a blob
  .then(blob => {
    console.log(blob);
   // let audioData = new Blob(dataArray,
                    //{ 'type': 'video/ogg' });
                    var files = [];
      const myFile = new File([blob], "audiorecording.ogg", {
            type: 'video/ogg',
            });
      files.push(myFile);
      setTimeout(function(){
       jQuery('#audioLayerControl')[0].loadfile(files,true );
     },5000);
  });



    }
    jQuery(document).ready(function(){
    jQuery('.post-type-audio .editor-post-publish-button__button,.updateaudio,.editor-post-publish-button').click(function(e){
      console.log('ddd');
      if(jQuery(this).hasClass('disabled')){
        e.stopImmediatePropagation();
        e.preventDefault();

        jQuery('body').append('<div class="a_modal-backdrop in"></div>');
        jQuery('#limitexceedmodal').show();
      } else {
        jQuery('body').append('<div class="a_modal-backdrop in"></div>');
        jQuery('#download_popup').show();
      }
    });
  });


         </script>

    <script type="text/javascript">
      jQuery(document).ready(function(){
    	var jj= 1;
    	jQuery('.addbutton').click(function(){
    		jQuery('.categoriesbox').append('<div class="categories_box"><input type="text" placeholder="Enter Category" name="categories[]" class="categories a_form-control" data-id="'+jj+'"><i class="fa fa-minus deleteca"></i><div style="clear:both"></div></div>');
    		jj++;
    	});
    	jQuery('body').delegate('.deleteca','click',function(){
    		jQuery(this).parent().remove();
    	});
    	jQuery('#image_upload').click(function(){
        console.log('dsa');
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
    });
    </script>
<?php
return ob_get_clean();
}
}

?>