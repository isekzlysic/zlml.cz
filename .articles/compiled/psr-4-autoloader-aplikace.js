export default {
  "attributes": {
    "id": "847a3113-3989-46a4-9486-41bf0d49fe16",
    "timestamp": 1460891805000,
    "title": "PSR-4 autoloader aplikace",
    "slug": "psr-4-autoloader-aplikace"
  },
  "body": "Nikdy jsem moc nelpěl na PSR-FIG pravidlech. Částečně možná proto, že jsem je nikdy moc nechápal, částečně možná proto, že nemám rád, když mi někdo něco nutí. Nekterá pravidla jsou ale docela fajn (i když se vždy něco najde). Jedním z jich je [PSR-4: Improved Autoloading](http://www.php-fig.org/psr/psr-4/). Jenže proč řešit nějaký autoloading, když v Nette funguje skvěle, ani o tom člověk neví? Fakticky jsou v každém sandboxu použity minimálně 2 autoloadery a mohl bych se tedy ohánět rychlostí, protože:\n\n> *If there must be multiple autoload functions, spl_autoload_register() allows for this. It effectively creates a queue of autoload functions, and runs through each of them in the order they are defined. By contrast, __autoload() may only be defined once. ([zdroj](http://php.net/manual/en/function.spl-autoload-register.php)*)\n\nAle to je otázka a praticky jsem nikdy žádný významný posun ve výkonu nezaregistroval (i když teoreticky nemusím iterovat přes celý vendor, abych našel něco v app). Mnohem významnější je pro mě sada pravidel, kterými se programátor musí při použití PSR-4 řídit. Ty budu postupně popisovat v následujícím textu.\n\n# PSR-4 na čistém projektu\n\nNasadit PSR-4 na [čistém projektu](https://github.com/nette/web-project) je jednoduché. Stačí pouze pár jednoduchých kroků. V první řadě odstraníme RobotLoader - nebude vůbec potřeba. To znamená odstranit jej z `composer.json` a smazat z `bootstrap.php`. Teď ale aplikace nefunguje. Vraťme se tedy do `composer.json` a přidáme jednu sekci s definicí PSR-4 autoloaderu:\n\n```js\n\"autoload\": {\n  \"psr-4\": {\n    \"App\\\\\": [\n      \"app/router/\"\n    ],\n    \"App\\\\Presenters\\\\\": [\n      \"app/presenters/\"\n    ]\n  }\n}\n```\n\nMůže se stát, že to nebude hned fungovat, pak stačí spustit příkaz `composer dump-autoload` a Composer si přegeneruje autoloading pravidla. Teď nám však web-project vrátí toto:\n\n> *RobotLoader is required to find presenters, install package `nette/robot-loader` or disable option application.scanDirs: false* .{color:red}\n\nDobře, tak zakážeme prohledávání vendoru za účelem nalezení presenterů ve vendoru. Stejně to teď nepotřebujeme:\n\n```neon\napplication:\n\tscanDirs: no\n```\n\nA aplikace rázem opět funguje. Udělal jsem to schválně tak, aby fungoval web-project bez zásahu do struktury. Je zde však několik drobných problémů, které nejsou možná na první pohled vidět. Zejména je ošklivá definice v `composer.json`. Proč by to nemohlo být prostě jen takto:\n\n```js\n\"autoload\": {\n  \"psr-4\": {\n    \"App\\\\\": [\n      \"app/\"\n    ]\n  }\n}\n```\n\nMohlo, jen musíme zasáhnout do adresářové struktury (nezapomeňte na `composer dump-autoload`). Tímto mappingem totiž určujeme kde má být třída umístěna v adresářové struktuře vzhledem k namespace. Takže když bude namespace začínat na `App`, tak se budou třídy hledat ve složce `app`. Jenže je třeba dodržet minimálně jedno důležité pavidlo. Namespace (a tedy i výsledná adresářová struktura) musí být case-sensitive - což ve web-projectu není. Toto je pro mě asi největší přínos PSR-4. Jasně je totiž dáno jak se má adresářová struktura tvořit. Prostě podle toho jaké chci používat namespace. Vždy jsem totiž zápasil s tím, jestli psát složky s velkým písmenem a jak moc vše zanořovat atd. Teď je to vše jasné.\n\nPřejmenujme tedy `\\App\\RouterFactory` na `\\App\\Router\\RouterFactory`. Nezapomeňte přeregistrovat službu v `config.neon` a změnit název složky v `router` na `Router`. Podobnou úpravu provedeme i s presentery kdy stačí jen zvětšit první písmeno složky `Presenters`. A aplikace stále funguje. :)\n\nPodobné jednoduché úpravy budou fungovat na jakémkoliv projektu, je však zřejmé, že je občas vhodné zasáhnout do adresářové struktury, proto bych doporučoval udělat tyto úpravy co nejdříve (pokud chcete PSR-4).\n\n# Composer autoload\n\nJak to tedy celé vlastně funguje? Vše to vězí v této první řádce `boostrap.php`:\n\n```php\n$classLoader = require __DIR__ . '/../vendor/autoload.php';\n```\n\nV souboru `autoload.php` se skrývá něco takového:\n\n```php\n<?php\n\n// autoload.php @generated by Composer\n\nrequire_once __DIR__ . '/composer' . '/autoload_real.php';\n\nreturn ComposerAutoloaderInit091ed5d24b4127ffc48411e34be2086f::getLoader();\n```\n\nZde se připraví pomocí třídy `\\Composer\\Autoload\\ClassLoader` autoloader ze všech možných zdrojů (pomocí `spl_autoload_register`), které [Composer podporuje](https://getcomposer.org/doc/04-schema.md#autoload).\n\nA to je vlastně celé. Ještě existují dvě vylepšení, které Composer podporuje u příkazu `dump-autoload`:\n \n- `--optimize` (`-o`): Convert PSR-0/4 autoloading to classmap to get a faster autoloader. This is recommended especially for production, but can take a bit of time to run so it is currently not done by default.\n- `--classmap-authoritative` (`-a`): Autoload classes from the classmap only. Implicitly enables `--optimize`.\n\nPokud tedy chcete načítání tříd ještě zrychlit, tak vytvořte optimalizovaný autoloader, který předpřipraví pole s názvem třídy a rovnou kde lze danou třídu najít. To je velmi rychlé, protože se PHP dívá jen do tohoto pole viz implementace:\n\n```php\n// class map lookup\nif (isset($this->classMap[$class])) {\n    return $this->classMap[$class];\n}\n```\n\nNavíc v authoritative módu tímto Composer končí a dál nehledá. Jinak se pokusí ještě najít třídu pomocí dalších způsobů autoloadingu. Pro názornost uvedu jak vypadá Composer autoloader v jednotlivých módech. První je jen tak bez ničeho:\n\n```\nComposer\\Autoload\\ClassLoader #5cfb ▼\n  prefixLengthsPsr4 => array (1) ▼\n    A => array (1) ▼\n      \"App\\\" => 4\n  prefixDirsPsr4 private => array (1) ▼\n    \"App\\\" => array (1) ▼\n      0 => \"/var/www/html/web-project/app\" (29)\n  classMap private => array (345) ►\n  classMapAuthoritative private => FALSE\n```\n\nJe vidět, že je zaregistrovaný pouze jeden jmenný prostor, v classmap autoloaderu je navíc 345 tříd a nepoužíváme authoritative mód. Optimalizovaný autoloader (`composer dump-autoload --optimize`) se liší jen málo:\n\n```\nComposer\\Autoload\\ClassLoader #c492 ▼\n  prefixLengthsPsr4 => array (1) ▼\n    A => array (1) ▼\n      \"App\\\" => 4\n  prefixDirsPsr4 private => array (1) ▼\n    \"App\\\" => array (1) ▼\n      0 => \"/var/www/html/web-project/app\" (29)\n  classMap private => array (349) ►\n  classMapAuthoritative private => FALSE\n```\n\nKonkrétně je v classmap autoloaderu najednou 349 třídy (navíc 3x presenter a RouterFactory).  Authoritative mód (`composer dump-autoload -a`) už je o něco odlišnější:\n\n```\nComposer\\Autoload\\ClassLoader #7553 ▼\n  prefixLengthsPsr4 private => array ()\n  prefixDirsPsr4 private => array ()\n  classMap private => array (349) ►\n  classMapAuthoritative private => TRUE\n```\n\nStále je v classmap 349 tříd, ale interně už neexistuje nic jako PSR-4 autoloader a vše se tedy hledá pouze v classmap autoloaderu. S touto ukázkou to musí být všem už naprosto jasné. :)\n\n# PSR-4 ve starší aplikaci\n\nVe starších (již fungujících) aplikacích je vše samozřejmě stejné. Je však třeba upozornit na další PSR-4 pravidlo, kvůli kterému jsem se dlouho zdráhal přejít. Každá třída totiž musí být ve vlastním souboru. Toto pravidlo je určitě dobré, ale myslím si, že dává smysl připojovat definice generovaných továren do toho samého souboru, jako třeba komponentu kterou vytvářejí. Při přechodu je tedy třeba tyto soubory rozdělit.\n\nDalší nepříjemností může být struktura, která na PSR-4 prostě nesedí a bylo by velmi složité vše předělávat. Je však škoda nepoužít Composer autoloader jen kvůli takovému drobnému zádrhelu. V tomto případě je možné použít třeba dříve zmiňovaný classmap:\n\n```js\n\"autoload\": {\n  \"psr-4\": {\n    \"App\\\\\": [\n      \"app/\"\n    ]\n  },\n  \"classmap\": [\n    \"libs/\",\n    \"include/\"\n  ]\n}\n```\n\nToto jen potvrzuje to, co jsem psal již dříve. Je dobré rozmyslet se včas, protože přechod může být později téměř nemožný. Každopádně striknost z hlediska adresářové struktury je pro mě tak důležitá, že jsem přestal váhat a přešel jsem. Pořád si nejsem jist s tím, jestli oddělené generované továrničky jsou přesně to, co se mi líbí, ale to už je jen drobný problém."
}
