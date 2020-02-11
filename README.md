#### README

This application allows users to sign in to create, edit, and delete blog posts connected to their accounts and also allows them to post comments connected to blog posts. The blog also allows non-authorized users to view these posts and comments. Any account and comment on any post.

#### Technologies Used
- MongoDB
- Mongoose
- Express
- JS, Node.js
- Heroku

#### ERD and Planning Process Used
The `user` resource represents the user of the blog. From there, a user has many posts. These posts `populate` the ID of user, calling that user the owner of the post. Posts then have many comments, which are included in the post object as subdocuments (with comments listed in an array). These comments are attached to posts on their creation, calling the user an author, to differentiate the author of a comment from the owner of the post with which the comment is associated.

We began by developing from top-level-resource down. Comments required the most work because of their nested nature within the post resource.

ERD for our resources is at this link: https://imgur.com/a/Yt0sfZm

#### Routes Catalog

The API for this blog accepts requests for user, posts, and comments.
For users, it contains SIGN UP (POST), SIGN IN (POST), CHANGE PASSWORD (PATCH), and SIGN OUT (DELETE).

| request |      url     | action | response |
|:-------:|:------------:|:------:|:--------:|
| POST    | '/users'     | create |    201   |
| PATCH   | '/users/:id' | update |    204   |
| DELETE  | '/users/:id' | delete |    204   |

For posts, it contains INDEX for GETing all of the post, SHOW for GETing one, CREATE, UPDATE, and DESTROY.

| request |      url     | action | response |
|:-------:|:------------:|:------:|:--------:|
| GET     | '/posts'     | index  |    200   |
| GET     | '/posts/:id' | show   |    200   |
| POST    | '/posts'     | create |    201   |
| PATCH   | '/posts/:id' | update |    204   |
| DELETE  | '/posts/:id' | delete |    204   |


For comments, it contains CREATE, UPDATE, and DESTROY.


| request |      url                       | action | response |
|:-------:|:------------------------------:|:------:|:--------:|
| POST    | '/comments'                    | create |    201   |
| PATCH   | '/comments/:postid/:commentid' | update |    204   |
| DELETE  | '/comments/:postid/:commentid' | delete |    204   |

This API is hosted on Heroku at this link: https://frontrow-blog.herokuapp.com/

The web client is available at this link: https://the-front-row.github.io/blog-client/

The repository for the the front end can be found here: https://github.com/The-Front-Row/blog-client


#### Current Issues
- None specifically, but still testing.
