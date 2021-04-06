import React from 'react';

import MainLayout from 'app/components/main-layout';
import WikiArticle from 'app/components/wiki-article';
import Contents from 'app/components/contents';

export default class Article extends React.Component {
  state = {
    sections: [],
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
        this.content.innerHTML = data.parse.text['*'];

        this.renderContent(data.parse.sections);
        //this.setState({ sections: data.parse.sections });

        return data;
      })
      .then(data => {

        //window.RLPAGEMODULES = data.parse.modules;
        window.mw.loader.load(data.parse.modules);
        window.mw.loader.load(data.parse.modulestyles, "text/css");

        return data;
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
    const { sections } = this.state;

    return (
      <MainLayout toc={<Contents list={sections}/>}>
        <WikiArticle ref={r => (this.content = r)}/>
      </MainLayout>
    );
  }
}
