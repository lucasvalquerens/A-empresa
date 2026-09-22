A EMPRESA — SITE + CHECKOUT INFINITEPAY

Produtos:
1. Moletom preto — R$ 95,00
2. Moletom verde — R$ 95,00
3. Camiseta The World Is Yours — R$ 60,00
4. Camiseta frente/verso — R$ 65,00

InfiniteTag configurada: lucas-reis-dos-santos06

IMPORTANTE:
O Checkout Integrado da InfinitePay precisa de um servidor para criar o link de pagamento via API. Este pacote já inclui server.js para isso.

Para publicar:
1. Use uma hospedagem que rode Node.js.
2. Defina a variável INFINITEPAY_HANDLE como lucas-reis-dos-santos06.
3. Defina PUBLIC_URL como o endereço público do site, por exemplo https://www.seusite.com.br.
4. Rode: npm start

O botão COMPRAR chama /api/checkout, que cria um checkout na InfinitePay com o produto e valor corretos.

A InfinitePay documenta que o Checkout Integrado aceita Pix e cartão de crédito. O débito não é indicado pela documentação do checkout online.
