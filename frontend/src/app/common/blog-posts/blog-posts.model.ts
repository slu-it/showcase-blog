export interface BlogPost {
  uid: string;
  title: string;
  summary: string;
  content: string;
  publicationTime: string;
  _links: BlogPostLinks;
}

export interface BlogPostsPage {
  _embedded?: BlogPostsEmbedded;
  page: PageInfo;
}

export interface BlogPostsEmbedded {
  blogPosts: BlogPost[];
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

export interface BlogPostUpdateDto {
  title?: string;
  summary?: string | null;
  content?: string | null;
  publicationTime?: string;
}
