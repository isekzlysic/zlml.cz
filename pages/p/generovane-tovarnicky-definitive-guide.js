// @flow

import WithPost from '../../components/WithPost';

export default WithPost({
  "attributes": {
    "timestamp": 1427231722000,
    "title": "Generované továrničky - definitive guide",
    "slug": "generovane-tovarnicky-definitive-guide"
  },
  "body": "<p>No dobře, možná ne úplně definitivní, ale užitečná příručka snad. Pokusím se zde rozebrat všechny potřebné stavy generovaných továrniček, které považuji za důležité a jejich co nejjednodušší zápis v configu. Jedná se hlavně o pohled z hlediska předávání parametrů. Doufám, že to ještě někdo doplní o nějaké vylepšení, nebo další příklad, abych mohl tento seznam rozšířit. To je jeden ze dvou důvodů tohoto typu článků. Ten druhý je, abych měl kam odkazovat, až se mě někdo bude opět ptát.</p>\n<p>Celkem rozebírám tyto jednotlivé případy:</p>\n<ul>\n<li><a href=\"#toc-predani-parametru-z-presenteru\">Předání parametru z presenteru</a></li>\n<li><a href=\"#toc-predani-parametru-z-konfiguracniho-souboru\">Předání parametru z konfiguračního souboru</a><ul>\n<li>Metodou &quot;create&quot;</li>\n<li>Metodou &quot;arguments&quot;</li>\n</ul>\n</li>\n<li><a href=\"#toc-all-in-one\">All in One</a></li>\n</ul>\n<h2 id=\"p-ed-n-parametru-z-presenteru\">Předání parametru z presenteru <a href=\"#p-ed-n-parametru-z-presenteru\">#</a></h2><p>Toto považuji za asi úplně nejčastější požadavek. Komponenta je jednoduchá:</p>\n<pre><code class=\"lang-php\">&lt;?php\n\nclass ParameterComponent extends Nette\\Application\\UI\\Control {\n    public function __construct(array $xxx) {}\n}\n\ninterface IParameterComponentFactory {\n\n    /** @return ParameterComponent */\n    function create(array $xxx);\n\n}\n</code></pre>\n<p>Důležité je, že jak datový typ, tak název proměnné se musí shodovat. Config pak není o nic složitější:</p>\n<pre><code class=\"lang-neon\">services:\n    - IParameterComponentFactory\n</code></pre>\n<p>Kontejner se potom vygeneruje dle očekávání:</p>\n<pre><code class=\"lang-php\">final class Container_59ca411ae5_IParameterComponentFactoryImpl_28_IParameterComponentFactory implements IParameterComponentFactory {\n\n    private $container;\n\n    public function __construct(Container_59ca411ae5 $container) {\n        $this-&gt;container = $container;\n    }\n\n    public function create(array $xxx) {\n        $service = new ParameterComponent($xxx);\n        return $service;\n    }\n\n}\n</code></pre>\n<p>Samotné použití je velmi jednoduché. Stačí si nechat v presenteru předat interface <code>IParameterComponentFactory</code> například pomocí anotace <code>@inject</code> a nad ním volat metodu <code>create</code>. Fígl je právě v tom, že vygenerovaný kód v kontejneru tento interface implementuje a odvádí tak zbytečnou práci za vás. Bez dalších změn lze využít autowire zaregistrovaných služeb. Předání parametru z configu a zároveň získání další závislosti pak může vypadat třeba takto (pouze upravená předchozí komponenta):</p>\n<pre><code class=\"lang-php\">&lt;?php\n\nclass ParameterComponent extends Nette\\Application\\UI\\Control {\n    public function __construct(array $xxx, App\\Model\\UserManager $userManager) {}\n}\n</code></pre>\n<h2 id=\"p-ed-n-parametru-z-konfigura-n-ho-souboru\">Předání parametru z konfiguračního souboru <a href=\"#p-ed-n-parametru-z-konfigura-n-ho-souboru\">#</a></h2><p>Toto je trošku horší, ale pořád snadno pochopitelné. Kód komponenty bude opět podobný:</p>\n<pre><code class=\"lang-php\">&lt;?php\n\nclass ConfigComponent extends Nette\\Application\\UI\\Control {\n    public function __construct($configParam) {}\n}\n\ninterface IConfigComponentFactory {\n    function create();\n}\n</code></pre>\n<p>Všimněte si, že je v tomto případě úplně zbytečná <code>@return</code> anotace. Co má factory vytvářet lze totiž specifikovat v configu:</p>\n<pre><code class=\"lang-neon\">parameters:\n    testkey1: testvalue1\n\nservices:\n    - implement: IConfigComponentFactory\n      create: ConfigComponent(%testkey1%)\n</code></pre>\n<p>Zde by skoro šlo přestat interface úplně psát. To ale není v současné době možné a vygenerovaný kód je pak přesně takový, jaký by měl být:</p>\n<pre><code class=\"lang-php\">final class Container_59ca411ae5_IConfigComponentFactoryImpl_33 implements IConfigComponentFactory {\n\n    private $container;\n\n    public function __construct(Container_59ca411ae5 $container) {\n        $this-&gt;container = $container;\n    }\n\n    public function create() {\n        $service = new ConfigComponent(&#39;testvalue1&#39;);\n        return $service;\n    }\n\n}\n</code></pre>\n<p>Alternativně lze zvolit populárnější způsob a upravit konfigurační soubor takto:</p>\n<pre><code class=\"lang-neon\">parameters:\n    testkey1: testvalue1\n\nservices:\n    - implement: IConfigComponentFactory\n      arguments: [%testkey1%]\n</code></pre>\n<p>Vygenerovaný výsledek je stejný. V tomto případě je však nutné dát pozor na to, že při psaní interface je nutné psát jej i s <code>@return</code> anotací.</p>\n<p>Ok, toto je snad jasné. Co to trošku zkomplikovat?</p>\n<h2 id=\"all-in-one\">All in One <a href=\"#all-in-one\">#</a></h2><p>Toto snad bude dostatečně krajní případ. Pokusíme se vytvořit továrničku pro komponentu, která bude ke svému vytvoření vyžadovat parametr z configu, parametr z presenteru, službu a opět parametr z configu - vše přesně v tomto pořadí. A nebudu se v tom snažit hledat závislosti. Je vyžadováno něco takového:</p>\n<pre><code class=\"lang-php\">&lt;?php\n\nclass AllInComponent extends Nette\\Application\\UI\\Control {\n\n    public function __construct($configParam1, array $userParam, App\\Model\\UserManager $userManager, $configParam2) {}\n\n}\n\ninterface IAllInComponentFactory {\n\n    /** @return AllInComponent */\n    function create(array $userParam);\n\n}\n</code></pre>\n<p>Je tedy jasné, že musím vytvořit <code>create</code> metodu s parametrem, který naplním v presenteru. Zde by opět <code>@return</code> anotace nemusela být. Je úplně zbytečná. A jak na ty parametry z configu? To už je přece vyřešené viz dřívější ukázky:</p>\n<pre><code class=\"lang-neon\">parameters:\n    testkey1: testvalue1\n    testkey2: testvalue2\n\nservices:\n    - implement: IAllInComponentFactory\n      create: AllInComponent(configParam2: %testkey2%, configParam1: %testkey1%)\n</code></pre>\n<p>Zde jsem si to ještě zkomplikoval tím, že jsem zadal parametry v obráceném pořadí (což by přesně takto fungovalo). Abych docílil správného pořadí, musím parametry správně pojmenovat (shodně s konstruktorem komponenty). A vygenerovaný kód? Radost pohledět:</p>\n<pre><code class=\"lang-php\">final class Container_59ca411ae5_IAllInComponentFactoryImpl_32 implements IAllInComponentFactory {\n\n    private $container;\n\n    public function __construct(Container_59ca411ae5 $container) {\n        $this-&gt;container = $container;\n    }\n\n    public function create(array $userParam) {\n        $service = new AllInComponent(&#39;testvalue1&#39;, $userParam, $this-&gt;container-&gt;getService(&#39;27_App_Model_UserManager&#39;), &#39;testvalue2&#39;);\n        return $service;\n    }\n\n}\n</code></pre>\n<p>I v tomto případě je možné zvolit jiný (úspornější) zápis v konfiguračním souboru. Vygenerovaný výstup je opět stejný:</p>\n<pre><code class=\"lang-neon\">parameters:\n    testkey1: testvalue1\n    testkey2: testvalue2\n\nservices:\n    - implement: IAllInComponentFactory\n      arguments: [configParam2: %testkey2%, configParam1: %testkey1%]\n</code></pre>\n<p>Teď mě nenapadá, jestli je někdy (běžně) potřeba ještě něco složitějšího. Toto jsou však dva základní přístupy zkombinované do jedné ukázky. Podívejte se na všechny tyto <a href=\"https://github.com/mrtnzlml/generated-factories\">příklady podrobněji na GitHubu</a>.</p>\n"
});
