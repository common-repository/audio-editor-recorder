<?php
/**
* Plugin Name: Audio Editor & Recorder
* Plugin URI: https://wp-audio-studio.com/
* Description: Record, upload and edit audio files and posts from your dashboard or from the frontend. Use audios as native Wordpress mp3 objects.
* Version: 2.2.0
* Author: Roland Beaussant
* Author URI:
*/
/**
* Register a custom menu page.
*/
define( 'GSPAUDIO', plugin_dir_path( __FILE__ ) );
include_once( plugin_dir_path( __FILE__ ) . 'frontend/gsp-functions.php' );
include_once( plugin_dir_path( __FILE__ ) . 'frontend/gsp-all-audio-list.php' );
include_once( plugin_dir_path( __FILE__ ) . 'frontend/gsp-all-my-list.php' );
include_once( plugin_dir_path( __FILE__ ) . 'frontend/gsp-edit-audio.php' );
if( ! function_exists('gspaudio_activation_function'))
{
function gspaudio_activation_function() {
	global $wpdb;
	$insert_new_array = array(
	'option_name' => 'api_url',
	'option_value' => 'wp-audio-editor',
	);
	$api_url_results = $wpdb->get_results("SELECT * FROM ".$wpdb->prefix."options WHERE option_name = 'api_url'",ARRAY_A);
	if(count($api_url_results)<=0){
		$wpdb->insert($wpdb->prefix.'options',$insert_new_array);
	}
	$insert_new_array = array(
	'option_name' => 'api_ext',
	'option_value' => 'com',
	);
	$insert_new_array_results = $wpdb->get_results("SELECT * FROM ".$wpdb->prefix."options WHERE option_name = 'api_ext'",ARRAY_A);
	if(count($insert_new_array_results)<=0){
		$rr = $wpdb->insert($wpdb->prefix.'options',$insert_new_array);
	}

	// Create post object
    $my_post = array(
      'post_title'    => wp_strip_all_tags( 'My audios' ),
      'post_content'  => '[audio-my-list]',
      'post_status'   => 'publish',
      'post_author'   => 1,
      'post_type'     => 'page',
    );

    // Insert the post into the database
    wp_insert_post( $my_post );

	// Create post object
    $my_post_editor = array(
		'post_title'    => wp_strip_all_tags( 'Editor' ),
		'post_content'  => '[audio-editor]',
		'post_status'   => 'publish',
		'post_author'   => 1,
		'post_type'     => 'page',
	  );

	  // Insert the post into the database
	  wp_insert_post( $my_post_editor );


	$charset_collate = $wpdb->get_charset_collate();
	$table_name = $wpdb->prefix . 'gsp_audio_config';

	$sql = "CREATE TABLE `$table_name` (
	`as_id` int(11) NOT NULL AUTO_INCREMENT,
	`audio_user_api_key` varchar(220) DEFAULT NULL,
	`audio_user_audio_editor_record` varchar(220) DEFAULT NULL,
	`audio_user_audio_author_list` varchar(220) DEFAULT NULL,
	`author_specific_audio_infos` text DEFAULT NULL,
	`user_access` int(11) DEFAULT '0',
	PRIMARY KEY(as_id)
	) ENGINE=MyISAM DEFAULT CHARSET=latin1;
	";
	if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
	dbDelta($sql);
	}
}
}
register_activation_hook( __FILE__, 'gspaudio_activation_function' );


