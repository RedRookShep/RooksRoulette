import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from './models/post.model';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	
	private apiUrl: string = 'https://e621.net/posts.json';
	private postCount: number = 10;
	private clientString: string = 'twitter_redrookshep';
	public title: string = "Rook's Roulette";
	public tags: string[] = ['fluffy', 'gay'];
  
	constructor(private http: HttpClient) { };
  
	public getPosts() {
		console.log("Getting Posts");

		var queryParams = new HttpParams()
			.set('tags', this.tags.join(' '))
			.set('limit', this.postCount)
			.set('_client', this.clientString);

		this.http.get<Post[]>(this.apiUrl, {params: queryParams})
			.subscribe(data => console.log(data));
	}
	
}
