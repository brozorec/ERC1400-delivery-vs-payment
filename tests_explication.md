Le processus de règlement-livraison présenté dans ce projet nécessite la communication entre plusieurs parties "on-chain" et "off-chain". Un élément très important de notre solution est le service de payement (le PSP) dont l'environement de test n'est pas sous notre contrôle. Pour cela nous n'effectuons que les tests suivants  qui permettent de s'assurer que :

1. un utilisateur n'ayant pas signé lui-même le message passé en 3ème paramètre de la fonction "reserveAndVerifyPayment" ne peut pas réserver des jetons. Le premier et le deuxième paramètres sont utilisés pour reconstituer le message dans le corps de la fonction.
2. la fonction ne peut être appelée qu'avec un "requestId" valide.


Le contrat ERC1400 est un fork de ["Univeral Token"](https://github.com/ConsenSys/UniversalToken) de ConsenSys. Un ensemble de tests supplémentaires pour toutes les autres fonctions non spécifiques au projet est disponible [ici](https://github.com/ConsenSys/UniversalToken/tree/master/test).
