// @flow

import WithPost from '../../components/WithPost';

export default WithPost({
  "attributes": {
    "id": "71e8347e-9bdb-4d81-a323-203be472f0ad",
    "timestamp": 1376169022000,
    "title": "RSS a Sitemap jednoduše a rychle",
    "slug": "rss-a-sitemap-jednoduse-a-rychle"
  },
  "body": "<p>Pár článků zpět jsem ukazoval několik příkladů, jak tvořit různé routy. Ukazoval jsem routy pro RSS i sitemap.xml. Nikde jsem však zatím neukazoval jak je to jednoduše realizovatelné. Dokonce tak jednoduše, že je škoda tyto soubory nevyužít na jakémkoliv webu, protože mají poměrně velký potenciál.</p>\n<p>Začněme HomepagePresenterem (DEV Nette):</p>\n<pre><code class=\"lang-php\">&lt;?php\n\nclass HomepagePresenter extends BasePresenter {\n\n    /** @var \\Model\\Posts @inject */\n    public $posts;\n\n    public function renderRss() {\n        $this-&gt;template-&gt;posts = $this-&gt;posts-&gt;getAllPosts()-&gt;order(&#39;date DESC&#39;)-&gt;limit(50);\n    }\n\n    public function renderSitemap() {\n        $this-&gt;template-&gt;sitemap = $this-&gt;posts-&gt;getAllPosts();\n    }\n\n}\n</code></pre>\n<p>Tímto říkám, že do šablon <code>rss.latte</code> a <code>sitemap.latte</code> předávám všechny články, nebo jen některé, protože nechci dělat dump celé databáze pro RSS.</p>\n<p>Pro úplnost ještě \\Model\\Posts:</p>\n<pre><code class=\"lang-php\">&lt;?php\n\nnamespace Model;\n\nclass Posts extends \\Nette\\Object {\n\n    /** @var \\Nette\\Database\\SelectionFactory @inject */\n    public $sf;\n\n    /**\n     * @return Nette\\Database\\Table\\Selection\n     */\n    public function getAllPosts() {\n        return $this-&gt;sf-&gt;table(&#39;posts&#39;);\n    }\n\n}\n</code></pre>\n<p>A následují samotné šablony, které musí dodržovat určitý formát, takže se lehce odlišují od normálních šablon. Sitemap.latte:</p>\n<pre><code class=\"lang-html\">{contentType application/xml}\n&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;\n\n&lt;urlset xmlns=&quot;http://www.sitemaps.org/schemas/sitemap/0.9&quot;&gt;\n    {foreach $sitemap as $s}\n        &lt;url&gt;\n            &lt;loc&gt;{link //Single:article $s-&gt;id}&lt;/loc&gt;\n        &lt;/url&gt;\n    {/foreach}\n&lt;/urlset&gt;\n</code></pre>\n<p>Rss.latte:</p>\n<pre><code class=\"lang-html\">{contentType application/xml}\n&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;\n\n&lt;rss version=&quot;2.0&quot;&gt;\n    &lt;channel&gt;\n        &lt;title&gt;Martin Zlámal [BLOG]&lt;/title&gt;\n        &lt;link&gt;{link //:Homepage:default}&lt;/link&gt;\n        &lt;description&gt;Nejnovější články na blogu.&lt;/description&gt;\n        &lt;language&gt;cs&lt;/language&gt;\n\n        &lt;item n:foreach=&quot;$posts as $post&quot;&gt;\n            &lt;title&gt;{$post-&gt;title}&lt;/title&gt;\n            &lt;link&gt;{link //:Single:article $post-&gt;id}&lt;/link&gt;\n            &lt;description&gt;{$post-&gt;body|texy|striptags}&lt;/description&gt;\n        &lt;/item&gt;\n    &lt;/channel&gt;\n&lt;/rss&gt;\n</code></pre>\n<p>A pro úplnou úplnost i router:</p>\n<pre><code class=\"lang-php\">&lt;?php\n\nnamespace App;\nuse Nette;\nuse Nette\\Application\\Routers\\Route;\nuse Nette\\Application\\Routers\\RouteList;\nuse Nette\\Application\\Routers\\SimpleRouter;\n\nclass RouterFactory {\n\n    /**\n     * @return \\Nette\\Application\\IRouter\n     */\n    public function createRouter() {\n        $router = new RouteList();\n        $router[] = new Route(&#39;sitemap.xml&#39;, &#39;Homepage:sitemap&#39;);\n        // na RSS se dá odkazovat normálně bez routeru, nebo:\n        $router[] = new Route(&#39;rss.xml&#39;, &#39;Homepage:rss&#39;);\n        //...\n        $router[] = new Route(&#39;&lt;presenter&gt;/&lt;action&gt;[/&lt;id&gt;]&#39;, &#39;Homepage:default&#39;);\n        return $router;\n    }\n\n}\n</code></pre>\n<p>Jednoduché a na pár řádek. Jen vědět jak na to... (-:</p>\n"
});