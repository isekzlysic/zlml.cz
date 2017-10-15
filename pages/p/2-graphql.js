// @flow

import WithPost from '../../components/WithPost';

export default WithPost({
  "attributes": {
    "timestamp": 1483183709000,
    "title": "GraphQL",
    "slug": "2-graphql"
  },
  "body": "<p>Z <a href=\"1-od-komponent-zpet-ke-komponentam\">minulého dílu</a> by mělo být všem jasné, jak jsem se dostal až sem. Od PHP komponent k webovým komponentám, které vlastně nejsou skutečné webové komponenty, ale jen kus JS kódu, který implementuje vlastní způsob webových komponent - React. Jsem přesvědčen o tom, že pro další pokračování je nutné vysvětlit, jak taková aplikace funguje. Takže...</p>\n<h2 id=\"jak-takov-aplikace-funguje-\">Jak taková aplikace funguje? <a href=\"#jak-takov-aplikace-funguje-\">#</a></h2><p>Jestli mě něco na JS světě už dlouhou dobu děsí, tak je to skutečnost, že vlastně nikdo neví, jak by taková aplikace měla vypadat. Ačkoliv je mnoho lidí přesvědčeno o své pravdě, neuvědomují si subjektivitu jejich tvrzení. Z toho důvodu je teď milion implementací a návrhů a každý to dělá trošku jinak. Pokud to však vezmu co nejvíce objektivně, tak by se taková aplikace dala popsat následovně:</p>\n<ul>\n<li>v prohlížeči běží JS kód, který se stará o vykreslování stránky s využitím veškeré síly JavaScriptu</li>\n<li><em>volitelně</em>: JS kód posílá do prohlížeče třeba NodeJS server, který dokáže vyrenderovat JS a poslat rovnou hotovou stránku do prohlížeče (včetně připravených dat)</li>\n<li>na serveru běží kód (v mém případě Nette), který čeká na co se ho JS kód zeptá prostřednictvím (GraphQL) API a podle toho odpoví</li>\n</ul>\n<p>Proč mi na serveru běží PHP, když hodně lidí preferuje mít JS i na serveru? Protože jsem skálopevně přesvědčen, že dokážu v PHP napsat lepší aplikaci s využitím veškerých myšlenek DDD co zvládnu pochopit (narozdíl od JS). End of story...</p>\n<p>No a jak už titulek tohoto článku napovídá, tak mnou navrhovaný způsob je právě <strong>GraphQL</strong> (<a href=\"http://graphql.org/\">link</a>).</p>\n<h2 id=\"graphql-queries\">GraphQL queries <a href=\"#graphql-queries\">#</a></h2><p>GraphQL je nesmírně chytrý způsob jak se ptát API a přitom je to tak jednoduché, až mi přijde hloupé o tom psát. Pomocí GraphQL se lze serveru zeptat přímo na konkrétní věci. Tedy jako když se ptáte REST API, ale s tím rozdílem, že součástí požadavku je i informace o tom, co má API vrátit. Je dokonce možné zeptat se i více &quot;endpointů&quot; najednou. Zkuste si toto v REST API... :) Naopak GraphQL vyžaduje explicitní vyjmenování toho co chcete, takže jednoduše (pokud vím) nelze napsat dotaz, který by vrátil vše co daný endpoint umí.</p>\n<p>Pojďme si to trošku vyzkoušet. Jako dobré hřiště pro dotazy poslouží <a href=\"http://graphql-swapi.parseapp.com/\">tato online aplikace</a>. Dotazy se vždy posílají na jednu adresu (vetšinou <code>/graphql</code>) s tím, že se mění pouze obsah zprávy, který putuje v POST. To je velký rozdíl oproti REST API. Zde je jen jedna adresa, ale memí se obsah dotazu. Právě to přidává na dynamice dotazování - nejsme limitování na URL adresy. Takže když chceme vytáhnout z API např. všechny filmy, pošleme tento dotaz:</p>\n<pre><code>{\n  allFilms {\n    totalCount\n    films {\n      id\n      title\n      director\n    }\n  }\n}\n</code></pre><p>Tento zvláštní zápis říká, že se ptám na všechny filmy (<code>allFilms</code>) a zajímá mě kolik jich je. Zároveň chci u jednotlivých filmů vrátit jejich ID, název a režiséra. API mi pak vrátí dlouhý JSON:</p>\n<pre><code class=\"lang-js\">{\n  &quot;data&quot;: {\n    &quot;allFilms&quot;: {\n      &quot;totalCount&quot;: 6,\n      &quot;films&quot;: [\n        {\n          &quot;id&quot;: &quot;ZmlsbXM6MQ==&quot;,\n          &quot;title&quot;: &quot;A New Hope&quot;,\n          &quot;director&quot;: &quot;George Lucas&quot;\n        },\n        ...\n      ]\n    }\n  }\n}\n</code></pre>\n<p><a href=\"http://graphql-swapi.parseapp.com/?query=%7B%0A%20%20allFilms%20%7B%0A%20%20%20%20totalCount%0A%20%20%20%20films%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20title%0A%20%20%20%20%20%20director%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A&amp;operationName=null\">Vyzkoušejte si to</a>. Chtěl bych ještě vědět jaké planety jsou ve filmu? Stačí rozšířit dotaz:</p>\n<pre><code>{\n  allFilms {\n    totalCount\n    films {\n      id\n      title\n      director\n      planetConnection {\n        planets {\n          name\n        }\n      }\n    }\n  }\n}\n</code></pre><p>API vrátí ještě delší JSON. Vyzkoušejme jiný příklad. Co když mám k dispozici ID filmu, jak se zeptám pouze na ten konkrétní film? Pošleme ID filmu jako paramter dotazu:</p>\n<pre><code class=\"lang-js\">{\n  film(id: &quot;ZmlsbXM6MQ==&quot;) {\n    title\n  }\n}\n</code></pre>\n<p>A teď ta nejvíce úžasná část. Chci si jedním šmahem vytáhnout film, člověka a všechny planety? Easy:</p>\n<pre><code class=\"lang-js\">{\n  film(id: &quot;ZmlsbXM6MQ==&quot;) {\n    title\n  }\n  person(id: &quot;cGVvcGxlOjE=&quot;) {\n    name\n  }\n  allPlanets {\n    planets {\n      name\n    }\n  }\n}\n</code></pre>\n<p>A výsledek? Ultra dlouhý JSON:</p>\n<pre><code class=\"lang-js\">{\n  &quot;data&quot;: {\n    &quot;film&quot;: {\n      &quot;title&quot;: &quot;A New Hope&quot;\n    },\n    &quot;person&quot;: {\n      &quot;name&quot;: &quot;Luke Skywalker&quot;\n    },\n    &quot;allPlanets&quot;: {\n      &quot;planets&quot;: [\n        {\n          &quot;name&quot;: &quot;Tatooine&quot;\n        },\n        {\n          &quot;name&quot;: &quot;Alderaan&quot;\n        },\n        ...\n      ]\n    }\n  }\n}\n</code></pre>\n<p>Asi nemá smysl zanořovat se hlouběji. Princip by měl být jasný a samotné API je do jisté míry ovlivněno jeho návrhem (zde stránkováním). Jednoduše mohu jedním POST dotazem (což je ten zvláštní řetězec vypadající jako zjednodušený JSON) získat z API informace, které přesně moje React komponenta potřebuje. Toho některé knihovny silně využívají a vrácený výsledek posílají v properties přímo komponentě, který se stará <strong>pouze</strong> o vykreslování. Uvedu zde pouze krátký příklad toho co tím myslím (podrobněji to můžeme řešit později).</p>\n<p><code>DataSourcesContainer</code> je komponenta, která využívá <a href=\"http://dev.apollodata.com/react/\">Apollo</a> a cíl této komponenty je pouze vytáhnout data a vykresení delegovat někam dál (<code>Row</code>).</p>\n<pre><code class=\"lang-js\">const DataSourcesContainer = (props) =&gt; {\n    let {data: {loading, devices}} = props;\n    return loading ? null :\n        &lt;div&gt;\n            &lt;h2&gt;Data Sources&lt;/h2&gt;\n            {devices.map(dataSource =&gt;\n                &lt;Row key={dataSource.id} dataSource={dataSource}/&gt;\n            )}\n        &lt;/div&gt;;\n};\n\nexport default graphql(gql`\n  query {\n    devices {\n      id,\n      name,\n      records\n    }\n  }\n`)(DataSourcesContainer);\n</code></pre>\n<p>Až teprve <code>Row</code> se stará o vykreslení, ale už nikdy nikdy nepošle dotaz na API:</p>\n<pre><code class=\"lang-js\">const Row = (props) =&gt; {\n    let ds = props.dataSource;\n    return &lt;div&gt;{ds.name} &lt;Link to={`/data-sources/${ds.id}`}&gt;{ds.id}&lt;/Link&gt; ({ds.records.length} records available)\n    &lt;/div&gt;;\n};\n\nRow.propTypes = {\n    dataSource: React.PropTypes.shape({\n        id: React.PropTypes.string,\n        name: React.PropTypes.string,\n        records: React.PropTypes.arrayOf(React.PropTypes.string)\n    }).isRequired,\n};\n\nexport default Row;\n</code></pre>\n<p>Nechápu proč si někdo říká React programátor... :))</p>\n<h2 id=\"graphql-mutations\">GraphQL mutations <a href=\"#graphql-mutations\">#</a></h2><p>Dobré API však potřebuje ještě minimálně jedu věc - možnost modifikace dat. K tomu slouží mutace. Zde opět musí aplikace (Nette) nadefinovat jaké jsou &quot;endpointy&quot; a jaké mají parametry. Taková mutace potom může vrátit nějaký datový typ a zde se to chová úplně stejně jako <em>queries</em>.</p>\n<p>Tak kupříkladu přihlášení. Z mého pohledu je to mutace, protože měním stav aplikace a proto má moje aplikace připravenou tuto mutaci (toto je skutečný příklad z projektu <a href=\"https://github.com/adeira/connector\">adeira/connector</a> pokud se chcete šťourat v kódu):</p>\n<pre><code>type Mutation {\n  login(username: String!, password: String!): User\n}\n</code></pre><p>Tzn. že pokud pošlu dotaz na to správné místo, tak mi API vratí uživatele, nebo mě odmítne. Využijeme CURL:</p>\n<pre><code>curl -XPOST -H &quot;Content-Type:application/graphql&quot; -d &#39;{&quot;query&quot;: &quot;mutation {login(username:\\&quot;test\\&quot;,password:\\&quot;test\\&quot;){id,token}}&quot;}&#39; http://connector.adeira.localhost/graphql | jq .\n</code></pre><p>A protože jsem zadal správné přihlašovacé údaje, tak mi API vrátí ID a <a href=\"https://jwt.io/\">JWT token</a>, protože o to jsem si v dotazu řekl:</p>\n<pre><code class=\"lang-js\">{\n  &quot;data&quot;: {\n    &quot;login&quot;: {\n      &quot;id&quot;: &quot;4ff2f293-9d21-4407-a6af-08f766e06cb3&quot;,\n      &quot;token&quot;: &quot;eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE0ODMxODE3OTksImV4cCI6MTQ4MzE4NTM5OSwidXVpZCI6IjRmZjJmMjkzLTlkMjEtNDQwNy1hNmFmLTA4Zjc2NmUwNmNiMyJ9.o2aHdbjgtg80e_yXdFJSy4gCTb-4exEbNQbaOK9xa7nyiLpfvYe0FBPizz0XUVrE1JDzkW9m3QnupiVtTDyZ2g&quot;\n    }\n  }\n}\n</code></pre>\n<p>Zde je nutné zdůraznit, že je naprosto zásadní, aby aplikace používala HTTPS. Co když zadám špatné heslo? API samozřejmě náležitě odpoví (včetně správného HTTP kódu):</p>\n<pre><code class=\"lang-js\">{\n  &quot;data&quot;: {\n    &quot;login&quot;: null\n  },\n  &quot;errors&quot;: [\n    {\n      &quot;message&quot;: &quot;The password is incorrect.&quot;,\n      &quot;locations&quot;: [\n        {\n          &quot;line&quot;: 1,\n          &quot;column&quot;: 11\n        }\n      ]\n    }\n  ]\n}\n</code></pre>\n<p>Z API si tak můžu vytáhnout vše co potřebuju pro změnu stavu aplikace. V tomto případě je to jen <a href=\"https://jwt.io/\">JWT token</a>, který si uložím třeba do local storage a jsem na frontendu přihlášen...</p>\n<p>Tento článek se již natáhl více než bych si přál a proto jsem vypustil informaci o implementaci na straně PHP. To totiž vydá na samostatnou kapitolku, takže si to nechám na někdy jindy (možná hned příště, aby to šlo pěkně popořadě).</p>\n<p>Podělte se prosím o postřehy.</p>\n<p>Každý pozorný čtenář si také jistě všiml změny designu (nemluvě o přechodu na AWS) - líbí? :)</p>\n"
});
