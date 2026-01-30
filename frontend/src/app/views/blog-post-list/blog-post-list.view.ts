import {Component, inject, OnInit} from '@angular/core';
import {BlogPost} from '../../services/backend.model';
import {DatePipe} from '@angular/common';
import {BackendService} from '../../services/backend.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-blog-post-list-view',
  templateUrl: './blog-post-list.view.html',
  styleUrl: './blog-post-list.view.scss',
  imports: [
    DatePipe,
    RouterLink
  ]
})
export class BlogPostListView implements OnInit {
  private service = inject(BackendService);
  blogPosts: BlogPost[] = [];

  ngOnInit(): void {
    this.loadPosts();
  }

  deletePost(uid: string): void {
    this.service.delete(uid)
      .subscribe(() => this.loadPosts());
  }

  private loadPosts(): void {
    this.service.getPage(1, 10)
      .subscribe(page => {
        this.blogPosts = page._embedded?.blogPosts ?? [];
      });
  }
}
