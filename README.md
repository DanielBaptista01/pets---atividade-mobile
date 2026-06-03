# 🐾 Adotei — Pet Adopt App

O **Adotei** é um aplicativo mobile desenvolvido em React Native projetado para conectar animais em busca de um lar a potenciais adotantes. O projeto simula a rotina de desenvolvimento de uma equipe de software real, integrando conceitos avançados de interface, gerenciamento de estado global, consumo de APIs e persistência de dados.

---

## 👥 Organização da Equipe e Metodologia

Para o desenvolvimento deste projeto, a equipe adotou a prática de **Pair Programming (Desenvolvimento em Par)** durante os encontros presenciais em sala de aula. Toda a estrutura arquitetural, tomadas de decisão de design, lógica de negócios e integrações com o servidor foram discutidas e implementadas de forma colaborativa a quatro mãos. 

* **Desenvolvimento e Integração:** Isaias Maia de Oliveira & Daniel Santos Baptista .
* **Gestão de Repositório:** Devido ao formato de desenvolvimento pareado em um único ambiente físico, os envios e o histórico de entrega foram centralizados no perfil principal, refletindo o esforço conjunto do grupo nas sessões de codificação.

---

## 🛠️ Tecnologias e Arquitetura Utilizadas

O projeto foi estruturado seguindo as melhores práticas de mercado para garantir modularidade e reutilização de código:

1. **Interface e Design System:** Construção de layouts fluidos e totalmente responsivos (adaptados para Mobile e visualização em Desktop), utilizando uma paleta de cores acolhedora baseada em tons terrosos.
2. **Gerenciamento de Estado Global (Context API):**
   * `UserContext`: Responsável por gerenciar o fluxo de autenticação, cadastro e controle de tokens de sessão.
   * `PetContext`: Responsável pela reatividade da vitrine, estados de carregamento (loading), tratamento de erros de API e armazenamento dinâmico de estados.
3. **Camada de Serviços (Services):** Criação de rotinas isoladas na pasta `services/` (como `petService.js`) para consumo de rotas HTTP (Listagem, Cadastro, Edição e Remoção de registros) conectadas à API oficial do ecossistema.
4. **Navegação Inteligente:** Controle condicional de acesso, onde usuários não autenticados são impedidos de visualizar o mural principal e redirecionados para o fluxo protetivo de Login/Cadastro.

---

## 🌿 Estrutura de Branches

Para simular o ambiente de entrega real, o escopo técnico do projeto foi idealizado e dividido nos seguintes módulos de funcionalidades:
* `feature/auth` — Telas de Login, Cadastro e segurança de rotas.
* `feature/services` — Configuração da camada de dados e isolamento das requisições HTTP.
* `feature/home` — Renderização do mural de pets, componentes de cartões dinâmicos e filtros de categoria.
* `feature/details-favorites` — Telas de detalhes avançados, fluxo de contato direto via WhatsApp (Linking) e lógica interna de favoritar/gerenciar pets.

---

## 🚀 Como Executar o Projeto Localmente

Certifique-se de ter o ambiente Node.js e o Expo CLI configurados.

1. Clone o repositório para sua máquina local.
2. Instale as dependências necessárias do projeto:
   ```bash
   npm install
