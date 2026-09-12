const MENU_CATEGORIES = [
  {
    id: "hamburgueres-tradicionais",
    title: "Hambúrgueres tradicionais",
    description: "Clássicos preparados com ingredientes selecionados.",
    items: [
      {
        id: "tradicional-01",
        name: "X-Burger",
        description: "Pão, hambúrguer bovino, queijo e molho especial.",
        price: 18.90,
        icon: "lunch_dining"
      },
      {
        id: "tradicional-02",
        name: "X-Salada",
        description: "Pão, hambúrguer, queijo, alface, tomate e molho especial.",
        price: 21.90,
        icon: "lunch_dining"
      },
      {
        id: "tradicional-03",
        name: "X-Bacon",
        description: "Pão, hambúrguer, queijo, bacon crocante e molho especial.",
        price: 25.90,
        icon: "lunch_dining"
      },
      {
        id: "tradicional-04",
        name: "X-Egg",
        description: "Pão, hambúrguer, queijo, ovo, alface e tomate.",
        price: 24.90,
        icon: "egg_alt"
      }
    ]
  },
  {
    id: "hamburgueres-artesanais",
    title: "Hambúrgueres artesanais",
    description: "Receitas especiais para quem gosta de sabor marcante.",
    items: [
      {
        id: "artesanal-01",
        name: "Aki Bacon",
        description: "Pão brioche, blend artesanal, cheddar cremoso, bacon e molho da casa.",
        price: 32.90,
        icon: "lunch_dining"
      },
      {
        id: "artesanal-02",
        name: "Aki Especial",
        description: "Pão brioche, blend artesanal, queijo, cebola caramelizada e molho especial.",
        price: 34.90,
        icon: "lunch_dining"
      },
      {
        id: "artesanal-03",
        name: "Duplo Aki",
        description: "Pão brioche, dois blends artesanais, queijo duplo e molho da casa.",
        price: 42.90,
        icon: "lunch_dining"
      },
      {
        id: "artesanal-04",
        name: "Frango Crispy",
        description: "Pão brioche, frango crocante, queijo, alface e maionese temperada.",
        price: 29.90,
        icon: "lunch_dining"
      }
    ]
  },
  {
    id: "cachorros-quentes",
    title: "Cachorros-quentes",
    description: "Hot dogs caprichados e cheios de complementos.",
    items: [
      {
        id: "hotdog-01",
        name: "Hot Dog Tradicional",
        description: "Pão, salsicha, molho de tomate, milho, batata palha e ketchup.",
        price: 16.90,
        icon: "fastfood"
      },
      {
        id: "hotdog-02",
        name: "Hot Dog Especial",
        description: "Pão, duas salsichas, purê, milho, ervilha, queijo e batata palha.",
        price: 22.90,
        icon: "fastfood"
      },
      {
        id: "hotdog-03",
        name: "Hot Dog Bacon",
        description: "Pão, salsicha, queijo, bacon, molho especial e batata palha.",
        price: 24.90,
        icon: "fastfood"
      }
    ]
  },
  {
    id: "combos",
    title: "Combos",
    description: "Lanches acompanhados para deixar seu pedido completo.",
    items: [
      {
        id: "combo-01",
        name: "Combo X-Burger",
        description: "X-Burger, batata frita pequena e refrigerante lata.",
        price: 31.90,
        icon: "local_offer"
      },
      {
        id: "combo-02",
        name: "Combo X-Bacon",
        description: "X-Bacon, batata frita média e refrigerante lata.",
        price: 39.90,
        icon: "local_offer"
      },
      {
        id: "combo-03",
        name: "Combo Aki Bacon",
        description: "Aki Bacon, batata rústica e refrigerante lata.",
        price: 46.90,
        icon: "local_offer"
      },
      {
        id: "combo-04",
        name: "Combo Família",
        description: "2 X-Saladas, 2 hot dogs tradicionais, batata grande e 1 refrigerante 2L.",
        price: 79.90,
        icon: "groups"
      }
    ]
  },
  {
    id: "porcoes",
    title: "Porções",
    description: "Acompanhamentos ideais para dividir ou comer sozinho.",
    items: [
      {
        id: "porcao-01",
        name: "Batata frita pequena",
        description: "Porção individual de batatas crocantes.",
        price: 14.90,
        icon: "fastfood"
      },
      {
        id: "porcao-02",
        name: "Batata frita média",
        description: "Porção média de batatas crocantes.",
        price: 21.90,
        icon: "fastfood"
      },
      {
        id: "porcao-03",
        name: "Batata com cheddar e bacon",
        description: "Batata frita coberta com cheddar cremoso e bacon.",
        price: 29.90,
        icon: "fastfood"
      },
      {
        id: "porcao-04",
        name: "Nuggets",
        description: "Porção com 10 unidades de nuggets crocantes.",
        price: 19.90,
        icon: "restaurant"
      }
    ]
  },
  {
    id: "bebidas",
    title: "Bebidas",
    description: "Opções geladas para acompanhar seu lanche.",
    items: [
      {
        id: "bebida-01",
        name: "Refrigerante lata",
        description: "Coca-Cola, Guaraná, Fanta ou Sprite — 350 ml.",
        price: 6.50,
        icon: "local_drink"
      },
      {
        id: "bebida-02",
        name: "Refrigerante 600 ml",
        description: "Refrigerante de sua preferência — 600 ml.",
        price: 8.90,
        icon: "local_drink"
      },
      {
        id: "bebida-03",
        name: "Refrigerante 2 litros",
        description: "Refrigerante de sua preferência — 2 litros.",
        price: 14.90,
        icon: "local_drink"
      },
      {
        id: "bebida-04",
        name: "Água mineral",
        description: "Água mineral sem gás — 500 ml.",
        price: 4.00,
        icon: "water_drop"
      },
      {
        id: "bebida-05",
        name: "Suco natural",
        description: "Suco natural de laranja, maracujá ou acerola.",
        price: 9.90,
        icon: "local_cafe"
      }
    ]
  },
  {
    id: "sobremesas",
    title: "Sobremesas",
    description: "Um doce para finalizar seu pedido.",
    items: [
      {
        id: "sobremesa-01",
        name: "Brownie com chocolate",
        description: "Brownie macio com cobertura de chocolate.",
        price: 12.90,
        icon: "cake"
      },
      {
        id: "sobremesa-02",
        name: "Milk-shake de chocolate",
        description: "Milk-shake cremoso de chocolate — 400 ml.",
        price: 18.90,
        icon: "icecream"
      },
      {
        id: "sobremesa-03",
        name: "Milk-shake de morango",
        description: "Milk-shake cremoso de morango — 400 ml.",
        price: 18.90,
        icon: "icecream"
      },
      {
        id: "sobremesa-04",
        name: "Pudim",
        description: "Fatia de pudim de leite condensado.",
        price: 10.90,
        icon: "cake"
      }
    ]
  }
];
