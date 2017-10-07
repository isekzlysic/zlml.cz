export default {
  "attributes": {
    "id": "58e7368b-0db4-498f-8184-fc4877ba32ba",
    "timestamp": 1387113023000,
    "title": "Nette 2.2-dev",
    "slug": "nette-2-2-dev"
  },
  "body": "<p>Nedávno byla změněna vývojová verze Nette Frameworku na 2.2-dev (<a href=\"https://github.com/nette/nette/commit/3a426255084163ec1a2f324ea0d3e9b3139adccc\">https://github.com/nette/nette/commit/3a426255084163ec1a2f324ea0d3e9b3139adccc</a>).\nTato změna s sebou přinesla explozi změn. Na následujících řádcích bych rád přiblížil\nněkteré zásadní změny, které se odehrály a je zapotřebí je upravit, aby bylo možné z verze 2.1-dev\npřejít právě na verzi 2.2-dev.</p>\n<h2 id=\"nutn-pravy\">Nutné úpravy <a href=\"#nutn-pravy\">#</a></h2><p>Prvě se změnilo umístění konfigurátoru. Tato změna se samozřejmě týká souboru <code>bootstrap.php</code>.\nNově je konfigurátor v novém umístění:</p>\n<pre><code class=\"lang-php\">//$configurator = new Nette\\Config\\Configurator;\n$configurator = new \\Nette\\Configurator;\n</code></pre>\n<p>Dále jsem si zvykl používat automatické injektování závislostí pomocí anotace <code>@inject</code>.\nPro opětovné použití je nutné zapnout <code>nette.container.accessors</code>, což ostatně napoví chybová hláška,\njelikož je tato volba v nové developměnt verzi Nette ve výchozím stavu zakázána. Config.neon:</p>\n<pre><code class=\"lang-neon\">nette:\n    container:\n        accessors: TRUE\n</code></pre>\n<p>Nyní již bude možné anotace <code>@inject</code> používat. Další změna, které mě osobně moc nepotěšila\na nevím co jí předcházelo je zrušení podpory krátkého zápisu bloků:</p>\n<pre><code class=\"lang-html\">&lt;!-- Předtím: --&gt;\n{#content}\n    ...\n{/#}\n&lt;!-- Nyní: --&gt;\n{block content}\n    ...\n{/block}\n</code></pre>\n<p>Tato změna se mi moc nelíbí, protože například stále funguje <code>{include #parent}</code>, což je prostě\nzvláštní... Za zmínku také stojí změna třídy pro práci s databází. Zatímco se ve verzi 2.0.13\nnormálně používá <code>Nette\\Database\\Connection</code>, ve verzi 2.1-dev se přešlo na <code>Nette\\Database\\SelectionFactory</code>, \nnicméně ve verzi 2.1.0RC2 se již pracuje s <code>Nette\\Database\\Context</code> a SelectionFactory již neexistuje. \nToto  platí i pro verzi 2.2-dev. Tato změna mi bude zřejmě dlouho trvat, než ji vstřebám.\nMyslím si, že obyčejné <code>Nette\\Database</code> by bylo v modelu daleko více vypovídající než nějaký Context, \nale budiž.</p>\n<p>Tolik k podle mého zásadním změnám, které zabrání například spuštění projektu z quickstartu. Nyní\nbych rád poukázal na několik málo změn z celé té exploze, které mě zaujaly.</p>\n<h2 id=\"dal-zm-ny\">Další změny <a href=\"#dal-zm-ny\">#</a></h2><p>Byla odstraněna celá řada zastaralých věcí. Nemá smysl je rozebírat. Je jich hodně a zastaralé jsou\nuž od 2.1. Každopádně například makro <code>n:input</code> se stalo zastaralé a k dispozici je nové makro\n<code>{inputError}</code>, které ošéfuje vykreslení chybové hlášky u příslušného políčka. Jééj! :-)</p>\n<p>Lehce odlišně se také přistupuje k checkboxům a vůbec, formuláře jsou zase o něco lepší, což\npředpokládám souvisí s:</p>\n<p><blockquote class=\"twitter-tweet\" lang=\"en\"><p>Chtěl jsem v rychlosti udělat příklad, jak v <a href=\"https://twitter.com/search?q=%23netteFw&amp;src=hash\">#netteFw</a> renderovat formuláře s Twitter Bootstrapem.&#10;&#10;Zabitej den a překopaný Nette…</p>&mdash; geekovo (@geekovo) <a href=\"https://twitter.com/geekovo/statuses/409064701369516032\">December 6, 2013</a></blockquote></p>\n<script async src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>\n\n<h2 id=\"kone-n-\">Konečně! <a href=\"#kone-n-\">#</a></h2><p>Světlo světa spatřil nový <a href=\"http://doc.nette.org/cs/2.1/quickstart\">quickstart</a> v češtině pro dnes již téměř nekatuální verzi 2.0.13.\nVěřím tomu, že se jedná o daleko přínosnější věc, než psaní pokročilých návodů v angličtině\n(navazujících na quickstart) a doufám, že tento počin pomůže pár lidí popostrčit dál...</p>\n<p>Jaká změna vás zaujala nejvíce?</p>\n"
}
