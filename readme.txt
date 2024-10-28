=== Audio Editor & Recorder ===

Contributors: rolandito-bcn, tbinfotech
Plugin Name: Audio Editor & Recorder
Plugin URI: https://wp-audio-studio.com/
Tags: audio, recorder, podcast, editor, music, sound, media library, recording, storytelling, voice, stories, journalist, musician
Author URI: https://wp-audio-studio.com/
Author: Roland Beaussant
Requires at least: 5.8
Requires PHP: 5.6
Tested up to: 6.6.1
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Stable tag: 2.2.0


Record, upload and edit audios from your wordpress website or blog. Use mp3 media files in your contents. The perfect companion for podcast plugins.
Use the shortcodes to customize the frontend editor or use the mini audio recorder instead of the complete editor.



== Description ==



- Record or Upload audios, podcasts, voice, music, sounds, etc.

- Edit your audios: Copy, Cut, Paste, Crop, delete

- Add more audio pieces

- Save / download as mp3 file on your computer

- Save as Wordpress audio post

- Use in your Wordpress Media Library

- Insert audios in your contents

- Find your own private audio list with the [audio-my-list] shortcode and /my-audios/ page

- Display all published audios with the [audio-editor-list] shortcode.

- Allow your users to use the editor from the frontend with the [audio-editor] shortcode.

- Decide if you let logged-out users post audios with the parameter logged-in-only="false"

- Customize the editor style with the shortcodes parameters (i.e.: [audio-editor color="#000"] to change the icons color).

- Use the shortcode parameter [audio-editor mini="true"] to activate the compact mini recorder.

- Discover all the customization parameters to hide buttons, change button text, publish or review before publish, redirect URL, etc.



Click on this link to test the quick frontend demo of our <a href="https://wp-audio-studio.com/demo-wp-audio-editor-recorder-plugin/" target="blank">simple MP3 audio editor & recorder</a>



<strong>Audio Editor Pro includes:</strong>

- Saving more than one minute audio in your website or your PC.



More info on <a href="https://wp-audio-studio.com/" target="blank">our website</a>
Please don't hesitate to leave us suggestions for future release.


== Installation ==

From your WordPress dashboard



- Visit Plugins > Add New

- Search for “Audio Editor & Recorder”

- Install and activate Audio Editor & Recorder from your Plugins page

- Update your permalinks to make sure the audio posts are working.

- Click on the new menu items “Audios” and create your first audio!

- Click on "Audio Editor Settings" to have more instructions



== Frequently Asked Questions ==





= Shortcodes =

<p>- Frontend Editor: <strong>[audio-editor]</strong> (Editor page is automatically created or insert it anywhere you want)
- Customize your editor with the parameters:
<strong>mini</strong>: transform the editor in a mini recorder for simple usage ([audio-editor mini=true])< br />
<strong>remove-buttons</strong>: remove buttons you don't need with by adding the buttons classes: record, file-upload, playbtn, re-select, zoom-in, zoom-out, copy, cut, paste, crop, delete, download, reload (e.i.: [audio-editor remove-buttons="download,crop"])
<strong>color</strong>: Change icons colors (e.i.: color="red")
<strong>button-text</strong>: Change the Send for review / Publish button (e.i.: button-text="Send file")
<strong>logged-in-only</strong>: set to false to allow logged out visitors to send audio (page is reloaded to the editor page after submit)
<strong>review</strong>: set to false if you want audio to be published without review
<strong>redirect-url</strong>: change the redirect URL after your user has submitted the audio, instead of sending to the default audios list.

For example, the default parameters are [audio-editor mini="false" color="#505050" remove-buttons="" button-mini="Send for review" logged-in-only="true" review="true" redirect-url="/my-audios"]An example for a Mini recorder with only play, reload and send button with red icons: [audio-editor mini=true remove-buttons="download,crop,cut,file-upload" button-text="SEND" color="red"]
- Frontend audios private author list: <strong>[audio-my-list]</strong> (My audios page is automatically created)
- Frontend audios public list: <strong>[audio-editor-list]</strong> (Insert anywhere you want)</p>

= IMPORTANT =

- The first time you record, <strong>you must allow your website to access the microphone</strong> when your browser invites you.
- After creating from the frontend editor, you are redirected to the audio list page and you can re-edit audios from there.
- Frontend audio creation and edition are <strong>restricted to logged-in users unless you change the setting in the shortcode attribute (logged-in-only="false")</strong></p>




== Screenshots ==



1. Backend audio editor inside the admin

2. Audios in the media library

3. Add audios into Wordpress Editor using the Audio Block

4. Add audios in other editors like Divi visual builder here

5. Frontend audio editor in the Twenty twenty WP theme

6. Frontend mini audio recorder / uploader

7. Frontend even more mini audio recorder using the remove-buttons shortcode attribute

8. Frontend My audios list page or using the [audio-my-list] shortcode

9. Audio single page

10. Settings and instructions page

11. Audio posts admin list







== Changelog ==


= 2.2.0

- Tested on Wordpress 6.6.2
- Added Redirect URL parameter
- Translation prepared
- Volume decrease improved
- Single post FSE improved

= 2.1.2

- Tested on Wordpress 6.6.1
- Favicon issue corrected

= 2.1.1

Tested on Wordpress 6.4.1

= 2.1.0

- New website https://wp-audio-studio.com to replace https//wp-audio.editor.com
- License system removed from settings for validating premium version.


= 2.0.0



- Complete restyling

- Shortcode attributes added for customizing the frontend



= 1.0.1



- Audio graphic pointer selection corrected

- 1 minute free version limit corrected



= 1.0.0



Working version after security corrections





