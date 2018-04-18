**Quickly check the status of a DC 311 service request.** Service requests can be filed with DC’s 311 service without supplying an email address, however, you can’t look them up at https://311.dc.gov without supplying an email address. That’s silly.

# Development

To run this application locally, you’ll need to install the dependencies and then launch the web server:

1. `npm install`
3. `npm start`

This will launch the site running locally at [http://localhost:8080](http://localhost:8080). Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the server.

# Deployment

This application is deployed automatically on merges to master via [Travis CI](https://travis-ci.org/adunkman/dc311rn.com). The production build and deployment scripts are in [.travis.yml](.travis.yml).
