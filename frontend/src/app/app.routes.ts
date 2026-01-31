import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Routes} from '@angular/router';
import {catchError, of} from 'rxjs';
import {BlogPostListView} from './views/blog-post-list/blog-post-list.view';
import {BlogPostCreatorView} from './views/blog-post-creator/blog-post-creator.view';
import {BlogPostEditorView} from './views/blog-post-editor/blog-post-editor.view';
import {BackendService} from './services/backend/backend.service';
import {BlogPostViewerView} from './views/blog-post-viewer/blog-post-viewer.view';

export const routes: Routes = [
  {
    path: '',
    title: 'pageTitle.home',
    component: BlogPostListView
  },
  {
    path: 'create',
    title: 'pageTitle.creator',
    component: BlogPostCreatorView
  },
  {
    path: 'edit/:uid',
    title: 'pageTitle.editor',
    component: BlogPostEditorView,
    resolve: {
      blogPost: (route: ActivatedRouteSnapshot) => {
        const uid = route.params['uid'];
        return inject(BackendService).getBlogPost(uid)
          .pipe(catchError(error => of({error})));
      }
    }
  },
  {
    path: 'view/:uid',
    title: 'pageTitle.viewer',
    component: BlogPostViewerView,
    resolve: {
      blogPost: (route: ActivatedRouteSnapshot) => {
        const uid = route.params['uid'];
        return inject(BackendService).getBlogPost(uid)
          .pipe(catchError(error => of({error})));
      }
    }
  }
];
