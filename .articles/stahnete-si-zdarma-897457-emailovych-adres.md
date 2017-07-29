V následujícím článku bych rád nastínil problematiku newsletterů nejen z programátorského hlediska <s>a také bych se rád opřel do bezpečnosti společnosti Wedos, které mnoho lidí tolik věří</s>... (-:

<span style="color:green">Tento projekt pravděpodobně nemá se společností Wedos nic společného jak jsem si zřejmě mylně myslel.</span>

# Na začátku byl email

Jednoho dne mi přišel email, který byl automaticky filtrován jako spam. Vzhledem k tomu, že když mě něco štve, tak to řeším, spam jsem otevřel a hledal odkaz na odhlášení. Ten byl dobře umístěn, stačilo kliknout a hotovo. Každý přece ví, že to takto má být. Když je odhlášení delší, než kliknutí na spam v email klientovi, je to problém. Bohužel tento odkaz vedlo na doménu <code>m-letter.eu</code>. Mě samozřejmě zajímá jak jsem se dostal do takového spam listu a jelikož jsem byl odkázán na mě neznámou doménu, byl jsem velmi rozezlen.

<s>Zde je nutné říct, že jsem dříve jednal, než pátral. Nakonec se ukázalo, že jsem byl možná v tomto listu oprávněně, jelikož se jedná o doménu, ze které zřejmě Wedos odesílá podobné reklamní emaily, takže je dost pravděpodobné, že jsem s tím dříve souhlasil.</s>

<span style="color:green">Při hlubším pátrání jsem zjistil, že jsem stále nic nezjistil. Chybně jsem tento problém svedl na někoho jiného, což mě odvedlo na špatnou kolej. Stále tedy nevím, kde jsem se na tomto spam listu vzal a opět to beru osobně. Není mi to jedno...</span>

# Neštvi programátora

Celý reklamní systém je udělán dosti nešťastně, takže než abych pátral jak jsem se tam dostal, soustředil jsem se na něco jiného, co pro mě z pohledu programátora webových aplikací bylo dost zajímavé. URL adresa. Celá adresa pro odhlášení je v následujícím formátu:

```
http://www.m-letter.eu/odh.html?c=XXXXXXX&s=53&q=51
```

Kde **XXXXXXX** je číslo zhruba od 1300486 do 2197943. To mě zaujalo a tak jsem toto číslo začal měnit. A ukázalo se, že jsem odhlašoval další lidi. V té době ještě tato stránka vypsala informaci o úspěšném odhlášení včetně emailu, který byl odhlášen. Vzhledem k tomu, že stránka je velmi jednoduchá, lze programově stejně jednoduše získat onu emailovou adresu.

Jen si představte program, který iteruje tuto URL adresu a jen sbírá emaily. 897457. To je počet emailů které takto získáte. **897457**. Navíc tímto celý systém znehodnotíte, protože všechny odhlásíte. A pro takový počet emailů to již není zanedbatelné.

# To má být jako oprava?

Nejde mi zrovna o to znehodnotit celý čupr dupr systém na spamování, ale proč ne. Tato informace se poměrně rychle rozšířila a o pár minut později mi byl odepřen přístup na tento server. Navíc výpis byl pozměněn tak, aby již nešlo stáhnout téměř 900 000 emailových adres. Nicméně celý systém zřejmě stále funguje stejně, takže můžete jednoduše iterovat URL adresy a tím celý systém znehodnotit:

```php
<?php
for ($i=2197943; $i > 1300486; $i--) {
    file_get_contents("http://www.m-letter.eu/odh.html?c=$i&s=53&q=51");
}
```

Doporučuji spustit v příkazové řádce, kde není nastaven pro PHP timeout. Iterace je schválně pozpátku, protože se dá předpokládat, že ty nejnovější záznamy mají větší číslo a ty s malým číslem už dost možná nebudou aktuální. Celý program jsem měl daleko složitější, vzhledem k tomu, že jsem byl připraven na stáhnutí všech emailů. Po změně výpisu již většina programu není potřeba a stačí tedy tři řádky pro znehodnocení celého nezanedbatelně velkého systému.

<s>Dejme tedy někomu z Wedos čas na opravu a pak hurá na hromadný lynč.</s> <span style="color:green">Opět stejný problém jako předtím. Doufám, že mám tentokrát pravdu...</span> Sice jde jen o emailové adresy, ale vzpomeňte si na to až zase budete nadávat na spam, nebo souhlasit s tím, že vaše emailová adresa nebude nikde uveřejněna.