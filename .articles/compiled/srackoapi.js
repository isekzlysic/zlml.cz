export default {
  "attributes": {
    "id": "54e244cd-2b74-4532-b36c-74a7827aa231",
    "timestamp": 1405627130000,
    "title": "SračkoAPI",
    "slug": "srackoapi"
  },
  "body": "Následující řádky budou čistý hate na několik tvůrců API, který má posloužit budoucím tvůrcům API. Sám totiž musím obsluhovat několik služeb a získávat z nich data. A ačkoliv se nebráním složitostem, některé věci jsou tak absurdní, že až rozum zůstává stát...\n\nNo to si ze mě děláte...\n------------------------\nPrvní místo na žebříčku debility získává API pro obsluhu a registraci domén od Web4U. Jedná se o klasické SOAP API, které mě však místy přivádí k šílenství. Začnu pěkně od začátku. Aby bylo vůbec možné API volat, musíte nejdříve získat identifikátor služby. Kde jej sehnat? Napadá vás někde v aministraci? Kde jinde také, že? Omyl! Identifikátor služby se získává tak, že zavoláte jakoukoliv funkci z jejich API špatně a identifikátor najdete ve vrácené exception. A to si nedělám prdel. To fakt mají napsané v dokumentaci. A aby toho nebylo málo, tak vrácené ID je ve formátu `IDxxxxxxx, ...`. Koho by však napadlo, že ID je tich prvních 9 znaků, tak je na omylu. ID je totiž to ID bez úvodního ID, tedy `xxxxxxx`. Takto je to možná jasné, ale když k tomu poprvé sednete, tak nad tím sedíte půl dne. Následně lze funkci opět volat s vráceným ID. A právě volání je další sranda.\n\nV dokumentaci je totiž jasně napsáno co jsou povinné vstupní hodnoty, volitelné hodnoty a občas i co to vrací. Takže je to jasné, prostě tam pošlu pole hodnot key-value a je to. Hahaha. Ne. Do tohoto API se totiž posílá pole polí s tím, že je zapotřebí dodržovat přesně stanovený formát a to takovýto:\n\n```php\narray(\n\tarray('name' => 'key', 'data' => 'value'),\n\t//...\n)\n```\n\nJe to jedna z věcí, která je prostě hloupá. Pokaždé se musím sám sebe ptát, proč to tak je? Nerozumím tomu, nemá to žádnou přidanou hodnotu. Jdeme dál. Řekněme, že potřebujete pomocí API zjistit nějakou informaci o doméně, například kdy skutečně expiruje. Na to se stačí jednou týdně zeptat a aktualizovat si informace v databázi. To pro případ, že byla doména prodloužena u třetí strany. No, nebudeme to rozebírat dále. Přes API nelze tuto funkci zavolat. Proč? Vyžaduje totiž captchu. Jo, ta funkce v API se fakt volá přes obrázkovou captchu. Jako jediná. Chápu jak to použít, ale prakticky všechny své projekty dělám plně automatizované, takže jediné řešení je zde najmout [armádu Indů](http://www.root.cz/clanky/potrebujete-obejit-captcha-zaplatte-si-armadu-indu/) a captchy louskat ručně.\n\nA takových perel je tam nespočet. Potřebujete vědět, jestli proběhla funkce v pořádku? Nope. Výstupem z funkce je totiž číslo požadavku. Chybu si totiž musíte poměrně nepěkně vydlabat z exception. Další věc je čistě logická. České domény lze registrovat pouze s NSSETem. Jinak to nejde. U jiných domén se zadávají jednotlivé NS servery. U CZ domény se musí nejdříve vytvořit identifikátor držitele kontaktu. U jiných domén se vytváří při registraci domény. To se všechno může zdát jako maličkosti, ale takové věci vše zbytečně komplikují a použití takového API je spíš otrava. Přitom si myslím, že největší příliv např. domén musí být právě strojově přes API.\n\n...ale už fakt prdel!\n---------------------\nRychlá otázka k zamyšlení. Jak uděláte API, aby bylo možné jej snadno testovat? Změníte například přístupové údaje na testovací, nebo budete posílat nějaký testovací token? OK. Myšlenka je jasná. Kdykoliv se to dá snadno přehodit např. změnou jednoho hesla do ostrého režimu. Jenom v debilním API se metody pro testování jmenují jinak, než metody pro ostré použití. Kurva! To je další věc, která to celé nepříjemně zkomplikuje.\n\n![](https://zlmlcz-media.s3-eu-west-1.amazonaws.com/d10561e0-aeec-4dae-a21e-17eb7c4ca36d/gif.gif)\nDobře, poslední příklad. Nedávno jsem zase něco nevyčetl z dokumentace. Napsal jsem tedy na technickou podporu ať mi poradí, že to tam nemají napsané. Konkrétně se jednalo o povolené vstupní hodnoty do jedné funkce. Na odpověď jsem čekal dva dny, což by ani tak nevadilo, ale hodně jsem se nasmál u odpovědi, která přišla v tomto formátu (původně zapsáno pod sebou):\n\n```\n'cs', 'sk', 'bg', 'hr', 'da', 'nl', 'en', 'et', 'fi', 'fr', 'de', 'el', 'hu', 'ga', 'it', 'lv', 'lt', 'mt', 'pl', 'pt', 'ro', 'sl', 'es', 'sv'\n```\n\nWhat? Takže podpora také nevěděla a tak mi poslala kus vykopírovaného zdrojového PHP kódu z aplikace? V tuto chvíli už mi začíná být všechno jedno... \n\nJde to i jinak?\n---------------\nVím, že ano, ale stále častěji mě někdo přesvědčuje o opaku. Druhé ukázkové API jsem zvolil pro porovnání také typu SOAP. V tomto API je již většina věcí na které jsem do této chvíle nadával vyřešena. Dokonce jsem potěšen z toho, že se jedná o API poměrně inteligentní a tak se mohu dotazovat hodně podobně jako v Doctrine 2. Paráda.\n\nJenže pak přijde, jak říká kolega, další jobovka. API je totiž totálně bez dokumentace, takže téměř jediné místo, kde lze získat informace o vstupních a výstupních hodnotách je prohlédnout si celý dump dané funkce. Dobře, to není problém. Vidím datum ve známém formátu jako string. Posílám tedy také datum ve stejném formátu jako string. Nic. Dobře, poslím ho jako DateTime. Nic. Až po hodně dlouhé době a nahlášeném bugu jsem dostat fuck off odpověď, že to datum zadávám špatně a musí to být v následujícím formátu:\n\n```php\n//...\narray(\n\t'year' => ...->format('Y'),\n\t'month' => ...->format('m'),\n\t'day' => ...->format('d'),\n\t'hour' => ...->format('H'),\n\t'minute' => ...->format('i'),\n)\n//...\n```\n\nA dost vole, seru na to. Na to nemám nervy. Zase ta samá otázka. Proč? Vždyť... Ale nic. Už raději nic.\n\nProsím všechny programátory, **snažte se víc**. Cílem by mělo být **usnadnit používání**, nikoliv však sobě, ale **uživatelům**. Prosím...\n\nHowgh."
}
