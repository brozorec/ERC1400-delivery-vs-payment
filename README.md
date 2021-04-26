# Delivery vs. Payment (DvP)

### Automatiser le cas post-trade des ventes de securities sur les plateformes de tokenisation

Le post-trade sur les plateformes de tokenisation dans le cas des levée de fonds STO,
soulève encore des risques de contre-partie quand l’émetteur doit lui-même procéder au transfert des titres contre un règlement obligatoire en monnaie fiat.
Cette dApp apporte la confiance nécessaire au bon fonctionnement du post-trade.
Elle automatise le règlement-livraison en supprimant les manipulations des utilisateurs lors du transfert des security tokens, suite aux STO.

## Comment ça marche
![General scheme](https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/general.png)

### Étapes :

1. L'investisseur déclare son intention en entrant le montant de tokens qu'il veut acheter et on obtient un code pour cette transaction de la part du PSP.
![Step 1](https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/step1.png)

2. Avec ce code l'investisseur signe un message grâce à son wallet.
On assure de cette manière le lien entre le paiement et l'identité de l'investisseur (son adresse) et on évite que quelqu'un d'autre utilise ce code de paiement.
L'investisseur paie et on bloque les fonds en escrow.
![Step 2](https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/step2.png)

3. Avec le message de l'étape 2 l'investisseur crée une transaction on-chain pour interagir avec le smart contract. 
Le smart contract "réserve" la quantité de tokens pour l'investisseur.
![Step 3](https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/step3.png)

4. Le smart contract fait une requête auprès de l'oracle pour vérifier que le message correspond bien au paiement déclaré.
Si c'est le cas, la quantité réservée en 6.1 est débloquée et l'investisseur dispose de ces tokens.
![Step 4](https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/step4.png)

5. Le smart contract émet un "event" qui confirme que les jetons ont été bien transférés à l'investisseur.
Cet "event" est capté par le serveur et les fonds bloqués sont "capture".
![Step 5](https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/step5.png)
