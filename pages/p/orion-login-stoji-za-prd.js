// @flow

import WithPost from '../../components/WithPost';

export default WithPost({
  "attributes": {
    "timestamp": 1394985629000,
    "title": "Orion login stojí za prd",
    "slug": "orion-login-stoji-za-prd"
  },
  "body": "<p>Když jsem dříve připravoval <a href=\"prednaska-z-nette-na-zcu\">prezentaci o Nette Frameworku</a>, hledal jsem nějaký vhodný příklad, na kterém bych demonstroval zranitelnost webových aplikací. Úspešně jsem vyzkoušel pár eshopů a jednu stránku, která slouží ke školním účelům, ale není nijak oficiálně vedená pod univerzitou. Právě zde mě napadlo vyzkoušet také univerzitní systémy. A nestačil jsem se divit.</p>\n<h2 id=\"pozad-univerzitn-ho-p-ihla-ov-n-\">Pozadí univerzitního přihlašování <a href=\"#pozad-univerzitn-ho-p-ihla-ov-n-\">#</a></h2><p>Veškeré ověřování práv a identit putuje přes WebKDC server. Tento server komunikuje s Kerberosem a dohromady tvoří systém, který umožní přihlášení pomocí univerzitních loginů. Celkově proti tomuto systému nemám vůbec nic. Mám však hodně výhrad k jeho konkrétní implementaci. Konkrétní web servery (tam kde jsou umístěny aplikace vyžadující přihlášení) komunikují se vzdáleným WebKDC serverem. Tento server zajistí korektní ověření uživatele (spolupráce s Kerberos) a vráti informaci o úspěšném ověření. Paráda. Vnitřně velmi sofistikovaný systém funguje a umožňuje SSO (Single Sign-On) napříč celou infrastrukturou. Platí to tedy i pro aplikace mimo univerzitní doménu. Zjednodušeně popsáno, ale tématem tohoto článku není ta část, která <a href=\"http://webauth.stanford.edu/\">spolehlivě funguje</a>, ale ta část, která nefunguje.</p>\n<pre><code> WEBKDC &lt;----------&gt; KERBEROS\n   |||\n   |||\n WEBAUTH (server s aplikací vyžadující přihlášení)\n    |\n    |\n STUDENT\n</code></pre><p>Jako poměrně zásadní fakt vidím to, že dokud student neklikne na &quot;LOGIN&quot;, tak ho tento systém nepřihlásí (většinou). Nachází se tedy na úrovni &quot;WEBAUTH&quot;, ale vidí jen omezenou stránku. Jakmile se chce přihlásit, aplikace jej přesměruje na WebKDC login-server, kde může vyplnit své přihlašovací informace, nebo je již přihlášen někdy z dřívější doby a v obou případech je přesměrován zpět na server s webovou aplikací. Už vidíte ten problém? :-)</p>\n<h2 id=\"xss-quot-onclick-quot-alert-document-cookie-\">XSS&quot; onclick=&quot;alert(document.cookie); //:-) <a href=\"#xss-quot-onclick-quot-alert-document-cookie-\">#</a></h2><p>Právě komunikace mezi WEBAUTH a WEBKDC je pro ověření naprosto zásadní, ale díky tomu, že zřejmě není nastavena žádná implementační laťka, tzn. že kdokoliv chce přihlašovat pomocí tohoto systému tak si to prostě nějak naprogramuje, vznikají bezpečnostní bublinky. Pravděpodobně neexistuje žádná konvence jak tento systém implementovat, takže neexistují ani takové funkce, jako je třeba ověřování již aktivního přihlášení atd. Může se tedy stát, že budu přihlášen (ověřen) ve webové aplikaci, ale na WEBKDC jsem odhlášen, protože WEBAUTH už se o to v tuto chvíli nestará (ten je přihlášen).</p>\n<p>Díky tomuto poznatku mohu velmi jednoduše vše co jsem teď napsal zapomenout, protože se dá celé složité schéma zjednodušit na toto:</p>\n<pre><code> WEBAUTH                   WEB-APP\n    |          resp.          |\n    |                         |\n STUDENT                   STUDENT\n</code></pre><p>Tak moment. Není to úplně normální přihlášení tak jako je na jakékoliv jiné úplně obyčejné stránce? Uživatel (student, profesor, administrátor) je přihlášen a teď už je to pouze nudná otrocká práce. Myslím, že mohu prozradit, že je stránka (čti univerzitní projekty) náchylná na session hijacking, na to přijde každý blbec, který o tom četl na wiki. A asi nemá smysl tajit, že XSS je naprosto reálná (a vyzkoušená) hrozba. Nebudu však říkat kde. A vzhledem k tomu, že tento systém webových portálů (IBM Web-Sphere Portal) není žádná domácí výroba, tak předpokládám, že stejný problém budou mít i další univerzity.</p>\n<pre><code> WEB-APP1     WEB-APP2\n    |            |\n    |----------EVA\n STUDENT\n</code></pre><p>Od první chvíle, kdy jsem na tento problém upozorňoval poprvé jsou některé věci v současné době na serverech pozměněny, ale to zásadní zůstává pořád stejné. Nezáleží na tom co je v pozadí, když je řetěz tak silný, jak je silný jeho nejslabší článek a zvlášť, když ten silný zbytek řetězu skoro ani není potřeba...</p>\n"
});
