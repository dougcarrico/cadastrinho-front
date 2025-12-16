# Cadastrinho-front
Este é o front-end do projeto de MVP para a Sprint de "Desenvolvimento Full Stack Básico" da pós graduação em Engenharia de Software da PUC-Rio.

O projeto tem como objetivo ser uma aplicação de cadastro de produtos da "Una - Loja Holística".
Como parte da criação do MVP, foi feita uma entrevista com a dona da loja, minha esposa, para definir os requisitos iniciais da primeira versão da aplicação, alinhando necessidades da loja com os requisitos do MVP da sprint.

## Atenção
- Para o front-end da aplicação funcionar corretamente, o back-end precisa estar executando. Para isso, acesse ["cadastrinho-back"](https://github.com/dougcarrico/cadastrinho-back/) e faça todo o processo de execução do back-end antes de iniciar o processo de execução do front-end.

## Como executar com Docker

Clonar ou baixar o repositório em sua máquina.

Ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegar até o diretório raiz do projeto, aquele que contém o Dockerfile, no terminal. Executar como administrador o comando abaixo para construir a imagem Docker

```
docker build -t front-image:nginx-alpine .
```

Assim que a imagem estiver criada, utilizar o comando abaixo para executar o container.

```
docker run --name front-container -d -p 80:80 front-image:nginx-alpine
```

Acessar a url abaixo no navegador para visualizar a API em execução

```
http://localhost:80
```

## Como executar sem docker
- Clonar ou baixar o repositório em sua máquina.
- Acessar o diretório raiz e clicar duas vezes no arquivo index.html.

## Próximos passos
- Implementar interface para permitir busca de um produto específico utilizando a rota Get /Produto da API ["cadastrinho-back"](https://github.com/dougcarrico/cadastrinho-back/).
- Ajustar formato de exibição da data para "dd/mm/yy hh:mm:ss".
- Implementar filtros.
- Implementar ordenação por colunas diferentes.
- Corrigir bug ao tentar excluir um produto com caractere "#" no início do nome.
- Adicionar modal de confirmação antes de excluir um produto.


## API externa
É utilizada a API CEP V2 do Brasil Api para a consulta de informações sobre os CEPs de origem e destino na funcionalidade de cálculo de frete.
Para mais informações sobre a API, consultar o link abaixo:
- https://brasilapi.com.br/docs#tag/CEP-V2
