# Clubhouse-Zendesk

## Description

This contains an **unofficial** Clubhouse integration with Zendesk, that you can add to your own Zendesk instances. This app was developed by a third party and is not associated with Clubhouse (other than using their API).

You can install the app into your Zendesk from the [Zendesk Apps Marketplace](https://www.zendesk.com/apps/support/clubhouseio).

This app was built using Zendesk's [App Scaffold](https://github.com/zendesk/app_scaffold).

## Screenshots

![](https://github.com/bilbof/clubhouse-zendesk/blob/master/dist/assets/screenshot-0.png?raw=true)
![](https://github.com/bilbof/clubhouse-zendesk/blob/master/dist/assets/screenshot-1.png?raw=true)
![](https://github.com/bilbof/clubhouse-zendesk/blob/master/dist/assets/screenshot-2.png?raw=true)

## Getting Started

### Dependencies
- [Node.js](https://nodejs.org/en/) >= 6.3.x
- [Ruby](https://www.ruby-lang.org/) >= 2.0.x

### Setup
1. Clone or fork this repo
2. Change (`cd`) into the `clubhouse-zendesk` directory
3. Run `npm install`

To run your app locally in Zendesk, you need the [Zendesk Apps Tools (ZAT)](https://github.com/zendesk/zendesk_apps_tools).

You'll also need to run a couple of command-line Node.js-based tools that are installed using `npm`. For a node module to be available from the command-line, it must be installed globally.

To setup these and other dependencies, run these commands:

```
gem install zendesk_apps_tools
npm install --global webpack foreman karma-cli
```

Note: Foreman was originally created as a Ruby tool. If you prefer, you can install it by `gem install foreman` instead.

### Running locally

_Note: This app currently depends on zat v1.35.12 or greater._

Foreman allows you to easily run multiple processes in one tab. One process is `zat server --path=./dist`, which serves the app in a way that can be run in a supported Zendesk product. The second is `webpack --watch` to rebuild the project whenever you save changes to a source file.

To run these processes, run

```
nf start
```

or run the individual commands from the Procfile in separate terminals.

Note: If you installed the Ruby version of foreman, you'll need to use `foreman start`.

## Application structure

#### dist
The dist directory is the folder you will need to package when submitting your app to the marketplace. It is also the folder you will have to serve when using [ZAT](https://developer.zendesk.com/apps/docs/apps-v2/getting_started#zendesk-app-tools). It includes your app's manifest.json file, an assets folder with all your compiled JavaScript and CSS as well as HTML and images.

#### lib
The lib directory is where the source code for the app shims and compatibility methods live. While you may modify or remove this code as required for your app, doing so is not recommended for beginners.

#### spec
The spec directory is where all your tests and test helpers live. Tests are not required to submit/upload your app to Zendesk and your test files are not included in your app's package, however it is good practice to write tests to document functionality and prevent bugs.

#### src
The src directory is where your raw source code lives. The App Scaffold includes different directories for JavaScript, stylesheets, templates and translations. Most of your additions will be in here (and spec, of course!).

#### .eslintrc
.eslintrc is a configuration file for [ESLint](http://eslint.org). ESLint is a linting utility for JavaScript. For more information on how to configure ESLint, see [Configuring ESLint](http://eslint.org/docs/user-guide/configuring).

#### karma.conf.js
karma.conf.js is a configuration file for [Karma](http://karma-runner.github.io). Karma is a JavaScript test runner. This file defines where your source and test files live. For more information on how to use this file, see [Karma - Configuration File](http://karma-runner.github.io/1.0/config/configuration-file.html).

#### package.json
package.json is a configuration file for [NPM](https://www.npmjs.com). NPM is a package manager for JavaScript. This file includes information about your project and its dependencies. For more information on how to configure this file, see [package.json](https://docs.npmjs.com/files/package.json).

#### webpack.config.js
webpack.config.js is a configuration file for [webpack](https://webpack.github.io/). Webpack is a JavaScript module bundler. For more information about webpack and how to configure it, see [What is webpack](http://webpack.github.io/docs/what-is-webpack.html).

## Initialization
The App Scaffold's initialization code lives in [`src/index.js`](https://github.com/zendesk/app_scaffold/blob/master/src/javascripts/index.js). For more information, see [inline documentation](https://github.com/zendesk/app_scaffold/blob/master/src/javascripts/index.js).

## API Reference
The App Scaffold provides some classes under `/lib` to help building apps.

### I18n
The I18n (internationalization) module provides a `t` method and Handlebars helper to look up translations based on a key. For more information, see [Using the I18n module](https://github.com/zendesk/app_scaffold/blob/master/doc/i18n.md).

### Storage
The Storage module provides helper methods to interact with `localStorage`. For more information, see [Using the Storage module](https://github.com/zendesk/app_scaffold/blob/master/doc/storage.md).

### View
The View module provides methods to simplify rendering Handlebars templates located under the templates folder. For more information, see [Using the View module](https://github.com/zendesk/app_scaffold/blob/master/doc/view.md).

## Parameters and Settings

If you need to test your app with a `parameters` section in `dist/manifest.json`, foreman might crash with a message like:

> Would have prompted for a value interactively, but zat is not listening to keyboard input.

To resolve this problem, set default values for parameters or create a `settings.yml` file in the root directory of your app scaffold-based project, and populate it with your parameter names and test values. For example, using a parameters section like:

```json
{
  "parameters": [
    {
      "name": "myParameter"
    }
  ]
}
```

create a `settings.yml` containing:

```yaml
myParameter: 'some value!'
```

If you prefer to manually input settings every time you run foreman, edit the Procfile to remove the `--unattended` option from the server command.

## Testing

The App Scaffold is currently setup for testing with [Jasmine](http://jasmine.github.io/) (testing framework) and [Karma](https://karma-runner.github.io) (test runner). To run specs, run

```
karma start
```

Specs live under the `spec` directory and can be configured by editing the `karma.conf.js` file.

## Deploying

To check that your app will pass the server-side validation check, run

```
zat validate --path=./dist
```

If validation is successful, you can upload the app into your Zendesk account by running

```
zat create --path=dist
```

To update your app after it has been created in your account, run

```
zat update --path=dist
```

Or, to create a zip archive for manual upload, run

```
zat package --path=dist
```

taking note of the created filename.

For more information on the Zendesk Apps Tools please see the [documentation](https://developer.zendesk.com/apps/docs/apps-v2/getting_started#zendesk-app-tools).

## Useful Links
Links to maintaining team, confluence pages, Datadog dashboard, Kibana logs, etc
- https://developer.zendesk.com/
- https://github.com/zendesk/zendesk_apps_tools
- https://webpack.github.io
