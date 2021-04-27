Ce projet utilise l'implémentation de Consensys du standart ERC1400. Pour relier ce smart contract avec l'oracle, on a jouté de deux fonctions `reserveAndVerifyPayment` et `releasePaidTokens` supplémentaires.

La première n'est pas possible d'être appelée par un utilisateur qui n'a signé lui-même le message envoyé en 3ème param "sig" parce qu'on vérifie sa validité.

Pour la deuxième fonction qui est la fonction de callback, on se sert d'un modifier fournit par la librarie "@chainlink/". Ce modifier assure que ce callback ne peut être évoqué qu'avec un requestId valid provenant de l'address de l'oracle.
