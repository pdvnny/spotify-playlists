# TO DO

## Next Steps

### Frontend

- [ ] Create the Manage page, so that I can start adding the management functionality
  - [X] First, add the ability to login
  - [X] How do I access the access token that is saved to the session?
  - [X] Second, create the ability to make a new playlist and store the info in the database
  - [X] Finish `UpdatePlaylists` for `Manage` page by creating the function with the primary functionality
    - [X] !! ALMOST !! - I just need to finish the updated to the db at the end of the function :)
  - [ ] Create the ability to delete playlists => `components/DetletePlaylist.js`
    - [ ] Simple `/api/??` endpoint
    - [ ] Design a page at `/components/DeletePlaylist.js` to select the playlist
  - [ ] Create the ability to edit playlists (i.e., make them inactive) => `components/EditPlaylist.js`???

- [ ] Create a **"View"** page that is accessible to any user allowing people to view their league playlist

### Backend

- [ ] In `auth.js` -> `request_token`, I think I should use a different redirect URI??!? I don't want to be routed back to the authorization process if something goes wrong...

> [!IMPORTANT]
>
> - [X] Modify `auth.js` -> `current-session` endpoint to use the `refresh-token` method rather than restarting the `authorize` process.
>

- [X] Create the ability to fetch ("find") playlists from the database
- [ ] Continue with the CRUD API tutorial

## "Down the line" Steps

> [!IMPORTANT]
> Add a feature to `components/CreatePlaylist.js` that allows me to pick a playlist to seed the new playlist.
> 
> In other words, the new playlist will not start empty!!

## Bugs

- [ ] I need a button to clear search parameters or another way to reset `artistInput` and `trackInput` back to `""`

## Backend Design

- [ ] Go back to `auth.js` and `server.js` and etc. to add in security checks
  - I did not implement any of the cookies, jsonwebtoken, etc. when I was first trying to get functionality into my site.
- [ ] Add error checking for `/auth/basic-token` in case fetching the access token ever doesn't work

## Frontend Design

- [ ] Search page
  - [X] Artist and track text areas should be separated vertically
  - [X] I need to expand the artist and track text areas to the entire width of the page
  - [] Can I made the site go back to the top of the page when a new page is selected?
  - [X] Add error handling for when the Spotify search (using API) doesn't work correctly
