// ===========================

// DADOS.JS

// ===========================



const jogo = {

    dinheiro: 50000,

    dia: 1,

    mes: 1,

    ano: 2026,

    diaSemana: 4,

    reputacao: 0,

    lucro: 0,

    emprestimo: 0,

    carros: [],

    ofertaAtual: null,

    // Empresa
    empresa:{

        nome:"G2 Garagem",

        nivel:1,

        vagas:2,

        funcionarios:0

    },

    // Financeiro
    financeiro:{

        gastosHoje:0,

        gastosMes:0,

        gastosTotal:0,

        gastosConsertos:0,

        gastosContas:0,

        receitaTotal:0,

        melhorVenda:0,

        maiorPrejuizo:0

    },

    estatisticas:{

        comprados:0,

        vendidos:0,

        consertados:0,

        lucroTotal:0

    }

};



// ===========================

// LISTA DE CARROS

// ===========================



const carros = [

{marca:"Honda",modelo:"Titan Esd (teste) ",versao:"150",fipe:8500},

{marca:"Volkswagen",modelo:"Gol",versao:"1.0",fipe:25000},

{marca:"Volkswagen",modelo:"Gol G5",versao:"1.6",fipe:36000},

{marca:"Volkswagen",modelo:"Gol G6",versao:"1.6",fipe:47000},

{marca:"Volkswagen",modelo:"Fox",versao:"1.6",fipe:42000},

{marca:"Volkswagen",modelo:"Voyage",versao:"1.6",fipe:43000},

{marca:"Volkswagen",modelo:"Saveiro",versao:"1.6",fipe:58000},



{marca:"Chevrolet",modelo:"Celta",versao:"1.0",fipe:22000},

{marca:"Chevrolet",modelo:"Corsa",versao:"1.4",fipe:27000},

{marca:"Chevrolet",modelo:"Onix",versao:"1.0",fipe:65000},

{marca:"Chevrolet",modelo:"Cruze",versao:"1.8",fipe:82000},



{marca:"Fiat",modelo:"Uno",versao:"1.0",fipe:18000},

{marca:"Fiat",modelo:"Palio",versao:"1.4",fipe:26000},

{marca:"Fiat",modelo:"Argo",versao:"1.3",fipe:76000},



{marca:"Ford",modelo:"Ka",versao:"1.0",fipe:36000},

{marca:"Ford",modelo:"Focus",versao:"2.0",fipe:55000},

{marca:"Ford",modelo:"Fiesta",versao:"1.6",fipe:39000},



{marca:"Honda",modelo:"Fit",versao:"1.5",fipe:58000},

{marca:"Honda",modelo:"City",versao:"1.5",fipe:69000},

{marca:"Honda",modelo:"Civic",versao:"2.0",fipe:98000},



{marca:"Toyota",modelo:"Etios",versao:"1.5",fipe:54000},

{marca:"Toyota",modelo:"Corolla",versao:"2.0",fipe:145000},

{marca:"Toyota",modelo:"Hilux",versao:"2.8",fipe:220000},

{marca:"Volkswagen",modelo:"Amarok",versao:"3.0 V6 Diesel Extreme",fipe:245000},
{marca:"Toyota",modelo:"Hilux",versao:"2.8 D-4D SRX",fipe:275000},
{marca:"Chevrolet",modelo:"S10",versao:"2.8 CTDI High Country",fipe:210000},
{marca:"Ford",modelo:"Ranger",versao:"3.0 V6 Diesel Limited",fipe:285000},
{marca:"Jeep",modelo:"Commander",versao:"2.0 TD380 Overland",fipe:240000},
{marca:"BMW",modelo:"Série 3",versao:"2.0 320i M Sport",fipe:290000},
{marca:"Mercedes-Benz",modelo:"Classe C",versao:"2.0 C200 AMG Line",fipe:310000},
{marca:"Audi",modelo:"A4",versao:"2.0 TFSI Performance Black",fipe:265000},
{marca:"Volvo",modelo:"XC60",versao:"2.0 T8 Ultimate Hybrid",fipe:360000},
{marca:"Honda",modelo:"Civic",versao:"2.0 Type R",fipe:420000},
{marca:"Toyota",modelo:"SW4",versao:"2.8 D-4D Diamond",fipe:390000},
{marca:"Ram",modelo:"Rampage",versao:"2.0 Turbo Hurricane 4 RT",fipe:250000},
{marca:"Toyota",modelo:"Corolla Cross",versao:"2.0 XRX Flex",fipe:165000},
{marca:"Volkswagen",modelo:"Taos",versao:"1.4 250 TSI Highline",fipe:160000},
{marca:"Jeep",modelo:"Renegade",versao:"1.3 T270 Trailhawk",fipe:145000},
{marca:"Hyundai",modelo:"Creta",versao:"2.0 Ultimate",fipe:140000},
{marca:"Nissan",modelo:"Sentra",versao:"2.0 Exclusive",fipe:150000},
{marca:"Caoa Chery",modelo:"Tiggo 8",versao:"1.6 TGDI Max Drive",fipe:170000},
{marca:"Mitsubishi",modelo:"L200 Triton",versao:"2.4 Diesel HPE-S",fipe:230000},
{marca:"Fiat",modelo:"Fastback",versao:"1.3 T270 Limited Edition Abarth",fipe:135000},
{marca:"Chevrolet",modelo:"Tracker",versao:"1.2 Turbo Premier",fipe:125000},
{marca:"Volkswagen",modelo:"T-Cross",versao:"1.4 250 TSI Highline",fipe:130000},
{marca:"Honda",modelo:"HR-V",versao:"1.5 Turbo Touring",fipe:175000},
{marca:"BYD",modelo:"Song Plus",versao:"1.5 DM-i Hybrid",fipe:220000},
{marca:"GWM",modelo:"Haval H6",versao:"1.5 HEV Premium",fipe:210000},
{marca:"Ford",modelo:"Bronco Sport",versao:"2.0 EcoBoost Wildtrak",fipe:215000},
{marca:"Volkswagen",modelo:"Nivus",versao:"1.0 200 TSI Highline",fipe:118000},
{marca:"Fiat",modelo:"Pulse",versao:"1.3 Turbo Abarth",fipe:122000},
{marca:"Renault",modelo:"Duster",versao:"1.3 Turbo Iconic",fipe:110000},
{marca:"Chevrolet",modelo:"Spin",versao:"1.8 Flex Premier",fipe:95000},
{marca:"Peugeot",modelo:"208",versao:"1.0 Turbo Style",fipe:92000},
{marca:"Citroën",modelo:"C3 Aircross",versao:"1.0 Turbo Shine",fipe:115000},
{marca:"Kia",modelo:"Sportage",versao:"1.6 Turbo Hybrid EX",fipe:225000},
{marca:"Fiat",modelo:"Fiorino",versao:"1.4 EVO Flex",fipe:68000},
{marca:"Volkswagen",modelo:"Saveiro",versao:"1.6 MSI Cross Pepper",fipe:78000},
{marca:"Chevrolet",modelo:"Montana",versao:"1.2 Turbo Premier",fipe:120000},
{marca:"Fiat",modelo:"Strada",versao:"1.3 Firefly Ranch CVT",fipe:112000},
{marca:"Renault",modelo:"Oroch",versao:"1.3 Turbo Outsider",fipe:105000},
{marca:"Fiat",modelo:"Tempra",versao:"2.0 16V Ouro",fipe:14500},
{marca:"Fiat",modelo:"Tempra",versao:"2.0 Turbo Stile",fipe:22000},
{marca:"Volkswagen",modelo:"Fusca",versao:"1300 Standard",fipe:12000},
{marca:"Volkswagen",modelo:"Fusca",versao:"1600 Itamar",fipe:45000},
{marca:"Volkswagen",modelo:"Fusca",versao:"1600 conversível original",fipe:85000},
{marca:"Chevrolet",modelo:"Opala",versao:"4.1 Comodoro Diplomata",fipe:55000},
{marca:"Ford",modelo:"Escort",versao:"1.8 XR3 Conversível",fipe:38000},
{marca:"Volkswagen",modelo:"Gol",versao:"2.0 GTI 16V Bola",fipe:75000}



];



