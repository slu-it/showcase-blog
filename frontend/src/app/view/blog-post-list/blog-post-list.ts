import {Component, inject, OnInit} from '@angular/core';
import {BlogPostListService} from './blog-post-list.service';
import {BlogPost} from '../../model/blog-post.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-blog-post-list',
  templateUrl: './blog-post-list.html',
  styleUrl: './blog-post-list.scss',
  imports: [
    DatePipe
  ]
})
export class BlogPostList implements OnInit {
  private service = inject(BlogPostListService);
  blogPosts: BlogPost[] = [];

  ngOnInit(): void {
    this.service.getPage(1, 10)
      .subscribe(page => {
        this.blogPosts = page._embedded.blogPosts;
      });
  }
}
