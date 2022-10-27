import { PostFile } from './postFile.model';

export class Post {
	id: number = -1;
	created_at: Date = new Date();
	updated_at: Date = new Date();
	file: PostFile = new PostFile();
	score: PostScore = new PostScore();
	tags: Tags = new Tags();
	rating: string = '';
	fav_count: number = -1;
	
	constructor(init?: Partial<Post>) {
        Object.assign(this, init);
    }
}

class PostScore {
	up: number = -1;
	down: number = -1;
	total: number = -1;
}

class Tags {
	general: string[] = [];
	species: string[] = [];
	character: string[] = [];
	copyright: string[] = [];
	artist: string[] = [];
	invalid: string[] = [];
	lore: string[] = [];
	meta: string[] = [];
}