export interface BlogPost {
  title: string;
  summary: string;
  content?: string;
  publicationTime: string;
  _links: BlogPostLinks;
}

export interface BlogPostsPage {
  _embedded: {
    blogPosts: BlogPost[];
  };
  page: PageInfo;
}

export interface BlogPostLinks {
  self: Link;
  patch?: Link;
  delete?: Link;
}

export interface Link {
  href: string;
}

export interface PageInfo {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

// editor

export interface BlogPostDto {
  title: string;
  summary?: string;
  content?: string;
  publicationTime: string;
}
