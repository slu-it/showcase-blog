import {Routes} from '@angular/router';
import {Home} from './home/home';
import {BlogPostList} from './view/blog-post-list/blog-post-list';
import {BlogPostForm} from './edit/blog-post-form/blog-post-form';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: Home
  },
  {
    path: 'blog-posts',
    title: 'Blog Posts',
    component: BlogPostList
  },
  {
    path: 'blog-post-form',
    title: 'Create Blog Post',
    component: BlogPostForm
  }
];