const cores = [



"Branco",

"Preto",

"Prata",

"Cinza",

"Vermelho",

"Azul",

"Verde",

"Amarelo"



];



const historicos = [



"Único dono",
"Uber",
"Locadora",
"Leilão",
"Pequena colisão",
"Revisões em dia",
"Sem histórico",
"Segundo dono",
"Terceiro dono",
"Quarto dono ou mais",
"De colecionador",
"Placa preta",
"Restaurado",
"Recuperado de financiamento",
"Média monta",
"Grande monta",
"Sinistrado com laudo",
"Laudo cautelar aprovado",
"Laudo cautelar reprovado",
"Laudo cautelar aprovado com apontamento",
"Chassi remarcado",
"Pintura original",
"Retocado",
"Carro de repasse",
"Garantia de fábrica",
"Baixa quilometragem",
"Nota fiscal de fábrica",
"Manual e chave reserva",
"Toda a documentação paga",
"IPVA 2026 quitado",
"Com multas pendentes",
"Alienado",
"Bloqueio judicial",
"Dupla transferência pendente",
"Placa Mercosul",
"Placa antiga",
"Sem retoques na lataria",
"Motor feito recentemente",
"Histórico de modificação suspensão",
"Legalizado no documento",
"Sem sinistro no documento",
"Ex-táxi",
"Carro de frota de empresa",
"Uso em estrada",
"Uso predominantemente urbano",
"Carro de mulher",
"Carro de idoso",
"Guardado apenas em garagem coberta",
"Adquirido em concessionária local",
"Leilão de banco",
"Leilão de seguradora",
"Leilão de frota",
"Leilão de renovação de frota",
"Recuperado de roubo/furto",
"Furtado e achado sem danos",
"Histórico de enchente",
"Passagem por seguradora",
"Sinistro recuperado",
"Transformado",
"Kit GNV instalado e homologado",
"Kit GNV retirado",
"GNV com vistoria vencida",
"Motor trocado e cadastrado",
"Motor trocado sem cadastro",
"Painel substituído (KM desalinhada)",
"KM adulterada constatada",
"Estrutura íntegra",
"Longarina reparada",
"Painel traseiro trocado",
"Folha de teto substituída",
"Coluna central reparada",
"Caixa de ar refeita",
"Amortecedores originais",
"Pneus novos",
"Pneus carecas",
"Pneus remold",
"Rodas modificadas",
"Suspensão a ar",
"Suspensão de rosca",
"Suspensão fixa rebaixada",
"Remapeado (Stage 1)",
"Remapeado (Stage 2)",
"Filtro e escape modificados",
"Voltou para o mapa original",
"Som automotivo forte instalado anteriormente",
"Fiação de som pesada passada",
"Totalmente original de fábrica",
"Ficou parado muito tempo",
"Pertenceu a mecânico",
"Carro de fã do modelo",
"Comprado em leilão de sucata",
"Pintura queimada de sol",
"Histórico de granizo",
"Tratamento antiferrugem feito",
"Podres na lataria corrigidos",
"Esmagamento de assoalho",
"Sem garantia mecânica (venda no estado)",
"Revisado em concessionária até os 100k",
"Revisado em oficina especializada",
"Dono anterior perfeccionista",
"Uso severo em terra/fazenda",
"Puxava reboque frequentemente",
"Câmbio automático revisado recente",
"Luz de injeção acesa no histórico",
"Airbag já disparado e trocado",
"Airbag isolado",
"Vidros originais com logo da marca",
"Para-brisa trocado por paralelo",
"Bancos em couro hidratados",
"Interna reformada",
"Sem detalhes para fazer",
"Restauração antiga",
"Sobras de solda de fábrica intactas",
"Histórico de envelopamento total",
"Placa clonada anteriormente",
"Burocracia de inventário resolvida",
"Liberado para transferência imediata"



];



