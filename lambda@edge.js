exports.handler = (event, context, callback) => {
  const response = event.Records[0].cf.response;
  const headers = response.headers;

  headers["content-security-policy"] = [{
    key: "Content-Security-Policy",
    value: "default-src 'none'; img-src 'self' https://maps.googleapis.com; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; connect-src https://maps2.dcgis.dc.gov"
  }];

  headers["x-content-type-options"] = [{
    key: "X-Content-Type-Options",
    value: "nosniff"
  }];

  headers["x-frame-options"] = [{
    key: "X-Frame-Options",
    value: "DENY"
  }];

  headers["x-xss-protection"] = [{
    key: "X-XSS-Protection",
    value: "1; mode=block"
  }];

  headers["referrer-policy"] = [{
    key: "Referrer-Policy",
    value: "same-origin"
  }];

  headers["strict-transport-security"] = [{
    key: "Strict-Transport-Security",
    value: "max-age=2592000"
  }];

  callback(null, response);
};
