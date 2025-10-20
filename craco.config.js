// craco.config.js
module.exports = {
  webpack: {
    configure: {
      ignoreWarnings: [
        function ignoreSourceMapsLoaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          );
        }
      ]
    }
  }
};