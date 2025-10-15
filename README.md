# Music + Journal

## About

This web app project incorporates a simple journal with music. By turning a journal digital, it utilizes the advantages of being able to save music in an easily-playable format and to keep track of it. With daily entries, this digital journal lets you choose a song, like a song of the day, for each entry. As your journal entires accumulate, so does this record of the music you've listened to. Featuring a monthly calendar view of your entries, this journal also enables you to navigate through them and to relisten to the music you've saved in your past entries as a form of nostalgic reminiscence. You can rediscover the songs of your past as you revisit the days that have passed.

## Technologies

**Frontend**

- HTML
- CSS
- React
- Typescript

**Backend**

- Node.js
- Express
- Javascript

**Testing**

- Vitest
- Supertest

**Versions**

- Node.js v22.17.0
- npm v10.9.2

## Build Instructions

To build this project, make sure you have [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/en/download) installed. 

Create a `.env` file at the root of the `client` directory and one at the `server` directory. Fill in the environment variables as seen in `client/.env.example` and `server/.env.example` respectively for each.

Then, do the following in the command line:

```bash
# Clone this repository.
$ git clone https://github.com/grinnell-csc324-01-fall-2025/linwenfe-indiv-proj.git

### Installing dependencies
# Install the dependencies for the frontend.
$ cd client
$ npm install

# Install the dependencies for the backend.
$ cd ../server
$ npm install

### Running the app
# Run the frontend.
$ cd ../client
$ npm run dev

# Run the backend server.
$ cd ../server
$ npm run dev
```

Test that both the frontend and backend work:

```bash
# Run tests on frontend.
$ cd ../client
$ npm test

# Run tests on backend.
$ cd ../server
$ npm test
```
