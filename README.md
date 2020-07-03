
# 🚀 Malala Contentful UI Extensions  
  
This package hosts the following UI extensions:   

## Extensions
  
**Article Links:** Repeatable article title, source and urls.   
Self-host URL: https://malalafunddev.github.io/malala-contentful-ui/article-links/build  
  
**Images:** Repeatable images with descriptions.  
Self-host URL: https://malalafunddev.github.io/malala-contentful-ui/images/build  
  
**Links:** Repeatable links. Can also be used for buttons.   
Self-host URL: https://malalafunddev.github.io/malala-contentful-ui/links/build  
  
All extensions can be built and deployed using [Contentful Create Extension](https://github.com/contentful/create-contentful-extension).

Extensions can be deployed directly to contentful if they are small enough using `npm run deploy`. If they are too large, they should be deployed using the self-hosted URLs above. 

**Deploying to the self-hosted URLs.** 

`npm run build`
`git push master`

## Shared components

A suite of shared components are made available via the root-level npm package. It can be installed as a VCS package, or via symlink: 

`cd` to an extension folder. 
`npm link ../.`
`npm install -save malala-contentful-ui@../. --prefer-online`

Then import: 

`import {CollapseCard, Sortable, EditorField, ImageField} from "malala-contentful-ui";`

