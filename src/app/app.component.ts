import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiData, Post } from './models/post.model';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	
	private apiUrl: string = 'https://e621.net/posts.json';
	private login: string = 'RedRookShep';
	private apiKey: string = 'qCANh8LhWtMDa7ytSjKYes6m';
	private postLimit: number = 10;//320;
	private clientString: string = 'twitter_redrookshep';
	public tags: string[] = [];
	public posts: Post[] = [];
	public postCount: number = 0;
	public currentPost: number = -1;
	public random: boolean = true;
	public errorText: string = "";
  
	constructor(private http: HttpClient) { };
	
	public spinWheel() {
		//Starting fresh
		this.errorText = "";
		if (this.currentPost < 0) {
			this.currentPost = -1;
			this.getPosts(true);
		}
		else if (this.currentPost < this.postCount - 1) {
			this.currentPost++;
			if (this.currentPost == this.postCount - 5)
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
		var tags = [...this.tags];
		if (this.random)
			tags.push("order:random");
		tags.push("-flash");

		var queryParams = new HttpParams()
			.set('limit', this.postLimit)
			.set('login', this.login)
			.set('api_key', this.apiKey)
			.set('_client', this.clientString);
		if (tags.length > 0)
			queryParams = queryParams.set('tags', tags.join(' '));

		this.http.get<ApiData>(this.apiUrl, {params: queryParams})
			.subscribe(data => {
				console.log(data);
				this.posts = [...this.posts, ...data.posts];
				this.postCount = this.posts.length;
				if (stepOnFetch)
					this.currentPost++;
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
	
}
