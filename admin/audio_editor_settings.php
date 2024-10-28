<?php
add_action( 'admin_enqueue_scripts', 'gspaudio_admin_settings' );
if( ! function_exists('gspaudio_admin_settings'))
{
function gspaudio_admin_settings() {
	wp_enqueue_style( 'gsp-font-awesome', plugins_url( '../assets/css/font-awesome.min.css', __FILE__ ) );
	wp_enqueue_style( 'gsp-custom-style', plugins_url( '../assets/css/custom_style.css?id='.rand(), __FILE__ ) );
	wp_enqueue_script( 'gsp-popper', plugins_url( '../assets/js/popper.min.js', __FILE__ ), array('jquery') );
	}
}
?>
<div class="audio-sec">
<div class="row">
	<div class="col-sm-12">
		<h2 class="title-main"><span class="micicon"><i class="fa fa-microphone" aria-hidden="true"></i></span>WP AUDIO EDITOR <span class="smltext"> Settings </span></h2>
	</div>

<div class="tab-content" id="myTabContent">
<div class="tab-pane fade  <?php if(!isset($_POST['audio_user_api_key'])){?> show active <?php }?>" id="home" role="tabpanel" aria-labelledby="home-tab">
<div class="wp_audioeditor">
<h3>QUICK START MANUAL</h3>
<p>- Start <strong>creating and editing audios</strong> by going to <b>Audios > Add new</b>.
- Use the audio posts in <strong>Audios > All Audio</strong><br />
- Find the audios in mp3 format in the <strong>Media Library</strong> and easily insert them into your contents, using Wordpress, themes and plugins media insertion options.<br />
- Simple audios posts and categories are created for the frontend. You must <strong>update your permalinks</strong> for them to work. (Wordpress Settings > Permalinks)</p>

<h4>SHORTCODES</h4>
<p>- Frontend Editor: <strong>[audio-editor]</strong> (Editor page is automatically created or insert it anywhere you want)<br />
- Customize your editor with the parameters:<br /><br />
<strong>mini</strong>: transform the editor in a mini recorder for simple usage ([audio-editor mini=true])< br />
<strong>remove-buttons</strong>: remove buttons you don't need with by adding the buttons classes: record, file-upload, playbtn, re-select, zoom-in, zoom-out, copy, cut, paste, crop, delete, download, reload (e.i.: [audio-editor remove-buttons="download,crop"])<br />
<strong>color</strong>: Change icons colors (e.i.: color="red")<br />
<strong>button-text</strong>: Change the Send for review / Publish button (e.i.: button-text="Send file")<br />
<strong>logged-in-only</strong>: set to false to allow logged out visitors to send audio (page is reloaded to the editor page after submit)<br />
<strong>review</strong>: set to false if you want audio to be published without review<br />
<strong>redirect-url</strong>: change the redirect URL after your user has submitted the audio, instead of sending to the default audios list.<br /><br />

For example, the default parameters are [audio-editor mini="false" color="#505050" remove-buttons="" button-mini="Send for review" logged-in-only="true" review="true" redirect-url="/my-audios"]<br />An example for a Mini recorder with only play, reload and send button with red icons: [audio-editor mini=true remove-buttons="download,crop,cut,file-upload" button-text="SEND" color="red"]<br /><br />
- Frontend audios private author list: <strong>[audio-my-list]</strong> (My audios page is automatically created)<br />
- Frontend audios public list: <strong>[audio-editor-list]</strong> (Insert anywhere you want)</p>

<h4>IMPORTANT</h4>
<p>- The first time you record, <strong>you must allow your website to access the microphone</strong> when your browser invites you.<br />
- After creating from the frontend editor, you are redirected to the audio list page and you can re-edit audios from there.<br />
- In this first version, <strong>multiple re-edition is not recommanded</strong> as the output volume is a bit lower than original and the more you edit the more the volume lowers. We will fix this issue in the next versions<br />
- Frontend audio creation and edition are <strong>restricted to logged-in users unless you change the setting in the shortcode attribute (logged-in-only="false")</strong></p>
<br />
<br />


