import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Routes} from '@angular/router';
import {catchError, of} from 'rxjs';
import {BlogPostListView} from './views/blog-post-list/blog-post-list.view';
import {BlogPostCreatorView} from './views/blog-post-creator/blog-post-creator.view';
import {BlogPostEditorView} from './views/blog-post-editor/blog-post-editor.view';
import {BackendService} from './services/backend.service';

export const routes: Routes = [
  {
    path: '',
    title: 'pageTitle.blogPosts',
    component: BlogPostListView
  },
  {
    path: 'create',
    title: 'pageTitle.createBlogPost',
    component: BlogPostCreatorView
  },
  {
    path: 'editor/:uid',
    title: 'pageTitle.editBlogPost',
    component: BlogPostEditorView,
    resolve: {
      blogPost: (route: ActivatedRouteSnapshot) => inject(BackendService).get(route.params['uid']).pipe(
        catchError(error => of({error}))
      )
    }
  }
];
