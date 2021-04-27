1. On vérfie qu'un utilisateur n'ayant pas signé lui-même le message passé en 3ème paramètre de la fonction "reserveAndVerifyPayment" ne peut pas réserver des jetons. On utlise le premier et le deuxième paramètre pour reconstituer le message et s'assurer qu'ils ont le même auteur.
2. On vérifie que la fonction ne peut être appelée qu'avec un "requestId" valid.


