## Heroku

https://dpkg-status-reaktor.herokuapp.com/

The web application provides information about packages from a sample file based on the var/lib/dpkg/status file on Debian and Ubuntu systems. The sample file is fetched via the Gists API.

The index page lists the names installed packages in alphabetical order. The user may filter the packages appearing on the screen with the input field provided on the page.

Each name is linked to a package-specific page, which contains more information about the package:
* Description
* Dependencies
* Reverse dependencies

Dependencies separated by | on the same line indicate alternate dependencies.

The user is able to navigate through the package structure by clicking on dependencies and reverse dependencies. The user can also navigate to packages alphabetically adjacent to the package currently being observed and back to the index page. 

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.