const defeitos = [



{nome:"Motor",valor:8500},

{nome:"Câmbio",valor:6500},

{nome:"Suspensão",valor:2800},

{nome:"Pintura",valor:2200},

{nome:"Pneus",valor:1800},

{nome:"Ar-condicionado",valor:1500},

{nome:"Freios",valor:900},

{nome:"Bateria",valor:650},

{nome:"Embreagem",valor:2400},

{nome:"Embreagem",valor:2400},
{nome:"Correia Dentada Rompida",valor:3500},
{nome:"Junta do Cabeçote Queimada",valor:2800},
{nome:"Bomba de Combustível Queimada",valor:650},
{nome:"Velas e Cabos de Ignição",valor:350},
{nome:"Pastilhas de Freio Gastas",valor:220},
{nome:"Discos de Freio Empenados",valor:480},
{nome:"Amortecedores Dianteiros Estourados",valor:1400},
{nome:"Bucha da Bandeja Danificada",valor:180},
{nome:"Ponteira de Homocinética Com Folga",valor:380},
{nome:"Vazamento no Radiador",value:550},
{nome:"Alternador Não Carrega",valor:900},
{nome:"Motor de Arranque Pesado",valor:450},
{nome:"Bateria Arriada",valor:490},
{nome:"Vazamento de Óleo do Motor",valor:600},
{nome:"Retentor do Câmbio Estourado",valor:320},
{nome:"Rolamento de Roda Roncando",valor:2800},
{nome:"Caixa de Direção Hidráulica Com Vazamento",valor:1600},
{nome:"Barra Estabilizadora Com Folga",valor:250},
{nome:"Sensor MAP Danificado",valor:290},
{nome:"Sonda Lambda Travada",valor:420},
{nome:"Bicos Injetores Entupidos",valor:380},
{nome:"Bobina de Ignição Falhando",valor:400},
{nome:"Compressor do Ar Condicionado Travado",valor:2100},
{nome:"Eletroventilador do Radiador Queimado",valor:680},
{nome:"Folga no Virabrequim",valor:5500},
{nome:"Catalisador Entupido",valor:1800},
{nome:"Cabo de Embreagem Partido",valor:150},
{nome:"Cubo de Roda Empenado",valor:340}



];



function aleatorio(min,max){



    return Math.floor(Math.random()*(max-min+1))+min;



}