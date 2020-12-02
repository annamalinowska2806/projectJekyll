# New Document# mfind.net.pl
Landing page running at [mfind.net.pl](https://mfind.net.pl/)

### Structure
App is based on jekyll project [jekyllrb.com](https://jekyllrb.com/),
and hosting with [firebase](https://console.firebase.google.com) at name *lp-komunikacja* (production environment) and *lp-komunikacja-staging* (staging environment) in firebase console.

HTML head section (robots, keywords, description) is configurable at [_config.hml](_config.yml) file.

#### Application structure tree
`_site/production` and `_site/staging` - folders with a **build versions** of website - only this folder have to deliver for hosting server

`_data` - all data collection for website, ex: faq, section writing about, insurers list  
`_includes` - partials of html layouts  
`_plugins` - classes containing additional methods  
`_layouts` - layouts and website build with partials from [*_includes*](_includes) folder  
`_assets` - main assets folder, in this folder was inject css and js from [b2c project](https://github.com/mfind-project/mfind-b2c):
- *homepage-v1.js* - compile version from b2c [homepage.js](https://github.com/mfind-project/mfind-b2c/blob/develop/app/assets/javascripts/homepage.js)
- *homepage.css* - compile version from b2c [style-form-homepage.scss](https://github.com/mfind-project/mfind-b2c/blob/develop/app/assets/stylesheets/style-for-homepage.scss)
**warning**
at *homepage.css* was changed css path for fonts from www.mfind.pl to relative path.

On main folder:
- firebase.json - config file for deploy on firebase
- .firebaserc - config file with value of name a firebase app
- 404.html - template of 404 page (with declare of base layout)
- index.md - main file with layout declaration

## Development
App build with jekyll have own system to watch changes of file and serve to user. To run server execute:
```sh
$ bundle exec jekyll serve
```
In development, jenkyll uses *_config.yml* by default.  
**warning** changes at *\*_config.yml* and */_plugins* require restart of server!

## Deploy
### Step 0 - log in to firebase in CLI
Remeber that if you want deploy firebase app you have to permission for app and login at console to firebase
```sh
$ firebase login
```
Short tutorial of firebase hosting is at [this link](https://firebase.google.com/docs/hosting/quickstart)


### Step 0a - Code preparation (optional)
User may build final version of files to `_site` folder before run deploy command. Depending on environment, you want to deploy run:
```sh
$ JEKYLL_ENV=staging jekyll build --config _config.yml,_config_staging.yml
```

OR

```sh
JEKYLL_ENV=production jekyll build --config _config.yml,_config_production.yml
```

`_site/staging` OR `_site/production` folder will be created when is missing with new changes, and rewrite all files when old file exist.

### Step 1 - Setting environment in firebase
When code is ready for deployment you need to set up firebase. First, you have to set propper firebase project (depending on environment, staging is set as default)

```sh
$ firebase use default
```

OR

```sh
$ firebase use production
```


### Step 2 - Deploy!

To create deploy run firebase command:
```sh
$ firebase deploy --only hosting:environment
```
Replace *environment* with *staging* or *production*

In firebase.json `"preprod"` key is set both for *staging* or *production* environment. That hook builds final version of files to deploy automatically, executing commands described in **Step 0a**
### Done
