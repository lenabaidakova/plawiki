# Plawiki

Single-page web application for searching information in Wikipedia. Built on [React](https://reactjs.org/).
This project is a result of the research of [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page).

### 🐳 Docker-way to run production build

```bash
docker build -t wiki .
docker run -p 8080:80 wiki
```

Starts on http://localhost:8080/

### ⚡ Development

Uses node v14.17.0 (npm v6.14.13).

```bash
npm i
npm run dev
```

## MedaWiki Docs
- [API architecture](https://www.mediawiki.org/wiki/RESTBase)
- [Developer app guidelines](https://foundation.wikimedia.org/wiki/Developer_app_guidelines)
- [Main page API](https://www.mediawiki.org/wiki/API:Main_page)

## Credits
[SVG-Loaders](http://samherbert.net/svg-loaders/)

## Issues
For now, the mobile version doesn't look great. Due to [MediaWiki docs](https://www.mediawiki.org/wiki/Extension:MobileFrontend#Legacy_features_of_MobileFrontend), 
there is a [new API](https://en.wikipedia.org/api/rest_v1/) for working with the page. But it is unstable yet.

## Todo
- Write more tests for components.
- Add manifest.
- Add dark theme.
- Add Error Boundaries.
- Implement new API MediaWiki.
- Update SASS

