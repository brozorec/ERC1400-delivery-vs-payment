# Delivery vs. Payment (DvP)

### Automatiser le cas post-trade des ventes de securities sur les plateformes de tokenisation

Le post-trade sur les plateformes de tokenisation dans le cas des levée de fonds STO,
soulève encore des risques de contre-partie quand l’émetteur doit lui-même procéder au transfert des titres contre un règlement obligatoire en monnaie fiat. 
Cette dApp apporte la confiance nécessaire au bon fonctionnement du post-trade.
Elle automatise le règlement-livraison en supprimant les manipulations des utilisateurs lors du transfert des security tokens, suite aux STO.

## Comment ça marche
Aujourd'hui, le cadre reglemantaire ne permet pas aux investisseurs dans un STO de payer en crypto monnaie. Le règlement doit se faire obligatoirement en fiat. C'est pour ça ce projet introduit l'utilisation d'un oracle qui va relier les données de paiement off-chain avec le smart contract.

![General scheme](https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/general.png)

### Étapes :

1. L'investisseur déclare son intention en entrant le montant de tokens qu'il veut acheter et on obtient un code pour cette transaction de la part du PSP.
<img src="https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/step1.png" height="500px" width="230px"/>

2. Avec ce code l'investisseur signe un message grâce à son wallet.
On assure de cette manière le lien entre le paiement et l'identité de l'investisseur (son adresse) et on évite que quelqu'un d'autre utilise ce code de paiement.
L'investisseur paie et on bloque les fonds en escrow.
<img src="https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/step2.png" height="500px" width="230px"/>

3. Avec le message de l'étape 2 l'investisseur crée une transaction on-chain pour interagir avec le smart contract. 
Le smart contract "réserve" la quantité de tokens pour l'investisseur.
<img src="https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/step3.png" height="360px" width="180px"/>

4. Le smart contract fait une requête auprès de l'oracle pour vérifier que le message correspond bien au paiement déclaré.
Si c'est le cas, la quantité réservée en 6.1 est débloquée et l'investisseur dispose de ces tokens.
<img src="https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/step4.png" height="550px" width="350px"/>

5. Le smart contract émet un "event" qui confirme que les jetons ont été bien transférés à l'investisseur.
Cet "event" est capté par le serveur et les fonds bloqués sont "capture".
<img src="https://github.com/brozorec/ERC1400-delivery-vs-payment/blob/main/images/step5.png" height="350px" width="350px"/>

## Structure

Le projet consiste de 4 éléments :

- ERC1400 smart contract (`/packages/hardhat`) - implémente la logic on-chain. Le smart contract est un fork de https://github.com/ConsenSys/UniversalToken
- Back-end (`/packages/server`) - Node API qui relie le front-end, le PSP (Stripe) et l'oracle
- Front-end (`/packages/react-app`) - interface qui permet à un investisseur de réserver et de payer pour des ERC1400
- Chainlink node (`/packages/chainlink`) - execute un "custom job" et ainsi relie le smart contract le données off-chain

## Installation et tests

1. `git clone https://github.com/brozorec/ERC1400-delivery-vs-payment.git`
2. `cd ERC1400-delivery-vs-payment`
3. `yarn`
4. `yarn fork`
5. dans une autre fenêtre du terminal `yarn test`
