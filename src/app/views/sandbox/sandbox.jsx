import React from 'react';

import Accordion from 'app/components/accordion';
import Autocomplete from 'app/components/autocomplete';
import Button from 'app/components/button';
import Link from 'app/components/link';
import SVGIcon from 'app/components/svg-icon';

const autocompleteDemoData = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

export default class Sandbox extends React.Component {
  state = {
    autocompleteInputValue: '',
    autocompleteList: [],
  };

  onChangeAutocompleteInputValue = value => {
    const list = [];

    autocompleteDemoData.forEach(item => {
      if (item.toLowerCase().includes(value)) {
        list.push({ title: item });
      }
    });

    this.setState({ autocompleteInputValue: value, autocompleteList: list });
  };

  render() {
    const { autocompleteInputValue, autocompleteList } = this.state;

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
          <h2>Accordion</h2>

          <div className="sandbox__component">
            <Accordion summary="Wombats aren’t as small as you might think!">
              An adult wombat usually grows to about a metre long – the same as a medium-sized dog. They can
              weigh up to 40 kilograms, and have wide, strong feet which are great for digging! <Link
              href=" https://www.natgeokids.com/ie/discover/animals/general-animals/facts-about-wombats/">More info</Link>
            </Accordion>
          </div>

          <p>
            On default the accordion is open. But it can be used props <code>isExpanded</code> to change this behaviour.
          </p>

          <div className="sandbox__component">
            <Accordion summary="Wombats aren’t as small as you might think!" isExpanded={false}>
              An adult wombat usually grows to about a metre long – the same as a medium-sized dog. They can
              weigh up to 40 kilograms, and have wide, strong feet which are great for digging! <Link
              href=" https://www.natgeokids.com/ie/discover/animals/general-animals/facts-about-wombats/">More info</Link>
            </Accordion>
          </div>
        </section>

        <section className="sandbox__section">
          <h2 style={{ color: 'red' }}>Autocomplete</h2>

          <div className="sandbox__component">
            <Autocomplete
              placeholder={'Search a country'}
              onChange={this.onChangeAutocompleteInputValue}
              onSearch={this.onSearch}
              value={autocompleteInputValue}
              list={autocompleteList}
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
      </div>
    );
  }
}

Sandbox.defaultProps = {};

Sandbox.propTypes = {};
