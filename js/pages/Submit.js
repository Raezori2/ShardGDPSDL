import { fetchList } from '../content.js';
import Spinner from '../components/Spinner.js';



export default {
	components: { Spinner },
	template: /*html*/`
		<main v-if="loading" class="surface">
			<Spinner></Spinner>
		</main>
		<main v-else class="page-submit">
			<h1>Submit a new record</h1>
			<div v-if="!sent" id="form-box">
				<form class="form" method="POST">
					<span class="note">* Inputs marked with an asterisk are required! *</span>
					<label for="demon-name">Demon:<span class="asterisk">*</span></label>
					<span class="sublabel">The level the record was played on.</span>
					<select name="demon-name" id="demon-name" v-model="level">
						<option selected disabled="disabled">Select level*</option>
						<option v-for="([level, err], i) in list" :value="level" @click='updateP()'>{{ i + 1 }}. {{ level?.name }}</option>
					</select>
		
					<label for="record-holder">Holder:<span class="asterisk">*</span></label>
					<span class="sublabel">The player holding the record.</span>
					<input type="text" v-model="holder" name="record-holder" id="record-holder" placeholder="Name of the record holder" required>
		
					<label for="record-fps">FPS:<span class="asterisk">*</span></label>
					<span class="sublabel">The amount of frame per seconds used in the completion. Caps at 240 FPS, any values above will be rounded down to 240. If you are unsure about your FPS, check your ingame settings. If V-Sync was enabled, put your monitor's refresh rate.</span>
					<input type="text" v-model="fps" name="record-fps" id="record-fps" placeholder="eg '240 FPS', '144hz',..." required>
		
					<label for="record-percentage-num">Percentage:<span class="asterisk">*</span></label>
					<span class="sublabel">The percentage achieved in the record. Keep in mind only record above or equal to the level's qualification percentage will be accepted.</span>
					<input type="number" min=0 max="100" v-model="percentage" name="record-percentage-num" id="record-percentage-num" placeholder="eg. '59%', '100', '99 percent'*" required>

					<label for="record-footage">Footage:<span class="asterisk">*</span></label>
					<span class="sublabel">This footage should usually be uploaded on YouTube. Alternatively, if the demon is Easy or Medium difficulty, a screenshot can be provided.</span>
					<input type="text" v-model="footage" name="record-footage" id="record-footage" placeholder="eg. 'https://youtube.com/.....', 'https://media.discordapp.net/.....'" required>
		
					<label for="record-footage">Raw Footage:<span class="asterisk">*</span></label>
					<span class="sublabel">The unedited and untrimmed footage for the record. Raw footage should include at least a bit of gameplay before the record attempt (unless recorded on the 1st attempt). Audio should be best case scenario split into game audio & mic audio. Raw footage might be required for higher extreme demons, and your record in such levels without raw footage might get denied. Any personal information possibly contained within raw footage (e.g. names, sensitive conversations) will be kept strictly confidential and will not be shared outside of the demonlist team. Conversely, you acknowledge that you might inadvertently share such information by providing raw footage. You have the right to request deletion of your record note by contacting a list administrator. Make sure to upload raw footage to a non-compressing site, for example Google Drive.</span>
					<input type="text" v-model="rawfootage" name="record-rawfootage" id="record-rawfootage" placeholder="eg. 'https://drive.google.com/file/d/.....'">
	
					<label for="record-holder">Note:<span class="asterisk">*</span></label>
					<span class="sublabel">Any additonal notes for the record.</span>
					<textarea name="record-notes" v-model="notes" id="record-notes" placeholder="Your dreams & hopes for this record... or something like that"></textarea>
		
					<button type="button" @click='sendWebhook()'>Submit record</button>
					
					
					</form>
					</div>
			<div v-else id="rec-sent">
				<h2 class="success">Record submitted!</h2>
				<button class="success" @click="sent = !sent">Submit another record</button>
			</div>
			<h3 id="error">{{ error }}</h3>
		</main>
	`,
	
	
	data: () => ({
		list: [],
		loading: true,
		sent: false,
		level: 'Select level*',
		holder: '',
		fps: '',
		footage: '',
		rawfootage: '',
		notes: '',
		percentage: 0,
		error: '',
		errortimes: 0,
		QualifyP: 0,
	}),
	async mounted() {
		// Hide loading spinner
		this.list = await fetchList();


		this.loading = false;
	},

	methods: {
		sendWebhook() {
			if (this.level === 'Select level*' || this.holder === '' || this.fps === '' || this.footage === '' || this.percentage < 0 || this.percentage > 100) {
				this.errortimes += 1
				switch (this.errortimes) {
					case 3:
						this.error = 'Please fill in all required fields. If you are having trouble, please contact us on Discord.'
						return;
					case 6:
						this.error = 'boi what are you doing'
						return;
					case 10:
						this.error = 'ok you are just trolling now'
						return;
					case 20:
						this.error = 'you are just wasting your time'
						return;
					case 40:
						this.error = 'you are wasting our time'
						return;
					case 60:
						this.error = 'please stop lol'
						return;
					case 80:
						this.error = 'ok i am done lol'
						return;
					case 100:
						this.error = 'you clicked the button 100 times, good job.'
						return;
					case 200:
						this.error = 'you clicked the button 200 times, good job.'
						return;
					case 500:
						this.error = 'do you need help?'
						return;
					case 600:
						this.error = 'you might need help.'
						return;
					case 800:
						this.error = 'bro stop what the hell are you doing'
						return;
					case 1000:
						this.error = 'please stop, go outside or something'
						return;
					default:
						break;
				}
				if (this.error === ''){
					this.error = 'Please fill in all required fields.'
				}
				return;
			}
			return new Promise((resolve, reject) => {
				fetch("https://discord.com/api/webhooks/1336699183914029080/pSBDj41k4tp1fFwxoHbhsspEAi_1eF3uyK-aIpiS9dgDResSjhCm4IFir0zq9PHztloB", {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						content: this.level.name + " - " + this.holder,
						embeds: [
							{
								title: 'New record submission!',
								description: 'New record by ' + this.holder + ' on ' + this.level.name + '.',
								fields: [
									{
										name: 'Level',
										value: this.level.name + ' | ' + this.level.id,
									},
									{
										name: 'Record holder',
										value: this.holder,
									},
									{
										name: 'FPS Used',
										value: this.fps,
									},
									{
										name: 'Percentage',
										value: this.percentage,
									},
									{
										name: 'Video',
										value: this.footage,
									},
									{
										name: 'Raw footage',
										value: this.rawfootage || "None",
									},
									{
										name: 'Notes',
										value: this.notes || "None",
									},
								],
							},
						],
					
					}),
				})
				.then((response) => {
					if (!response.ok) {
						reject(new Error(`Could not send message: ${response.status}`));
					}
					this.level = 'Select level*'
					this.holder = ''
					this.fps = ''
					this.footage = ''
					this.rawfootage = ''
					this.notes = ''
					this.sent = true
					this.error = ''
					this.errortimes = 0
					resolve();
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				});
			});
		}
		
	},
	updateP() {
		this.QualifyP = this.level.percentToQualify
		console.log(this.QualifyP)
	}
}