import React from 'react';

import DOMPurify from 'dompurify';

import MainLayout from 'app/components/main-layout';
import WikiArticle from 'app/components/wiki-article';
import Contents from 'app/components/contents';

import queryBuilder from 'app/utils/query-builder';
import fetchWrapper from 'app/utils/fetch-wrapper';
import scrollToAnchor from 'app/utils/scroll-to-anchor';

import { apiUserAgent } from 'app/constants/common';

export default class Article extends React.Component {
  state = {
    sections: [],
    isLoading: false,
    html: '',
    error: {},
  };

  componentDidMount() {
    this.getPage(this.props.match.params.title);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.title !== prevProps.match.params.title) {
      this.getPage(this.props.match.params.title);
    }
  }

  getPage = async (title) => {
    this.setState({ isLoading: true, error: {} });

    // API doc https://www.mediawiki.org/wiki/API:Parsing_wikitext

    const params = {
      action: 'parse',
      origin: '*',
      format: 'json',
      redirects: true,
      prop: 'text|modules|jsconfigvars|sections',
      disableeditsection: true,
      page: title,
      useskin: 'modern',
      disabletoc: true,
      mobileformat: true,
      mainpage: true,
      formatversion: '2',
    };

    try {
      // mw module for loading modules from Wikipedia
      // https://www.mediawiki.org/wiki/ResourceLoader/Core_modules
      // https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw
      await import(/* webpackChunkName: "mw" */'app/vendors/mw');

      const data = await fetchWrapper(`https://en.wikipedia.org/w/api.php?${queryBuilder(params)}`, apiUserAgent);

      mw.config.set(data.parse.jsconfigvars);

      // https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-using
      mw.requestIdleCallback(
        () =>  window.mw.loader.using([...data.parse.modules, ...data.parse.modulestyles]),
        { timeout: 1 }
      );

      this.renderContent(data.parse.sections);

      const sanitizedText = DOMPurify.sanitize(data.parse.text);
      this.setState({ html: sanitizedText, isLoading: false });
      scrollToAnchor();

    } catch(e) {

      console.error(e);

      // errors https://www.mediawiki.org/wiki/API:Errors_and_warnings

      const error = {
        status: e.status,
        info: e.error?.info || e.info || 'Something was wrong. Try later'
      };

      this.setState({ error, isLoading: false });
    }
  };

  /*
    param sections example: [
      {
        toclevel: 1,
        level: "2",
        line: "Name",
        number: "1",
        index: "1",
        fromtitle: "Cat",
        byteoffset: 9442,
        anchor: "Name"
      },
      {
        toclevel: 2,
        level: "3",
        line: "History",
        number: "2",
        index: "2",
        fromtitle: "Cat",
        byteoffset: 15901,
        anchor: "History"
      },
    ]
  */
  renderContent = sections => {
    const newSections = [];
    let parentNodesStack = [];

    for (let i = 0; i < sections.length; i++) {
      const item = sections[i];
      const isFirstLevel = item.toclevel === 1;

      const data = {
        level: item.toclevel,
        index: item.index,
        name: item.line,
        anchor: item.anchor,
        children: [],
      };

      if (isFirstLevel) {
        newSections.push(data);
        parentNodesStack.push(data);

        continue;
      }

      while (data.level <= parentNodesStack[parentNodesStack.length - 1].level) {
        parentNodesStack.pop();
      }

      parentNodesStack[parentNodesStack.length - 1].children.push(data);
      parentNodesStack.push(data);
    }

    this.setState({ sections: newSections });
  };

  render() {
    const { sections, isLoading, html, error } = this.state;

    return (
      <MainLayout
        mods={{ loading: isLoading }}
        toc={{
          headline: 'Contents',
          sections,
        }}
        error={error}
      >
        <WikiArticle>
          <div dangerouslySetInnerHTML={{__html: html}}/>
        </WikiArticle>
      </MainLayout>
    );
  }
}
