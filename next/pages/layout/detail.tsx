/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next';
import DetailLayout from '../../components/Layout/DetailLayout';
import { Table } from '../../components/Table/Table';
import { TableOfContentAnchor } from '../../components/TableOfContent/TableOfContent';

interface DetailProps { }

const Detail: NextPage<DetailProps> = ({}) => {

  return (
    <DetailLayout
      title="Detail Layout"
      icon="https://icons-gw2.darthmaim-cdn.com/18CE5D78317265000CF3C23ED76AB3CEE86BA60E/65941-64px.png"
      breadcrumb="Test › Foo › Bar"
      infobox={<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</p>}
    >
      <TableOfContentAnchor id='First Paragraph'/>
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>

      <TableOfContentAnchor id='Table'/>
      <Table>
        <thead>
          <tr><th>Foo</th><th>Bar</th></tr>
        </thead>
        <tbody>
          <tr><th>Test</th><td>123</td></tr>
          <tr><th>Test</th><td>123</td></tr>
          <tr><th>Test</th><td>123</td></tr>
          <tr><th>Test</th><td>123</td></tr>
          <tr><th>Test</th><td>123</td></tr>
          <tr><th>Test</th><td>123</td></tr>
          <tr><th>Test</th><td>123</td></tr>
        </tbody>
      </Table>
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>

      <TableOfContentAnchor id='Recipes'/>
      <Table>
        <thead><tr>
        <th>Output</th>
        <th>Disciplines</th>
        <th>Ingredients</th>
        </tr></thead>
        <tbody>
        <tr className="learnedFromItem">
            <th>
            <a data-item-id="43449" className="item-link item-link-32 border-Fine" href="https://en.gw2treasures.com/item/43449"><img src="https://icons-gw2.darthmaim-cdn.com/071410D26DC8480BA014C84A05EC7BE4DA0FDA5A/219373-32px.png" width="32" height="32" alt="" crossOrigin="anonymous" loading="lazy" srcSet="https://icons-gw2.darthmaim-cdn.com/071410D26DC8480BA014C84A05EC7BE4DA0FDA5A/219373-64px.png 2x"/><span className="item-link-text">5× Potent Master Tuning Crystal</span></a>

            <div className="unlockedBy">
                Source: <a data-item-id="43484" className="item-link item-link-16 border-Fine" href="https://en.gw2treasures.com/item/43484"><img src="https://icons-gw2.darthmaim-cdn.com/066D559192F1D71D3EF85F5121CE807E1B64E000/849422-16px.png" width="16" height="16" alt="" crossOrigin="anonymous" loading="lazy" srcSet="https://icons-gw2.darthmaim-cdn.com/066D559192F1D71D3EF85F5121CE807E1B64E000/849422-32px.png 2x"/><span className="item-link-text">Recipe: Potent Master Tuning Crystals</span></a>
            </div>
            </th>
            <td>
            400 Artificer
            </td>
            <td>
            <ul className="ingredients">
                <li>
                <span className="count">5</span>
                <a data-item-id="24277" className="item-link item-link-16 border-Rare" href="https://en.gw2treasures.com/item/24277"><img src="https://icons-gw2.darthmaim-cdn.com/080D00670558CD9E580D5662030394B2206E92A6/434537-16px.png" width="16" height="16" alt="" crossOrigin="anonymous" loading="lazy" srcSet="https://icons-gw2.darthmaim-cdn.com/080D00670558CD9E580D5662030394B2206E92A6/434537-32px.png 2x"/><span className="item-link-text">Pile of Crystalline Dust</span></a>
                </li>
                <li>
                <span className="count">1</span>
                <a data-item-id="9476" className="item-link item-link-16 border-Fine" href="https://en.gw2treasures.com/item/9476"><img src="https://icons-gw2.darthmaim-cdn.com/071410D26DC8480BA014C84A05EC7BE4DA0FDA5A/219373-16px.png" width="16" height="16" alt="" crossOrigin="anonymous" loading="lazy" srcSet="https://icons-gw2.darthmaim-cdn.com/071410D26DC8480BA014C84A05EC7BE4DA0FDA5A/219373-32px.png 2x"/><span className="item-link-text">Master Tuning Crystal</span></a>
                </li>
            </ul>
            </td>
        </tr>
        <tr className="learnedFromItem">
            <th>
            <a data-item-id="44642" className="item-link item-link-32 border-Exotic" href="https://en.gw2treasures.com/item/44642"><img src="https://icons-gw2.darthmaim-cdn.com/7B0E6BFAEEB8164FBF3DD33ACFAAAD9E9607753F/619596-32px.png" width="32" height="32" alt="" crossOrigin="anonymous" loading="lazy" srcSet="https://icons-gw2.darthmaim-cdn.com/7B0E6BFAEEB8164FBF3DD33ACFAAAD9E9607753F/619596-64px.png 2x"/><span className="item-link-text">2× Watchwork Portal Device</span></a>
            <div className="unlockedBy">
                Source: <a data-item-id="44646" className="item-link item-link-16 border-Exotic" href="https://en.gw2treasures.com/item/44646"><img src="https://icons-gw2.darthmaim-cdn.com/F1670D9C927DA81AA9F161B5A9ABDC410E999A0B/849416-16px.png" width="16" height="16" alt="" crossOrigin="anonymous" loading="lazy" srcSet="https://icons-gw2.darthmaim-cdn.com/F1670D9C927DA81AA9F161B5A9ABDC410E999A0B/849416-32px.png 2x"/><span className="item-link-text">Recipe: Watchwork Portal Device</span></a>
            </div>
            </th>
            <td>
            400 Artificer
            </td>
            <td>
            <ul className="ingredients">
                <li>
                <span className="count">250</span>
                <a data-item-id="44941" className="item-link item-link-16 border-Fine" href="https://en.gw2treasures.com/item/44941"><img src="https://icons-gw2.darthmaim-cdn.com/F996013B7E4AB74F0D73EE38723521BEA9B8D67F/619700-16px.png" width="16" height="16" alt="" crossOrigin="anonymous" loading="lazy" srcSet="https://icons-gw2.darthmaim-cdn.com/F996013B7E4AB74F0D73EE38723521BEA9B8D67F/619700-32px.png 2x"/><span className="item-link-text">Watchwork Sprocket</span></a>
                </li>
                <li>
                <span className="count">2</span>
                <a data-item-id="9476" className="item-link item-link-16 border-Fine" href="https://en.gw2treasures.com/item/9476"><img src="https://icons-gw2.darthmaim-cdn.com/071410D26DC8480BA014C84A05EC7BE4DA0FDA5A/219373-16px.png" width="16" height="16" alt="" crossOrigin="anonymous" loading="lazy" srcSet="https://icons-gw2.darthmaim-cdn.com/071410D26DC8480BA014C84A05EC7BE4DA0FDA5A/219373-32px.png 2x"/><span className="item-link-text">Master Tuning Crystal</span></a>
                </li>
                <li>
                <span className="count">1</span>
                <a data-item-id="24305" className="item-link item-link-16 border-Exotic" href="https://en.gw2treasures.com/item/24305"><img src="https://icons-gw2.darthmaim-cdn.com/02EFB1C5E11B2FF4B4AC25A84E2302D244C82AA3/66958-16px.png" width="16" height="16" alt="" crossOrigin="anonymous" loading="lazy" srcSet="https://icons-gw2.darthmaim-cdn.com/02EFB1C5E11B2FF4B4AC25A84E2302D244C82AA3/66958-32px.png 2x"/><span className="item-link-text">Charged Lodestone</span></a>
                </li>
                <li>
                <span className="count">5</span>
                <a data-item-id="19685" className="item-link item-link-16 border-Basic" href="https://en.gw2treasures.com/item/19685"><img src="https://icons-gw2.darthmaim-cdn.com/D1941454313ACCB234906840E1FB401D49091B96/220460-16px.png" width="16" height="16" alt="" crossOrigin="anonymous" loading="lazy" srcSet="https://icons-gw2.darthmaim-cdn.com/D1941454313ACCB234906840E1FB401D49091B96/220460-32px.png 2x"/><span className="item-link-text">Orichalcum Ingot</span></a>
                </li>
            </ul>
            </td>
        </tr>
        </tbody>
    </Table>

    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
    </DetailLayout>
  );
};

export default Detail;

