import {Component, inject, OnInit} from '@angular/core';
import {BlogPost} from '../../services/backend.model';
import {DatePipe} from '@angular/common';
import {BackendService} from '../../services/backend.service';

@Component({
  selector: 'app-blog-post-list',
  templateUrl: './blog-post-list.html',
  styleUrl: './blog-post-list.scss',
  imports: [
    DatePipe
  ]
})
export class BlogPostList implements OnInit {
  private service = inject(BackendService);
  blogPosts: BlogPost[] = [];

  ngOnInit(): void {
    this.service.getPage(1, 10)
      .subscribe(page => {
        this.blogPosts = page._embedded.blogPosts;
      });
  }
}
