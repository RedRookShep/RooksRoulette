export class PostFile {
	width: number = -1;
	height: number = -1;
	ext: string = '';
	size: number = -1;
	md5: string = '';
	url: string = '';
	
	constructor(init?: Partial<PostFile>) {
        Object.assign(this, init);
    }
}