function audio_editor_load_translation() {
	load_plugin_textdomain( 'audio-editor-recorder', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
	}
	add_action( 'plugins_loaded', 'audio_editor_load_translation' );

/**
* Load plugin textdomain.
*/
if( ! function_exists('gspaudio_load_textdomain'))
{
	function gspaudio_load_textdomain() {
		load_plugin_textdomain('audio-editor-recorder', false, dirname(plugin_basename(__FILE__)) . '/languages/');
	}
}
	add_action('plugins_loaded', 'gspaudio_load_textdomain');

if( ! function_exists('gspaudio_register_my_custom_menu_page'))
{
function gspaudio_register_my_custom_menu_page(){
	add_menu_page(
	__( 'Audio Editor Settings', 'audio-editor' ),
	'Audio Editor Settings',
	'manage_options',
	'wp-audio-editor',
	'gspaudio_my_audio_menu_page',
	'dashicons-playlist-audio',
	6
	);
}
}
add_action( 'admin_menu', 'gspaudio_register_my_custom_menu_page' );
if( ! function_exists('gspaudio_custom_post_type'))
{
function gspaudio_custom_post_type() {
	$role = add_role( 'event_manager', 'Event Manager', array(
	'read' => true,
	) );
	$labels = array(
	'name'                => _x( 'Audio', 'Post Type General Name', 'audio-editor-recorder' ),
	'singular_name'       => _x( 'Audio', 'Post Type Singular Name', 'audio-editor-recorder' ),
	'menu_name'           => __( 'Audios', 'audio-editor-recorder' ),
	'parent_item_colon'   => __( 'Parent Audio', 'audio-editor-recorder' ),
	'all_items'           => __( 'All Audio', 'audio-editor-recorder' ),
	'view_item'           => __( 'View Audio', 'audio-editor-recorder' ),
	'add_new_item'        => __( 'Add New Audio', 'audio-editor-recorder' ),
	'add_new'             => __( 'Add New', 'audio-editor-recorder' ),
	'edit_item'           => __( 'Edit Audio', 'audio-editor-recorder' ),
	'update_item'         => __( 'Update Audio', 'audio-editor-recorder' ),
	'search_items'        => __( 'Search Audio', 'audio-editor-recorder' ),
	'not_found'           => __( 'Not Found', 'audio-editor-recorder' ),
	'not_found_in_trash'  => __( 'Not found in Trash', 'audio-editor-recorder' ),
	);
	$args = array(
	'label'               => __( 'audio', 'audio-editor-recorder' ),
	'description'         => __( 'Audio news and reviews', 'audio-editor-recorder' ),
	'labels'              => $labels,
	'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
	'taxonomies'          => array( 'audios'),
	'hierarchical'        => false,
	'public'              => true,
	'show_ui'             => true,
	'show_in_menu'        => true,
	'show_in_nav_menus'   => true,
	'show_in_admin_bar'   => true,
	'menu_position'       => 5,
	'menu_icon'		      => 'dashicons-format-audio',
	'can_export'          => true,
	'has_archive'         => true,
	'exclude_from_search' => false,
	'publicly_queryable'  => true,
	'capability_type'     => 'post',
	'show_in_rest' => true,

	);
	register_post_type( 'audio', $args );



  register_taxonomy('audios', 'audio', array(
    'hierarchical' => true,
    'show_in_rest' => true,
    'labels' => array(
      'name' => _x( 'Audio categories', 'taxonomy general name', 'audio-editor-recorder' ),
      'singular_name' => _x( 'Audio categories', 'taxonomy singular name', 'audio-editor-recorder' ),
      'search_items' =>  __( 'Search Audio categories', 'audio-editor-recorder' ),
      'all_items' => __( 'All Audio categories', 'audio-editor-recorder' ),
      'parent_item' => __( 'Parent Audio categories', 'audio-editor-recorder' ),
      'parent_item_colon' => __( 'Parent Audio categories:', 'audio-editor-recorder' ),
      'edit_item' => __( 'Edit Audio categories', 'audio-editor-recorder' ),
      'update_item' => __( 'Update Audio categories', 'audio-editor-recorder' ),
      'add_new_item' => __( 'Add New Audio categories', 'audio-editor-recorder' ),
      'new_item_name' => __( 'New Audio categorie Name', 'audio-editor-recorder' ),
      'menu_name' => __( 'Audio categories', 'audio-editor-recorder' ),
    ),
    'rewrite' => array(
      'slug' => 'audios',
      'hierarchical' => true
    ),
  ));
	add_filter('single_template', 'gspaudio_register_room_template');
}
}
add_action( 'init', 'gspaudio_custom_post_type', 0 );
if( ! function_exists('gspaudio_my_audio_menu_page'))
{
function gspaudio_my_audio_menu_page(){
	global $wpdb;
	$user_id = get_current_user_id();
	if(isset($_POST['submitform'])){
	$get_result = $wpdb->get_results('SELECT * FROM '.$wpdb->prefix.'gsp_audio_config',ARRAY_A);
	if(count($get_result)>0){
	$audio_user_api_key = sanitize_text_field( $_POST['audio_user_api_key'] );
	$data = array(
	'audio_user_api_key'=> $audio_user_api_key,
	);
	if(isset($_POST['user_access'])){
	$data['user_access'] = 1;
	} else {
	$data['user_access'] = 0;
	}
	$wpdb->update($wpdb->prefix.'gsp_audio_config',$data,array('as_id'=>1));
	} else {
	$audio_user_api_key = sanitize_text_field( $_POST['audio_user_api_key'] );
	$audio_user_audio_editor_record = sanitize_text_field( $_POST['audio_user_audio_editor_record'] );
	$audio_user_audio_author_list = sanitize_text_field( $_POST['audio_user_audio_author_list'] );
	$author_specific_audio_infos = sanitize_text_field( $_POST['author_specific_audio_infos'] );

	$data = array(
	'audio_user_api_key'=> $audio_user_api_key,
	'audio_user_audio_editor_record'=> $audio_user_audio_editor_record,
	'audio_user_audio_author_list'=> $audio_user_audio_author_list,
	'author_specific_audio_infos' => $author_specific_audio_infos,
	);
	if(isset($_POST['user_access'])){
	$data['user_access'] = 1;
	} else {
	$data['user_access'] = 0;
	}
	$wpdb->insert($wpdb->prefix.'gsp_audio_config',$data);
	}

	}
	$get_result = $wpdb->get_results('SELECT * FROM '.$wpdb->prefix.'gsp_audio_config',ARRAY_A);
	include ('admin/audio_editor_settings.php');
}
}
add_action( 'admin_enqueue_scripts', 'gspaudio_admin_my_enqueue' );
if( ! function_exists('gspaudio_admin_my_enqueue'))
{
function gspaudio_admin_my_enqueue($hook) {
	wp_enqueue_style( 'gsp-custom-style', plugins_url( 'assets/css/custom_style.css?id='.rand(), __FILE__ ) );
	wp_enqueue_script( 'ajax-script', plugins_url( 'assets/js/gsp_audio_ajax.js?id='.rand(), __FILE__ ), array('jquery') );
	wp_localize_script( 'ajax-script', 'ajax_object',
	array( 'ajax_url' => admin_url( 'admin-ajax.php' ), 'we_value' => 1234 ) );
}
}

add_action( 'wp_enqueue_scripts', 'gspaudio_my_enqueue' );

if( ! function_exists('gspaudio_my_enqueue'))
{
function gspaudio_my_enqueue($hook) {
	wp_enqueue_style( 'gsp-custom-style', plugins_url( 'assets/css/custom_style.css?id='.rand(), __FILE__ ) );
	wp_enqueue_script( 'ajax-script', plugins_url( 'assets/js/gsp_audio_ajax.js?id='.rand(), __FILE__ ), array('jquery') );
	wp_localize_script( 'ajax-script', 'ajax_object',
	array(
		'ajax_url' => admin_url( 'admin-ajax.php' ),
		'we_value' => 1234,
		 ) );

	if(is_user_logged_in()){
	global $wpdb;
	$get_res = $wpdb->get_results('SELECT audio_user_api_key FROM '.$wpdb->prefix.'gsp_audio_config WHERE as_id=1',ARRAY_A);

	//check for the index before tryin' to acces it
		if( !isset($get_res[0]['audio_user_api_key']) ){
			$get_res[0]['audio_user_api_key']=0;
		 }

	$get_api_url = $wpdb->get_results('SELECT option_name,option_value FROM '.$wpdb->prefix.'options WHERE option_name="api_url" OR  option_name="api_ext"',ARRAY_A);

	$apidata = array();
	if(count($get_api_url)>0){
	foreach ($get_api_url as $key => $value) {
	$apidata[$value['option_name']] = $value['option_value'];
	}
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
	if(isset($get_res[0]['audio_user_api_key']) && isset($expiresAt) && $expiresAt>$timestamp  && isset($res_data->success) && $res_data->success == true){?>

	<script type="text/javascript">
	localStorage.setItem("access", "yes");
	</script>
	<?php } else {?>
	<script type="text/javascript">
	localStorage.setItem("access", "no");
	</script>
	<?php }
	} else {?>
	<script type="text/javascript">
	localStorage.setItem("access", "no");
	</script>
	<?php }
}
}

add_action( 'wp_ajax_postaudio', 'gspaudio_postaudio' );
add_action( 'wp_ajax_nopriv_postaudio', 'gspaudio_postaudio' );

if( ! function_exists('gspaudio_postaudio'))
{
function gspaudio_postaudio(){
	global $wpdb;
	$categories = array();
	if(isset($_POST['title'])){

	if(isset($_POST['categories']) && $_POST['categories'] !=''){
	$categorieskk = sanitize_text_field($_POST['categories']);
	$fff = explode(',', $categorieskk);

	foreach ($fff as $key => $value) {

	$cat_ID = get_term_by( 'name', $value, 'audios' );

	if($cat_ID->term_id == 0) {

	$rrr = wp_insert_term(
	$value, // the term
	'audios', // the taxonomy
	array(
	'description'=> 'Category description',
	'slug' => str_replace(' ', '-', $value)
	)
	);
	$categories[] = $rrr['term_id'];
	} else {
	$categories[] = $cat_ID->term_id;
	}

	}

	}
//	echo 'sdsdd';
	$user_id = get_current_user_id();
	$type ='draft';
	if(isset($_POST['type']) && $_POST['type'] == 'draft'){
	$type = 'draft';
	} else if(isset($_POST['type']) && $_POST['type'] == 'pending'){
	$type = 'pending';
	} else if(isset($_POST['type']) && $_POST['type'] == 'publish'){
	$type = 'publish';
	}
	$title = '';
	$des = '';
	if(isset( $_POST['title'])){
		$title = sanitize_text_field( $_POST['title'] );
	}
	if(isset( $_POST['des'])){
		$des = sanitize_textarea_field( $_POST['des'] );
	}

	$new_post = array(
	'post_title' => $title,
	'post_content' => $des,
	'post_excerpt' => '',
	'post_status' => $type,
	'post_author' => $user_id,
	'post_type' =>'audio'
	);

	if ( ! function_exists( 'wp_handle_upload' ) )
	{
	require_once( ABSPATH . 'wp-admin/includes/file.php' );
	}
	require_once( ABSPATH . 'wp-admin/includes/image.php' );



	if (isset($_FILES['image'] ) && isset($_FILES['image']['name']) && !empty($_FILES['image']['name']) )
	{
	$image_name = sanitize_text_field($_FILES["image"]["name"]);
	$allowedExts = array("jpg", "jpeg", "png");
	$temp = explode(".", $image_name);
	$extension = end($temp);
	if ( in_array($extension, $allowedExts))
	{
	if ( ( isset($_FILES["image"]["error"]) && sanitize_text_field($_FILES["image"]["error"]) > 0) && (isset($_FILES['image']['size']) && sanitize_text_field($_FILES['image']['size']) <= 6291456 ))
	{
	$response = array(
	"status" => 'error',
	"message" => 'ERROR Return Code: '. sanitize_text_field($_FILES["image"]["error"]),
	);
	}
	else
	{
	$uploaded_image_file = $_FILES['image'];
	$upload_name = sanitize_text_field($_FILES['image']['name']);
	$uploads = wp_upload_dir();
	$filepath = $uploads['path']."/$upload_name";


	$upload_overrides = array( 'test_form' => false );
	$movefile = wp_handle_upload( $uploaded_image_file, $upload_overrides );
	if ( $movefile && !isset( $movefile['error'] )  ) {

	$file = $movefile['file'];
	$url = $movefile['url'];
	$type = $movefile['type'];

	$attachment = array(
	'post_mime_type' => $type ,
	'post_title' => $upload_name,
	'post_content' => 'File '.$upload_name,
	'post_status' => 'inherit'
	);

	$attach_id=wp_insert_attachment( $attachment, $file, 0);
	$attach_data = wp_generate_attachment_metadata( $attach_id, $file );
	wp_update_attachment_metadata( $attach_id, $attach_data );

	}

	$response = array(
	"status" => 'success',
	"url" => $url
	);

	}
	}
	else
	{
	$response = array(
	"status" => 'error',
	"message" => 'something went wrong, most likely file is to large for upload. check upload_max_filesize, post_max_size and memory_limit in you php.ini',
	);
	}
	}

	$audio_file ='';

	if (isset($_FILES['audio'] ) && isset($_FILES['audio']['name']) && !empty($_FILES['audio']['name']) )
	{

	if ( (isset( $_FILES["audio"]["error"] ) && $_FILES["audio"]["error"] > 0))
	{
	$response = array(
	"status" => 'error',
	"message" => 'ERROR Return Code: '. sanitize_text_field($_FILES["audio"]["error"]),
	);
	}
	else
	{
	$uploaded_audio_file = $_FILES['audio'];
	$upload_name = sanitize_text_field($_FILES['audio']['name']);
	$uploads = wp_upload_dir();
	$filepath = $uploads['path']."/$upload_name";


	$upload_overrides = array( 'test_form' => false );
	$movefile = wp_handle_upload( $uploaded_audio_file, $upload_overrides );
	if ( $movefile && !isset( $movefile['error'] )  ) {

	$file = $movefile['file'];
	$url = $movefile['url'];
	$type = $movefile['type'];

	$attachment = array(
	'post_mime_type' => 'audio/mpeg' ,
	'post_title' => $upload_name,
	'post_content' => 'File '.$upload_name,
	'post_status' => 'inherit'
	);
	$attach_iddd=wp_insert_attachment( $attachment, $file, 0);
	$attach_data = wp_generate_attachment_metadata( $attach_iddd, $file );
	wp_update_attachment_metadata( $attach_iddd, $attach_data );
	$audio_file = $url;
	}
	}
	}
	$lastid = wp_insert_post( $new_post );
	if($audio_file !=''){

	update_post_meta( $lastid, '_my_meta_value_key', $audio_file );
	//echo $lastid;die;
	}
	if(isset($attach_id)){
	set_post_thumbnail($lastid,$attach_id);
	}
	if(count($categories)>0){
	wp_set_post_terms($lastid,$categories,'audios');
	}
	}
	$datall['status'] = 1;

	echo json_encode($datall);
	wp_die();
}
}

add_action( 'wp_ajax_updatepostaudio', 'gspaudio_updatepostaudio' );
add_action( 'wp_ajax_nopriv_updatepostaudio', 'gspaudio_updatepostaudio' );

if( ! function_exists('gspaudio_updatepostaudio'))
{
function gspaudio_updatepostaudio(){

	global $wpdb;
	$categories = array();
	if(isset($_POST['title']) && isset($_POST['post_id'])){

	if(isset($_POST['categories']) && $_POST['categories'] !=''){
	$categoriesffff = sanitize_text_field( $_POST['categories'] );
	$fff = explode(',', $categoriesffff);
	foreach ($fff as $key => $value) {

	$cat_ID = get_term_by( 'name', $value, 'audios' );
	if($cat_ID->term_id == 0) {
	$rrr = wp_insert_term(
	$value, // the term
	'audios', // the taxonomy
	array(
	'description'=> 'Category description',
	'slug' => str_replace(' ', '-', $value)
	)
	);
	$new_cat_ID = get_term_by( 'name', $value, 'audios' );
	$categories[] = $new_cat_ID->term_id;
	} else {
	$categories[] = $cat_ID->term_id;
	}
	}
	}
	$user_id = get_current_user_id();
	$type ='draft';
	if(isset($_POST['type']) && $_POST['type'] == 'draft'){
	$type = 'draft';
	} else if(isset($_POST['type']) && $_POST['type'] == 'pending'){
	$type = 'pending';
	}
	$title = '';
	$des = '';
	if(isset($_POST['title'])){
		$title = sanitize_text_field( $_POST['title'] );
	}
	if(isset($_POST['des'])){
		$des = sanitize_textarea_field( $_POST['des'] );
	}
	$new_post = array(
	'post_title' => $title,
	'post_content' => $des,
	'post_excerpt' => '',
	'post_status' => $type,
	'post_author' => $user_id,
	'post_type' =>'audio'
	);
	if ( ! function_exists( 'wp_handle_upload' ) )
	{
	require_once( ABSPATH . 'wp-admin/includes/file.php' );
	}
	require_once( ABSPATH . 'wp-admin/includes/image.php' );
	if (isset($_FILES['image'] ) && isset($_FILES['image']['name'])  && !empty($_FILES['image']['name']) )
	{
	$allowedExts = array("jpg", "jpeg", "png");
	$temp = explode(".", sanitize_text_field($_FILES["image"]["name"]));
	$extension = end($temp);
	if ( in_array($extension, $allowedExts))
	{
	if ( ( isset( $_FILES["image"]["error"] ) && sanitize_text_field($_FILES["image"]["error"]) > 0) && ( isset($_FILES['image']['size']) && sanitize_text_field($_FILES['image']['size']) <= 6291456 ))
	{
	$response = array(
	"status" => 'error',
	"message" => 'ERROR Return Code: '. sanitize_text_field($_FILES["image"]["error"]),
	);
	}
	else
	{
	$uploaded_image_file1 = $_FILES['image'];
	$upload_name = sanitize_text_field($_FILES['image']['name']);
	$uploads = wp_upload_dir();
	$filepath = $uploads['path']."/$upload_name";
	$upload_overrides = array( 'test_form' => false );
	$movefile = wp_handle_upload( $uploaded_image_file1, $upload_overrides );
	if ( $movefile && !isset( $movefile['error'] )  ) {
	$file = $movefile['file'];
	$url = $movefile['url'];
	$type = $movefile['type'];
	$attachment = array(
	'post_mime_type' => $type ,
	'post_title' => $upload_name,
	'post_content' => 'File '.$upload_name,
	'post_status' => 'inherit'
	);
	$attach_id=wp_insert_attachment( $attachment, $file, 0);
	$attach_data = wp_generate_attachment_metadata( $attach_id, $file );
	wp_update_attachment_metadata( $attach_id, $attach_data );
	}
	$response = array(
	"status" => 'success',
	"url" => $url
	);
	}
	}
	else
	{
	$response = array(
	"status" => 'error',
	"message" => 'something went wrong, most likely file is to large for upload. check upload_max_filesize, post_max_size and memory_limit in you php.ini',
	);
	}
	}
	$audio_file ='';
	if (isset($_FILES['audio'] ) && isset($_FILES['audio']['name']) && !empty($_FILES['audio']['name']) )
	{
	if ( ( isset($_FILES["audio"]["error"]) && sanitize_text_field($_FILES["audio"]["error"]) > 0))
	{
	$response = array(
	"status" => 'error',
	"message" => 'ERROR Return Code: '. sanitize_text_field($_FILES["audio"]["error"]),
	);
	}
	else
	{
	$uploaded_audio_file1 = $_FILES['audio'];
	$upload_name = sanitize_text_field($_FILES['audio']['name']);
	$uploads = wp_upload_dir();
	$filepath = $uploads['path']."/$upload_name";
	$upload_overrides = array( 'test_form' => false );
	$movefile = wp_handle_upload( $uploaded_audio_file1, $upload_overrides );
	if ( $movefile && !isset( $movefile['error'] )  ) {
	$file = $movefile['file'];
	$url = $movefile['url'];
	$type = $movefile['type'];
	$attachment = array(
	'post_mime_type' => 'audio/mpeg' ,
	'post_title' => $upload_name,
	'post_content' => 'File '.$upload_name,
	'post_status' => 'inherit'
	);

	$attach_iddd=wp_insert_attachment( $attachment, $file, 0);
	$attach_data = wp_generate_attachment_metadata( $attach_iddd, $file );
	wp_update_attachment_metadata( $attach_iddd, $attach_data );
	$audio_file = $url;
	}
	}
	}
	$post_id = 0;
	$title = '';
	$des = '';
	if(isset($_POST['post_id'])){
		$post_id = sanitize_text_field( $_POST['post_id'] );
	}
	if(isset($_POST['title'])){
		$title = sanitize_text_field( $_POST['title'] );
	}
	if(isset($_POST['des'])){
		$des = sanitize_textarea_field( $_POST['des'] );
	}
	//echo 'kl';
	$wpdb->update($wpdb->prefix.'posts', $new_post,array('ID'=>$post_id) );
	//echo 'lo';
	$my_post = array(
	'ID'           => $post_id ,
	'post_title'   => $title,
	'post_content' => $des,
	);
	// Update the post into the database
	$rrr = wp_update_post( $my_post );
	$lastid = $post_id;
	if($audio_file !=''){
	update_post_meta( $lastid, '_my_meta_value_key', $audio_file );
	}
	if(isset($attach_id)){
	set_post_thumbnail($lastid,$attach_id);
	}
	if(count($categories)>0){
	wp_set_post_terms($lastid,$categories,'audios');
	}
	}
	echo 1;
	wp_die();
}
}


if( ! function_exists('gspaudio_add_meta_box'))
{
function gspaudio_add_meta_box() {
	$screens = array( 'audio' );
	foreach ( $screens as $screen ) {
	add_meta_box(
	'audio_data',
	__( 'Audio', 'audio_editor' ),
	'gspaudio_meta_box_callback',
	$screen
	);
	}
}
}
add_action( 'add_meta_boxes', 'gspaudio_add_meta_box' );
if( ! function_exists('gspaudio_meta_box_callback'))
{
function gspaudio_meta_box_callback( $post ) {
	wp_nonce_field( 'audio_save_meta_box_data', 'audio_meta_box_nonce' );
	$value = get_post_meta( $post->ID, '_my_meta_value_key', true );
	$audio= $value;
	echo do_shortcode('[user-audio-edit datahref="'.esc_attr( $audio ).'"]');
}
}

add_action( 'admin_footer', 'gspaudio_ajax_without_file' );
if( ! function_exists('gspaudio_ajax_without_file'))
{
function gspaudio_ajax_without_file() {
	include ('admin/admin_footer.php');
}
}

add_action("wp_ajax_audioupdatefromadmin" , "gspaudio_updatefromadmin");
if( ! function_exists('gspaudio_updatefromadmin'))
{
function gspaudio_updatefromadmin(){
if ( ! function_exists( 'wp_handle_upload' ) )
{
require_once( ABSPATH . 'wp-admin/includes/file.php' );
}
require_once( ABSPATH . 'wp-admin/includes/image.php' );

if (isset($_FILES['audio'] ) && isset($_FILES['audio']['name'])  && !empty($_FILES['audio']['name']) )
{

if ( (isset( $_FILES["audio"]["error"] ) && sanitize_text_field($_FILES["audio"]["error"]) > 0))
{
$response = array(
"status" => 'error',
"message" => 'ERROR Return Code: '. sanitize_text_field($_FILES["audio"]["error"]),
);
}
else
{


$uploaded_audio_file2 = $_FILES['audio'];
$upload_name = sanitize_text_field($_FILES['audio']['name']);
$uploads = wp_upload_dir();
$filepath = $uploads['path']."/$upload_name";


$upload_overrides = array( 'test_form' => false );
$movefile = wp_handle_upload( $uploaded_audio_file2, $upload_overrides );
if ( $movefile && !isset( $movefile['error'] )  ) {
$file = $movefile['file'];
$url = $movefile['url'];
$type = $movefile['type'];

$attachment = array(
'post_mime_type' => 'audio/mpeg' ,
'post_title' => $upload_name,
'post_content' => 'File '.$upload_name,
'post_status' => 'inherit'
);
$attach_id=wp_insert_attachment( $attachment, $file, 0);
$attach_data = wp_generate_attachment_metadata( $attach_id, $file );
wp_update_attachment_metadata( $attach_id, $attach_data );
$audio_file = $url;
}
}
}
if($audio_file !=''){
if(isset($_POST['post_id'])){
$post_id = sanitize_text_field($_POST['post_id']);
update_post_meta( $post_id, '_my_meta_value_key', $audio_file );
}
}
echo 1;
wp_die();
}
}
if( ! function_exists('gspaudio_post_save'))
{
function gspaudio_post_save( $post_id ) {
}
}
add_action( 'save_post', 'gspaudio_post_save' );
if( !function_exists('gspaudio_register_room_template') ){
function gspaudio_register_room_template($single_template) {
global $post;
if ($post->post_type == 'audio') {
$single_template = GSPAUDIO . 'templates/single-audio.php';
}
return $single_template;
}
}
define( 'GSPAUDIO_FOLDER', dirname( __FILE__ ) . '/' );
define( 'GSPAUDIO_BASENAME', basename( GSPAUDIO_FOLDER ) );
if( ! function_exists('gspaudio_get_template'))
{
function gspaudio_get_template( $slug, $part = '' ) {
    $template = $slug . ( $part ? '-' . $part : '' ) . '.php';
    $dirs = array();
    $dirs[] = GSPAUDIO_FOLDER . 'templates/';
    foreach ( $dirs as $dir ) {
        if ( file_exists( $dir . $template ) ) {
            return $dir . $template;
        }
    }
    return false;
}
}
add_action( 'wp_ajax_audio_autocomplete', 'gspaudio_autocomplete' );
add_action( 'wp_ajax_nopriv_audio_autocomplete', 'gspaudio_autocomplete' );

if( ! function_exists('gspaudio_autocomplete'))
{
function gspaudio_autocomplete(){
if(isset($_POST['value']) && sanitize_text_field($_POST['value']) !=''){
global $wpdb;
$v = sanitize_text_field( $_POST['value'] );
$results = $wpdb->get_results("SELECT t.* FROM ".$wpdb->prefix."term_taxonomy tt LEFT JOIN ".$wpdb->prefix."terms t ON tt.term_id = t.term_id WHERE t.name LIKE '%".$v."%' AND tt.taxonomy='audios'",ARRAY_A);
$names = array();
if(count($results)>0){
foreach ($results as $key => $value) {
$names[] = $value['name'];
}
}
echo json_encode($names);
}
wp_die();
}
}

add_action( 'wp_ajax_get_user_audio_data', 'gspaudio_get_user_audio_data' );
add_action( 'wp_ajax_nopriv_get_user_audio_data', 'gspaudio_get_user_audio_data' );

if( ! function_exists('gspaudio_get_user_audio_data'))
{
function gspaudio_get_user_audio_data(){

global $wpdb;
$post_id = 0;
if(isset($_POST['post_id'])){
	$post_id = sanitize_text_field( $_POST['post_id'] );
}
$get_post = get_post($post_id,ARRAY_A);
$datahtml = array();
$title = '';
$post_content = '';
$image = '';
$audio = '';
$categories = array();
if(count($get_post)>0){
$title = $get_post['post_title'];
$post_content = $get_post['post_content'];
$imageurl = get_the_post_thumbnail_url($post_id);
if(!empty($imageurl)){
$image = $imageurl;
}
$cat = wp_get_post_terms( $post_id,'audios' );
if(count($cat)>0){
foreach ($cat as $key => $value) {
$categories[] = $value->name;
}
}
$value = get_post_meta( $post_id, '_my_meta_value_key', true );
if($value !=''){
$audio= esc_attr( $value ) ;
}
}
require_once(plugin_dir_path( __FILE__ ).'frontend/user_audio_edit_form.php');
wp_die();
}
}