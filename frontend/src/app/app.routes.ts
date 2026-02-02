import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Routes} from '@angular/router';
import {catchError, of} from 'rxjs';
import {BlogPostList} from './views/blog-post-list/blog-post-list';
import {BlogPostCreator} from './views/blog-post-creator/blog-post-creator';
import {BlogPostEditor} from './views/blog-post-editor/blog-post-editor';
import {BlogPostsService} from './common/blog-posts/blog-posts.service';
import {BlogPostViewer} from './views/blog-post-viewer/blog-post-viewer';

export const routes: Routes = [
  {
    path: '',
    title: 'pageTitle.home',
    component: BlogPostList
  },
  {
    path: 'create',
    title: 'pageTitle.creator',
    component: BlogPostCreator
  },
  {
    path: 'edit/:uid',
    title: 'pageTitle.editor',
    component: BlogPostEditor,
    resolve: {
      blogPost: (route: ActivatedRouteSnapshot) => {
        const uid = route.params['uid'];
        return inject(BlogPostsService).getBlogPost(uid)
          .pipe(catchError(error => of({error})));
      }
    }
  },
  {
    path: 'view/:uid',
    title: 'pageTitle.viewer',
    component: BlogPostViewer,
    resolve: {
      blogPost: (route: ActivatedRouteSnapshot) => {
        const uid = route.params['uid'];
        return inject(BlogPostsService).getBlogPost(uid)
          .pipe(catchError(error => of({error})));
      }
    }
  }
];
