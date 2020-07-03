
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

**Deploying to the self-hosted URLs** 



`cd {extension}`
`npm run build`

Note that the build command adds slashes to the asset URLs, so you'll need to remove them since we're deploying from subfolders. 

```$xslt
<!DOCTYPE html>
<html>
  <head>
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <meta charset="utf-8">
  -<link rel="stylesheet" href="/src.e31bb0bc.css"></head>
  +<link rel="stylesheet" href="src.e31bb0bc.css"></head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
    -<script type="text/javascript" src="/src.e31bb0bc.js"></script>
    +<script type="text/javascript" src="src.e31bb0bc.js"></script>
  </body>
</html>
```

`cd ..`
`git commit -m "some message"`
`git push master`

## Shared components

A suite of shared components are made available via the root-level npm package. It can be installed as a VCS package, or via symlink: 

`cd` to an extension folder. 
`npm link ../.`
`npm install -save malala-contentful-ui@../. --prefer-online`

Then import: 

`import {CollapseCard, Sortable, EditorField, ImageField} from "malala-contentful-ui";`