<h4>PREMIUM VERSION</h4>
<div class="buywpeditorprox firsttab">
<p>The free plugin includes 1 minute maximum recording</p>
<h6>Unlock your plugin and record/edit as much as you want!*</h6>
<a class="button btn editorpro" href="https://wp-audio-studio.com" target="blank">BUY WP EDITOR PRO</a>
<p>If you are not ready yet, simply delete some of your audio to keep under 1 minute.</p>
<p>(*) We use browser caché memory, which means recording limit in premium version is limited to your browser limit (Tested up to 14Mb - 13 min in Chrome for Desktop, tested up to 56Mb - 32 minutes in Firefox) - We recommand to use Firefox for longer audios or to part audios in several pieces.</p>
</div>


</div>

</div>

</div>


</div>

</div>

<?php /*
<div class="tab-pane fade <?php if(isset($_POST['audio_user_api_key'])){?> show active <?php }?>" id="profile" role="tabpanel" aria-labelledby="profile-tab">



<
$get_res = $wpdb->get_results('SELECT audio_user_api_key FROM '.$wpdb->prefix.'gsp_audio_config WHERE as_id=1',ARRAY_A);

$get_api_url = $wpdb->get_results('SELECT option_name,option_value FROM '.$wpdb->prefix.'options WHERE option_name="api_url" OR  option_name="api_ext"',ARRAY_A);

$apidata = array();
if(count($get_api_url)>0){
foreach ($get_api_url as $key => $value) {
$apidata[$value['option_name']] = $value['option_value'];
}
}
$api_url = '';
$api_ext = '';
if(isset($apidata['api_url'])){
	$api_url = $apidata['api_url'];
}
if(isset($apidata['api_ext'])){
	$api_ext = $apidata['api_ext'];
}
	$public_key = "ck_6713d0fc7571bb5d80dd31aa34c7bed4e37398f3";
	$private_key = "cs_9199d80b88af35c3e8c84eb1955c5f42ca5c068d";

	$store_url = "https://".$apidata['api_url'].".".$apidata['api_ext']."/wp-json/lmfwc/v2/licenses/".$get_res[0]['audio_user_api_key'];





		$apiResponse = wp_remote_post( $store_url,
		[
			'method'    => 'GET',
			'sslverify' => false,
			'headers'   => [
				'content-type' => 'application/json',
				'Authorization' => 'Basic ' . base64_encode( $public_key . ':' . $private_key ),
			],
		]
	);

$res_data = json_decode(wp_remote_retrieve_body( $apiResponse));

$timestamp = strtotime(date('Y-m-d H:i:s'));

if(isset($res_data->data->expiresAt) && $res_data->data->expiresAt !=''){
$expiresAt = strtotime(date($res_data->data->expiresAt));
}



if(isset($get_res[0]['audio_user_api_key']) && isset($expiresAt) && $expiresAt>$timestamp && isset($res_data->success) && $res_data->success == true){
$actived = 'yes';
} else if(isset($get_res[0]['audio_user_api_key']) && isset($expiresAt) && $expiresAt<$timestamp) {
$actived = 'expired';
} else {
$actived = 'invalid';
}
?>

<div class="activate_licence" style="display: none !important;">
<h2>Activate your license </h2>
<h4>Enter your license number</h4>
<form method="post">

<div class="div">
<div class="inputbox">
<?php
if(isset($get_result[0]['audio_user_api_key'])){
$audio_user_api_key = $get_result[0]['audio_user_api_key'];
} else {
$audio_user_api_key = '';
}


<input type="text" name="audio_user_api_key" placeholder="Enter Api key" value="<?php echo esc_attr( $audio_user_api_key );?>">
<button type="submit" name="submitform" class="btn btn-primary submitbtn">Save</button>
</div>
<div class="resulttext">
<p>Result of the check:</b>
<?php if($actived=='yes'){?>
<span  style="color: green;">congratulations! your license key is activated.</span>
<?php } else if($actived=='expired'){?>
<span  style="color: orange;">Your license is expired, please buy a new license.</span>
<?php } else {?>
<span  style="color: red;">Your license is not valid or there is an issue, please contact us at info@wp-audio-studio.com.</span>
<?php }?>
</p>
<p>NOTICE: If you see an error and you think your license is valid, click again by clicking on the "save" button.<br />
The first time you enter your license key, make a deep refresh of your browser caché memory and eventually wait a few minutes before the key starts working</p>
</div>
</div>
</form>
</div>


</div>
</div>
<div class="audiofooter">
<h4>INFORMATION & DOCUMENTATION</h4>
<p>Visit the plugin's website: <a href="https://wp-audio-studio.com" target="blank">wp-audio-studio.com</a> for licenses and documentation.<br />
WP Audio Editor is a project of <a href="https://roland.beaussant.com" target="blank">Roland Beaussant</a>, with the collaboration of <a href="https://tbinfotech.com/" target="blank">TB Infotech</a>. It is based on open source libraries under the GNU/GPLv2 license
</p>
</div>

<div class="row" style="display:none">
<div class="col-sm-8 left-audio-cont">
	<h3>Pages installation & shortcodes</h3>
	<p>We have created the necessary page for the plugin to work.<br />
	You can change them BUT dont't forget to add the correct shortcode in the content area.</p>
	<p>You can use the shortcode in any content or template</p>

	<div class="div">
	<h4>Editor/Recorder:</h4>
	<select name="audio_user_audio_editor_record" id="audio_user_audio_editor_record">
	<option value="[audio-editor]">Editor</option>
	</select>
	<button>See <i class="fa fa-share-square"></i></button>
	<h3>Shortcode: [audio-editor]</h3>
	</div>
	<div class="div">
	<h4>Author's list:</h4>
	<select name="audio_user_audio_author_list" id="audio_user_audio_author_list">
	<option value="[audio-editor-list]">Author's list</option>
	</select>
	<button>See <i class="fa fa-share-square"></i></button>
	<h3>Shortcode: [audio-editor-list]</h3>
	</div>

	<p>Archives: You can use [audio-editor-list]shortcode to display archive of any active loop or attached post:</p>
	<p>-Author'slist: [audio-editor-list]</p>
	<p>-Categories: [audio-editor-list]</p>
	<p>-Post's attached audio: [audio-editor-list]</p>
	<p>-Complete list, add this parameter: [audio-editor-list list="all"]</p>
	<p>-Show specific audios ids: [audio-editor-list ids="1,2,6"]</p>
	<p>-Button to create audio attach to a post form frontend: [audio-editor-button]</p>
	<div class="code-tag">
	Automatic pages are created with these slugs:<br />
	-Complete list: {site domain}/audios<br />
	-Categories: {site domain}/audio-category/{cat}<br />
	-single audiolist:{site domain}/audios/{slug}
	</div>
	<h3>Author's specific audio infos</h3>
	<p>You can add a description that will appear in your audio list</p>
	<?php
	if(isset($get_result[0]['author_specific_audio_infos'])){
	$author_specific_audio_infos = $get_result[0]['author_specific_audio_infos'];
	} else {
	$author_specific_audio_infos = '';
	}
	?>
	<textarea class="author_specific_audio_infos" name="author_specific_audio_infos"><?php echo esc_attr( $author_specific_audio_infos );?></textarea>
	<h3>Allow useres to add audios</h3>
	<p>If your website is collaborative, you can let loggedin users add audios</p>
	<p>
	<?php
	$user_access = get_user_meta($user_id,'user_access',true);
	if($user_access=='on'){
	$checked = "checked";
	} else {
	$checked = "";
	}
	?>
	<?php
	if(isset($get_result[0]['user_access']) && $get_result[0]['user_access'] !=0 ){
	$checked = "checked";
	} else {
	$checked = '';
	}
	?>
	<input type="checkbox" name="user_access" <?php echo esc_attr($checked);?> />Yes, allow users to create and edit audios</p><br /><br />


</div>
<div class="col-sm-4 right-audio-cont">
	<h3>Create my first audio</h3>
	<p>there are 3 ways to create an audio:</p>
	<p>1)Add it from a post editor:</p>
	<img src="<?php echo esc_url(plugin_dir_url( __FILE__ ));?>../images/audio-img-a.jpg" />
	<p>2)Add it from a psot's frontend with button shortcode</p>
	<img src="<?php echo esc_url(plugin_dir_url( __FILE__ ));?>../images/audio-img-b.jpg" />
	<p>3)Add single post no attached to post</p>
	<img src="<?php echo esc_url(plugin_dir_url( __FILE__ ));?>../images/audio-img-c.jpg" />
		<div class="audio-premium">
			<h4>Go Premium!</h4>
			<p>Free Version is limited to 10 audios and 15 minutes recording</p>
			<p>To unlock this limitations, go premium now and create unlimited audios, mp3, posdcasts, etc.</p>
			<input type="button" value="Check it our" />
		</div>
</div>
</div>
</div>
</div>

*/

?>