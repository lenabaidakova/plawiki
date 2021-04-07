import React from 'react';

import MainLayout from 'app/components/main-layout';
import WikiArticle from 'app/components/wiki-article';
import Contents from 'app/components/contents';

export default class Article extends React.Component {
  state = {
    sections: [],
    isLoading: true,
    html: '',
  };

  componentDidMount() {
    this.getPage(this.props.match.params.title);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.title !== prevProps.match.params.title) {
      this.getPage(this.props.match.params.title);
    }
  }

  getPage = (pageid) => {
    window.RLCONF = {wgServer: "en.wikipedjia.org", wgScript: "/tes", wgScriptPath: "/tes"};

    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=parse&format=json&prop=text|modules|jsconfigvars|encodedjsconfigvars|categorieshtml|sections&disableeditsection&page=${pageid}&useskin=modern&disabletoc&mobileformat`)
      .then(response => response.json())
      .then(data => {
        this.renderContent(data.parse.sections);
        window.mw.loader.load(data.parse.modules);
        window.mw.loader.load(data.parse.modulestyles, "text/css");


        // https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader-method-using
        window.mw.loader.using([...data.parse.modulestyles, ...data.parse.modules])
          .always(() => this.setState({ html: data.parse.text['*'], isLoading: false }));
      })
  };

  renderContent = (sections) => {
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
    const { sections, isLoading, html } = this.state;

    return (
      <MainLayout
        mods={{ loading: isLoading }}
        toc={<Contents list={sections}/>}
      >
        <WikiArticle>
          <span dangerouslySetInnerHTML={{__html: html}}/>
        </WikiArticle>
      </MainLayout>
    );
  }
}
