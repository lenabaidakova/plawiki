import React from 'react';

import Accordion from 'app/components/accordion';
import Autocomplete from 'app/components/autocomplete';
import Button from 'app/components/button';
import Link from 'app/components/link';
import SVGIcon from 'app/components/svg-icon';
import Hamburger from 'app/components/hamburger';
import Input from 'app/components/input';
import List, { List__Item } from 'app/components/list';
import Logo from 'app/components/logo';
import Error from 'app/components/error'
import Mark from 'app/components/mark';
import Card from 'app/components/card';
import Meta from 'app/components/meta';

const autocompleteDemoData = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

export default class Sandbox extends React.Component {
  state = {
    autocompleteInputValue: '',
    autocompleteOptions: [],
    isHamburgerOpen: false,
    inputValue: '',
    inputSearchValue: '',
  };

  onChangeAutocompleteInputValue = value => {
    if (!value.length) {
      this.setState({ autocompleteInputValue: value, autocompleteOptions: [] });

      return;
    }

    const list = [];

    autocompleteDemoData.forEach(item => {
      if (item.toLowerCase().includes(value.toLowerCase())) {
        list.push({ title: item });
      }
    });

    this.setState({ autocompleteInputValue: value, autocompleteOptions: list });
  };

  onClickHamburger = () => {
    this.setState(prevState => ({
      isHamburgerOpen: !prevState.isHamburgerOpen,
    }));
  };

  onInputChange = value => this.setState({ inputValue: value });

  onSearchInputChange = value => this.setState({ inputSearchValue: value });

