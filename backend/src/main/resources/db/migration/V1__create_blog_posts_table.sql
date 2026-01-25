CREATE TABLE blog_posts
(
    uid              UUID                     NOT NULL,

    title            VARCHAR(255)             NOT NULL,
    summary          TEXT,
    content          TEXT,
    publication_time TIMESTAMP WITH TIME ZONE NOT NULL,

    created_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by       VARCHAR(255)             NOT NULL,
    last_updated_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    last_updated_by  VARCHAR(255)             NOT NULL,

    primary key (uid)
);

CREATE INDEX idx_blog_posts_publication_time ON blog_posts (publication_time DESC);
