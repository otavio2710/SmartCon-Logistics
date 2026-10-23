# SmartCon Logistics

**Conversão e conciliação de etiquetas de envio e notas fiscais para operações de e-commerce.**

O SmartCon Logistics é um projeto de software voltado a organizar a preparação de pedidos. Ele reúne ferramentas para converter arquivos de etiquetas, comparar informações de envio com documentos fiscais e acompanhar resultados de conciliação em um único fluxo.

> **Contexto do projeto:** solução idealizada e ajustada a partir de necessidades reais de uma operação de e-commerce. O desenvolvimento foi realizado com apoio de ferramentas de inteligência artificial e uma abordagem low-code, incluindo definição de requisitos, elaboração de prompts, testes e ajustes de comportamento. Não é apresentado como código integralmente escrito de forma independente.

## O problema que busca resolver

Na expedição de pedidos de marketplaces, etiquetas de transporte e notas fiscais podem chegar em arquivos e formatos diferentes. Conferir manualmente destinatários, pedidos e documentos pode consumir tempo e gerar retrabalho.

O SmartCon Logistics procura centralizar essas tarefas e facilitar a identificação de correspondências e divergências, mantendo casos incertos disponíveis para conferência humana.

## Como o sistema é utilizado

1. **Conversão:** o operador seleciona os arquivos de etiquetas para conversão, incluindo formatos tratados pela interface como PDF, ZIP, PNG e ZPL.
2. **Conciliação:** o operador informa etiquetas e documentos fiscais e escolhe a plataforma de origem do pedido.
3. **Comparação:** o sistema aplica regras de correspondência entre dados disponíveis nos arquivos, como destinatário, endereço e identificadores de pedido, considerando diferenças de formato e leitura.
4. **Conferência:** o resultado indica correspondências e situações pendentes de verificação; documentos ambíguos não devem ser considerados confirmados sem revisão.
5. **Histórico:** o operador pode acompanhar os lotes e os resultados registrados pelo sistema.

**Exemplo de uso:** uma operação recebe diversas etiquetas de envio e respectivas DANFEs. Em vez de conferir cada par manualmente desde o início, o operador utiliza a conciliação para identificar pares prováveis e concentrar a revisão nos casos com divergências.

## Principais recursos implementados no projeto

- Interface com áreas de **Conversão, Conciliação e Histórico**.
- Tratamento de arquivos de etiquetas e documentos fiscais, com rotinas de leitura/OCR conforme a necessidade.
- Seleção de plataformas, incluindo Amazon, Shopee, TikTok Shop/iMile, Mercado Livre, Magalu e Outros.
- Regras de correspondência adaptadas por plataforma e verificação de vínculos entre etiqueta e nota.
- Tratamento de pedidos com múltiplos produtos e registro de lotes para acompanhamento.
- Integração entre frontend, API e banco de dados.

> As funcionalidades descritas refletem a implementação e a documentação do repositório. A execução de todos os cenários não foi validada nesta revisão; resultados dependem da qualidade dos arquivos e das configurações utilizadas.

## Tecnologias e arquitetura

| Camada | Tecnologias |
| --- | --- |
| Interface | HTML, CSS e JavaScript |
| API | Node.js e Express |
| Banco de dados | PostgreSQL |
| Ambiente local | Docker e Docker Compose, com Nginx servindo o frontend |

A arquitetura separa a interface do usuário, as rotas e regras de processamento do backend e o armazenamento de informações de lotes.

## Minha participação

- Identificação de dificuldades operacionais e definição da proposta do sistema.
- Especificação de fluxos e funcionalidades desejadas.
- Construção iterativa com apoio de IA, utilizando prompts e ferramentas low-code.
- Testes manuais, identificação de falhas e solicitação/aplicação de ajustes no comportamento da aplicação.
- Organização da apresentação e documentação do projeto.

O projeto demonstra principalmente **análise de problemas, organização de processos, testes, melhoria iterativa e aplicação prática de ferramentas digitais**. Meu estudo de programação segue em desenvolvimento.

## Executar localmente

**Pré-requisito:** Docker com suporte a Docker Compose.

1. Copie `.env.example` para `.env`.
2. Defina uma senha própria e forte em `DB_PASSWORD` e revise as demais variáveis.
3. Na pasta do projeto, execute:

   ```bash
   docker compose up -d --build
   ```

4. Acesse `http://localhost:8080`.
5. Na configuração de servidor do frontend, informe `http://localhost:3001`.

Para acessar de outro computador na rede local, substitua `localhost` pelo endereço do computador que está executando os serviços, conforme as configurações de rede e firewall.

## Estrutura do repositório

```text
SmartCon-Logistics/
├── backend/             # API, regras de processamento e acesso ao banco
├── frontend/            # Interface web
├── docker-compose.yml   # Serviços para execução local
├── .env.example         # Exemplo de variáveis de ambiente
├── .gitignore           # Exclusões para versionamento
└── README.md            # Apresentação e instruções
```

## Limitações e cuidados

- Este repositório **não deve ser disponibilizado diretamente como serviço público** sem reforços de segurança, como autenticação, HTTPS, controles de acesso, validação de uploads e políticas de tratamento de dados.
- Não envie documentos fiscais reais, etiquetas de clientes, arquivos `.env`, senhas ou tokens para o GitHub.
- Correspondências automáticas exigem conferência nos casos de divergência ou baixa confiança.
- A divulgação do código e de regras desenvolvidas em contexto profissional depende da verificação das permissões e dos direitos aplicáveis.

## Evolução do projeto

As próximas melhorias desejáveis incluem testes automatizados com documentos fictícios, maior cobertura de erros, documentação de instalação mais detalhada e preparação de um ambiente seguro para demonstração.

---

**Projeto de portfólio — SmartCon Logistics**  
[Perfil no GitHub](https://github.com/otavio2710)