  render() {
    const { autocompleteInputValue, autocompleteOptions, isHamburgerOpen, inputValue, inputSearchValue } = this.state;

    return (
      <div className="sandbox">
        <section className="sandbox__section">
          <h2>Palette</h2>

          <div className="sandbox__component">
            <ul className="sandbox__palette">
              <li className="sandbox__palette-item" style={{ background: '#f8f8fa' }}>
                $greyLight, #f8f8fa
              </li>

              <li className="sandbox__palette-item" style={{ background: '#ccc' }}>
                $grey, #ccc
              </li>

              <li className="sandbox__palette-item" style={{ background: '#656a70', color: '#ffffff' }}>
                $greyDark, #656a70
              </li>

              <li className="sandbox__palette-item" style={{ background: '#3a3a3a', color: '#ffffff' }}>
                $blackLight, #3a3a3a
              </li>

              <li className="sandbox__palette-item" style={{ background: '#0846ad', color: '#ffffff' }}>
                $blue, #0846ad
              </li>

              <li className="sandbox__palette-item" style={{ background: '#073581', color: '#ffffff' }}>
                $darkBlue, #073581
              </li>
            </ul>
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Font</h2>

          <div className="sandbox__component">
            <p style={{ fontWeight: '400' }}>PT Serif Regular</p>

            <p style={{ fontWeight: '400', fontStyle: 'italic' }}>PT Serif Regular Italic</p>

            <p style={{ fontWeight: '700' }}>PT Serif Bold</p>

            <p style={{ fontWeight: '700', fontStyle: 'italic' }}>PT Serif Bold Italic</p>
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Mark</h2>

          <div className="sandbox__component">
            <Mark mods={{ type: 'primary' }}>I'm highlighted text!</Mark>
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Hamburger</h2>

          <div className="sandbox__component">
            <Hamburger
              mods={{ open: isHamburgerOpen }}
              mix="page__hamburger"
              onClick={this.onClickHamburger}
            />
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Input</h2>

          <div className="sandbox__component">
            <Input
              value={inputValue}
              onChange={this.onInputChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="sandbox__component">
            <Input
              mods={{ icon: 'magnifier' }}
              value={inputSearchValue}
              onChange={this.onSearchInputChange}
              placeholder="Enter something"
            />
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Accordion</h2>

          <div className="sandbox__component">
            <Accordion summary="Wombats aren’t as small as you might think!">
              An adult wombat usually grows to about a metre long – the same as a medium-sized dog. They can
              weigh up to 40 kilograms, and have wide, strong feet which are great for digging! <Link
              href="https://www.natgeokids.com/ie/discover/animals/general-animals/facts-about-wombats/">More info</Link>
            </Accordion>
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Autocomplete</h2>

          <div className="sandbox__component">
            <Autocomplete
              placeholder={'Search a country'}
              onChange={this.onChangeAutocompleteInputValue}
              onSearch={this.onSearch}
              value={autocompleteInputValue}
              options={autocompleteOptions}
            />
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Button</h2>

          <p>Base button without modifiers</p>

          <div className="sandbox__component">
            <Button onClick={console.log}>Simple button</Button>

            <br/>
            <br/>

            <Button mods={{ disabled: true }} onClick={console.log}>Disabled button</Button>
          </div>

          <p>We can add to component <code>href</code></p>

          <div className="sandbox__component">
            <Button to='nowhere'>Button</Button>

            <br/>
            <br/>

            <Button mods={{ disabled: true }} to='nowhere'>Disabled button</Button>
          </div>

          <p>Button <code>type: primary, icon: magnifier</code></p>

          <div className="sandbox__component">
            <Button mods={{ type: 'primary', icon: 'magnifier' }} onClick={console.log}/>

            <Button mods={{ type: 'primary', icon: 'magnifier', disabled: true }} onClick={console.log}/>
          </div>

          <p>Button component with <code>href, type: primary, icon: magnifier</code></p>

          <div className="sandbox__component">
            <Button mods={{ type: 'primary', icon: 'magnifier' }} to='nowhere'/>

            <Button mods={{ type: 'primary', icon: 'magnifier', disabled: true }} to='/'/>
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Link</h2>

          <div className="sandbox__component">
            <Link mods={{ type: 'primary' }} to="nowhere">Primary link</Link>
          </div>

          <div className="sandbox__component">
            <Link mods={{ type: 'secondary' }} to="nowhere">Secondary link</Link>
          </div>

          <div className="sandbox__component">
            <Link to="nowhere">Base link</Link>
          </div>
        </section>

        <section className="sandbox__section">
          <h2>SVGIcon</h2>

          <p><code>type: 'logo'</code></p>

          <div className="sandbox__component">
            <SVGIcon mods={{ type: 'logo' }} width="40px" height="40px"/>
          </div>

          <p><code>type: 'magnifier'</code></p>

          <div className="sandbox__component">
            <SVGIcon mods={{ type: 'magnifier' }} width="40px" height="40px"/>
          </div>

          <p><code>type: 'preloader'</code></p>

          <div className="sandbox__component">
            <SVGIcon mods={{ type: 'preloader' }} width="40px" height="40px"/>
          </div>
        </section>

        <section className="sandbox__section">
          <h2>List</h2>

          <div className="sandbox__component">
            <List mods={{ type: 'primary' }}>
              <List__Item>
                <Link mods={{ type: 'primary' }} href="https://www.natgeokids.com/ie/discover/animals/general-animals/10-hopping-fun-rabbit-facts/">
                  A baby rabbit is called a kit, a female is called a doe and a male is called a buck.
                </Link>

                <List mods={{ type: 'primary' }}>
                  <List__Item>
                    Like cats, happy rabbits purr when they’re content and relaxed
                  </List__Item>

                  <List__Item>
                    Rabbits are amazing athletes — they can jump as high as 90 centimetres in one leap!
                  </List__Item>
                </List>
              </List__Item>

              <List__Item>
                <Link mods={{ type: 'primary' }} href="https://www.natgeokids.com/ie/discover/animals/general-animals/zebra-facts/">Zebras are
                  constantly on the move for fresh grass to eat and water to drink. Super stealthy
                  creatures, they’ll travel thousands of kilometres in search of green pastures where they can
                  fill their bellies and quench their thirst!</Link>
              </List__Item>

              <List__Item>
                <Link mods={{ type: 'primary' }} href="https://www.natgeokids.com/ie/discover/animals/general-animals/cheetah-facts/">
                  The fastest land animal in the world, a cheetah can reach 112km/h in just three seconds – that’s faster
                  than a sports car accelerates! Its body has evolved for speed, with long legs, an elongated spine, adapted
                  claws to grip the ground and a long tail for balance.
                </Link>
              </List__Item>
            </List>
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Logo</h2>

          <div className="sandbox__component">
            <Logo/>
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Error</h2>

          <div className="sandbox__component">
            <Error info="Something was wrong"/>
          </div>

          <p>We can add status code</p>
          <div className="sandbox__component">
            <Error info="Page not found" status={404}/>
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Card</h2>

          <div className="sandbox__component">
            <Card
              mods={{ type: 'primary' }}
              headline="Facts about koalas"
              href="https://www.natgeokids.com/ie/discover/animals/general-animals/ten-facts-about-koalas/"
            >
              Koala’s grow up to become big eaters, shifting up to one kilogram of eucalyptus leaves in a day!
              They are fussy, too, and will select the most nutritious and tastiest leaves from the trees where
              they live.
            </Card>
          </div>

          <p>We can add some meta information</p>

          <div className="sandbox__component">
            <Card
              mods={{ type: 'primary' }}
              headline="Meerkat facts"
              href="https://www.natgeokids.com/ie/discover/animals/general-animals/meerkat-facts/"
              meta={['5,653 Likes', '1324 words']}
            >
              Meerkats live in the deserts and grasslands of the southern tip of Africa. They are super cute,
              with bushy, brown-striped fur, a small, pointed face and large eyes surrounded by dark patches.
            </Card>
          </div>
        </section>

        <section className="sandbox__section">
          <h2>Meta</h2>

          <div className="sandbox__component">
            <Meta items={['5,653 Likes', '1324 words']}/>
          </div>
        </section>

      </div>
    );
  }
}

Sandbox.defaultProps = {};

Sandbox.propTypes = {};
