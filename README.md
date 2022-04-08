# Quicklaunch

If like me, you have too many favorites then Quicklaunch may help you.

Quicklaunch is an extension which bring a custom search bar and provide a way to find link like this:

![Use case](/src/img/demo.gif?raw=true "Use case")

If you are interested, you can install it from the [Chrome Webstore](https://chrome.google.com/webstore/detail/quicklaunch/pkcmlalpmnilmdhhfhopppiipaajoifm) or the [Firefox Add-ons](https://addons.mozilla.org/fr/firefox/addon/quicklaunch/).

And don't hesitate to fork or send pull request :)

# Usage

To begin, press Ctrl+Shift+F to display the quicklaunch search bar. Now you can start typing some tags to display a list of filtered uri. After that, use the arrow keys in order to quickly navigate through the list of suggestions and the enter key to select a suggestion. To manage suggestions, go to the options page or use directly the quicklaunch search bar and the special commands.

# Special Commands

**:qs=[PARAMS]**

Open the selected suggestion and append the query string to the uri.

**:priv** 

Open the selected suggestion in a new private tab.

**:all** 

Open all suggestions matching tags in a new window.

**:edit [OPTIONAL TAGS]**

Open the options page and show the suggestions tab with a filter. By default, the filter is the uri of the current tab. You can also select a custom suggestion to edit by specifying tags.

**:settings** 

Open the options page and show the suggestions tab.

**:add [TAGS]**

Add the uri of the current tab as a suggestion with the tags passed in parameters.

# Technical Instructions

## Requirements

- Node 16.13.0
- Npm 8.1.0
- Yarn 1.22.18

## Build

```
yarn install
yarn build
```
