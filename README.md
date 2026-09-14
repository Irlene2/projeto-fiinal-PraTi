# AKI - Delivery

Frontend base do app de pedidos e entregas.

## Tecnologias
- HTML5
- CSS3
- JavaScript puro

## Estrutura
- `index.html`: seleção de perfil
- `pages/administrador.html`: dashboard administrativo
- `pages/entregador.html`: pedidos e entregas
- `pages/cliente.html`: catálogo, carrinho e checkout
- `css/style.css`: CSS reutilizável e responsivo
- `js/tema.js`: modo claro/escuro
- `js/menu.js`: menu mobile
- `js/carrinho.js`: carrinho e busca
- `js/pedidos.js`: checkout
- `js/entregador.js`: ações do entregador
- `js/app.js`: inicialização comum

## Revisão realizada
- Corrigidos caminhos relativos entre `index.html` e `pages/`.
- Removido JavaScript duplicado.
- Separadas as responsabilidades dos scripts.
- Mantido um único CSS reutilizável.
- Corrigido contador e cálculo inicial do carrinho.
- Adicionada validação para impedir checkout sem produtos.
- Modo claro/escuro salvo no `localStorage`.
- Menu mobile fechado ao selecionar uma seção.
- Layout responsivo para desktop, tablet e celular.
