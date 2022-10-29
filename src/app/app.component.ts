import { Component, HostListener, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiData, Post } from './models/post.model';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	@ViewChild('drawer') drawer!: MatSidenav;
	
	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		if (event.code == 'ArrowLeft') {
			this.back();
		}
		if (event.code == 'ArrowRight') {
			this.spinWheel();
		}
		if (event.code == 'Tab') {
			event.preventDefault();
			this.drawer.toggle();
		}
	}
  
	private apiUrl: string = 'https://e621.net/posts.json';
	private login: string = 'RedRookShep';
	private apiKey: string = 'qCANh8LhWtMDa7ytSjKYes6m';
	private postLimit: number = 320;
	private clientString: string = 'twitter_redrookshep';
	public tags: string[] = [];
	public posts: Post[] = [];
	public currentPost: number = -1;
	public random: boolean = true;
	public errorText: string = "";
	
	public bayleMode: boolean = false;
	public briarMode: boolean = false;
	public mysteryMode: boolean = false;
	public vulcanMode: boolean = false;
	public carwynMode: boolean = false;
	public astelMode: boolean = false;
	public crayonMode: boolean = false;
  
	constructor(private http: HttpClient) { };
	
	public spinWheel() {
		//Starting fresh
		this.errorText = "";
		if (this.currentPost < 0) {
			this.currentPost = -1;
			this.getPosts(true);
		}
		else if (this.currentPost < this.posts.length - 1) {
			this.currentPost++;
			if (this.currentPost == this.posts.length - 5)
				this.getPosts(false);
		}
		else {
			this.getPosts(true);
		}
	}
	
	public back() {
		if (this.currentPost > 0)
			this.currentPost--;
	}
  
	public getPosts(stepOnFetch: boolean) {
		console.log("Getting Posts");
		var tags: string[] = [];
		if (this.bayleMode) {
			tags.push("-comic");
			tags.push("cub");
			tags.push("male");
			tags.push("clothing");
			tags.push("~solo");
			tags.push("~duo");
			tags.push("-pregnant");
			tags.push("-absolutely_everyone");
			tags.push("score:>99");
			tags.push("rating:safe");
		}
		if (this.briarMode) {
			tags.push("~border_collie");
			tags.push("~harness");
			tags.push("-female");
			tags.push("canine");
			tags.push("score:>99");
		}
		if (this.mysteryMode) {
			tags.push('score:>99');
			tags.push('~doughnut');
			tags.push('~latex');
			tags.push('~latex_suit');
			tags.push('~paws');
			tags.push('~hypnosis');
			tags.push('~canine');
			tags.push('~fox');
			tags.push('~otter');
			tags.push('~harness');
			tags.push('~collar');
			tags.push('~inflation');
			
			tags.push('-female');
			tags.push('-breasts');
			tags.push('-mlp');
			
		}
		if (this.vulcanMode) {
			tags.push('~rubble_(paw_patrol)');
			tags.push('~latex_suit');
			tags.push('~latex');
			tags.push('~living_suit');
			tags.push('~goo');
			tags.push('~corruption');
			tags.push('~hypnosis');
			tags.push('~merge');
			tags.push('~vore');
			tags.push('~kaomoro');
			tags.push('~snake');
			tags.push('~coils');
			tags.push('~restricting');
			tags.push('~paws');
			
			tags.push('-female');
			tags.push('-breasts');
			tags.push('-mlp');
			tags.push('-vagina');
		}
		if (this.carwynMode) {
			tags.push('rating:>99');
			tags.push('~species_transformation');
			tags.push('~hypnosis');
			tags.push('~paws');
			tags.push('~harness');
			tags.push('~bondage');
			tags.push('~feral');
			tags.push('~latex_suit');
			tags.push('~anal_sex');
			tags.push('~vaginal_sex');
			tags.push('~pokemon');
			
			tags.push('-diaper');
			tags.push('-cub');
			tags.push('-watersports');
			tags.push('-mlp');
			tags.push('-peeing');
		}
		if (this.astelMode) {
			tags.push('rating:>99');
			tags.push('-mlp');
			tags.push('-cub');
			tags.push('-my_little_pony');
			tags.push('~wolf');
			tags.push('~impregnation');
			tags.push('~angiewolf');
			tags.push('~amazon_position');
			tags.push('~backsack');
			tags.push('~tentacles');
			tags.push('~zonkpunch');
			tags.push('~bound');
			
		}
		if (this.crayonMode) {
			tags.push('rating:>99');
			tags.push('~cum');
			tags.push('~group');
			tags.push('~creampie');
			tags.push('~underwear');
			tags.push('~jockstrap');
			tags.push('~daddy_kink');
			
			tags.push('-mlp');
			tags.push('-straight');
			tags.push('-musk');
			tags.push('-vore');
			tags.push('-hyper');
			tags.push('-goo');
			tags.push('-cub');
			tags.push('-nintendo');
			tags.push('-feral');
			tags.push('-inflatable');
			
		}
		//Only if no friend modes are active, use the entered tags.; 
		if (tags.length < 1) {
			tags = [...this.tags];
		}
		if (this.random)
			tags.push("order:random");
		
		//Don't suppport flash, sorry.
		tags.push("-flash");
		tags.push("-scat");

		var queryParams = new HttpParams()
			.set('limit', this.postLimit)
			.set('login', this.login)
			.set('api_key', this.apiKey)
			.set('_client', this.clientString);
		if (tags.length > 0)
			queryParams = queryParams.set('tags', tags.join(' '));

		this.http.get<ApiData>(this.apiUrl, {params: queryParams})
			.subscribe(data => {
				if (data.posts.length < 1) {
					this.errorText = "No Posts Found";
					this.posts = [];
					this.currentPost = -1;
				}
				else {
					this.posts = [...this.posts, ...data.posts];
					this.posts.length = this.posts.length;
					if (stepOnFetch)
						this.currentPost++;
				}
				
			});
	}
	
	public getImage(): string {
		if (this.currentPost < 0 || this.posts.length < 1) return '';
		if (this.posts[this.currentPost]?.file.url)
			return this.posts[this.currentPost].file.url;
		else {
			console.log("No File Url");
			console.log(this.posts[this.currentPost]);
			this.errorText = "No File Url Returned";
			return "";
		}
	}
	
	public isVideo() {
		if (this.posts[this.currentPost]?.file?.ext == "webm" || 
			this.posts[this.currentPost]?.file?.ext == "mp4")
			return true;
			
		return false;
	}
	
	public goToSource() {
		window.open("https://e621.net/posts/" + this.posts[this.currentPost]?.id, '_blank');
	}
	
	public addTagSubmit($event: any) {
		var tag: string = $event.value;
		this.addTag(tag);
		$event.value = '';
	}
	
	public addTag(tag: string) {
		if (!tag) return;
		if (this.tags.indexOf(tag) < 0) {
			this.tags.push(tag);
			this.flushCache();
		}
	}
	
	public removeTag(tag: string) {
		this.tags = this.tags.filter(t => t != tag);
	}
	
	public flushCache() {
		this.posts.splice(this.currentPost + 1);
	}
	
}
