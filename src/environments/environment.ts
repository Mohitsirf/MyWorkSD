// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  apiBaseURL: 'https://staging-api.stayduvet.com',

  // apiBaseURL: 'http://stayduvet.test',
  // apiBaseURL: 'https://stayduvet.app/api',

  // apiBaseURL: 'https://newapi.stayduvet.com',

  Stripe: {
    publishableKey: 'pk_test_vdStvVq2aU4gIQqaeu4SqT0E',
    secretKey: 'sk_test_UapsXa13ahoSH0Q8FOFPLr5a'
  },

  GoogleMaps: {
    apiKey: 'AIzaSyB_jQHTgxMUfVJdVEDeedugLxbxa7Ns8O8'
  },
}
