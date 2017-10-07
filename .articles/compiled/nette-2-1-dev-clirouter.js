export default {
  "attributes": {
    "id": "01c2866b-fd82-4562-ab63-dbab3505ee8e",
    "timestamp": 1363554156000,
    "title": "Nette 2.1-dev CliRouter",
    "slug": "nette-2-1-dev-clirouter"
  },
  "body": "Routování CLI((Command Line Interface)) aplikací je oblast, o které se v Nette moc nemluví. A když mluví, tak divně (nebo staře). Což na jednu stranu dává smysl, protože tato routa existuje už od roku 2009. Na druhou stranu je to zvláštní, protože je stále experimentální.\n\n> The unidirectional router for CLI.\n> \n> (experimental)\n\nDokonce se už mluvilo o tom, že se zruší. No snad se to nestane...\n\nProč o tom mluvím? Rád bych ukázal, jak se dá v nastávající verzi Nette tato routa použít. V nové verzi Nette se již routy nepíší do bootsrap.php jak tomu bylo (alespoň myslím) dříve. Tentokrát je v adresářové struktuře soubor router/**RouterFactory.php**, který se právě o routování postará. Tento soubor může vypadat například takto:\n\n```php\n<?php\n\nnamespace App;\n\nuse Nette,\n\tNette\\Application\\Routers\\RouteList,\n\tNette\\Application\\Routers\\Route,\n\tNette\\Application\\Routers\\CliRouter;\n\n/**\n * Router factory.\n */\nclass RouterFactory {\n\n\tprivate $container;\n\n\tpublic function __construct(Nette\\DI\\Container $container) {\n\t\t$this->container = $container;\n\t}\n\n\t/**\n\t * @return \\Nette\\Application\\IRouter\n\t */\n\tpublic function createRouter() {\n\t\t$router = new RouteList();\n\t\tif ($this->container->parameters['consoleMode']) {\n\t\t\t$router[] = new CliRouter(array('action' => 'Cli:Cli:cron'));\n\t\t} else {\n\t\t\t$router[] = new Route('rss.xml', 'Front:Blog:rss');\n\t\t\t$router[] = new Route('user/<presenter>/<action>[/<id>]', array(\n\t\t\t\t'module' => 'User',\n\t\t\t\t'presenter' => 'Board',\n\t\t\t\t'action' => 'default',\n\t\t\t));\n\t\t\t$router[] = new Route('<presenter>/<action>[/<id>]', array(\n\t\t\t\t'module' => 'Front',\n\t\t\t\t'presenter' => 'Homepage',\n\t\t\t\t'action' => 'default',\n\t\t\t));\n\t\t}\n\t\treturn $router;\n\t}\n\n}\n```\n\nToto je reálná funkční ukázka (ze které jsem něco nepodstatného umazal). Jak je vidět, tak aplikaci mám rozdělenou na moduly, takže defaultní routa ukazuje do modulu Front, pak je k dispozici User modul, link na RSS a konečně CliRouter, který se naroutuje pouze v případě, že běží aplikace v konzolovém módu (CLI).\n\nPokud se teď přesunu k presenterové části modulu Cli, mohu zde umístit dvě třídy. Klasický BasePresenter, který bude pro jistotu kontrolovat, jestli se opravdu jedná o consoleMode například takto:\n\n```php\n<?php\n\nnamespace App\\CliModule;\n\nuse Nette;\n\nabstract class BasePresenter extends Nette\\Application\\UI\\Presenter {\n\n\tpublic function startup() {\n\t\tparent::startup();\n\t\tif (!$this->context->parameters['consoleMode']) {\n\t\t\tthrow new Nette\\Security\\AuthenticationException;\n\t\t}\n\t}\n\n}\n```\n\nNo a pak už stačí jen CliPresenter, který bude dědit od BasePresenteru, takže vždy dojde ke kontrole. Zde stačí metoda action*(), která se spustí podle naroutování. V mém případě se tedy jedná o actionCron():\n\n```php\n<?php\n\nnamespace App\\CliModule;\n\nuse Nette;\n\nclass CliPresenter extends BasePresenter {\n\n\tpublic function actionCron() {\n\t\techo 'FUNGUJU!';\n\t\t$this->terminate();\n\t}\n\n}\n```\n\nA teď to nejdůležitější! Aplikace se spustí pomocí terminálu jednoduchým příkazem <code>php index.php</code>. Samozřejmě je nutné ukázat na index Nette aplikace. No a samozřejmě se mohu odkázat i na jinou část aplikace dopsání parametru. Pokud bych chtěl podle výše uvedených souborů přejít na hlavní stránku, stačí napsat pouze <code>php index.php Front:Homepage:default</code>."
}