import {Routes} from '@angular/router';
import {BlogPostList} from './views/blog-post-list/blog-post-list';
import {BlogPostCreator} from './views/blog-post-creator/blog-post-creator';

export const routes: Routes = [
  {
    path: '',
    title: 'pageTitle.blogPosts',
    component: BlogPostList
  },
  {
    path: 'create',
    title: 'pageTitle.createBlogPost',
    component: BlogPostCreator
  }
];
