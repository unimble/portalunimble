# Repositório para Portal Unimble 🐿️

O seguinte repositório contempla os códigos produzidos para o produto Unimble. Assim como a maioria dos projetos convencionais, os códigos foram separados entre frontend e backend.
Para backend está sendo utilizado o supabase com sua arquitetura baas (backend as a service) onde o mesmo disponibiliza o banco(Postgresql) e pode ser implementado o que se é conhecido por “Edges functions” são pequenos trechos de código executados no lado do servidor, onde a própria plataforma disponibiliza um endpoint para consumir o mesmo.

## 📁 Backend

### 🖥️ Funcionamento
Grande vantagem do supabase se trata do mesmo ser open source, e por consequência a disponibilidade do código para ser utilizado para ser hospedado em infraestrutura própria se necessário. Todo backend criado pelo supabase é entregue através de containers, para rodar o supabase de forma local siga os passos a seguir:

* Instale o Docker [clique aqui](https://www.docker.com/)
* Instale o CLI do supabase [clique aqui](https://supabase.com/docs/guides/cli/getting-started?queryGroups=platform&platform=windows)
* Informe comando:
```
supabase init
```
e
```
supabase start
```

Isso é necessário para criar toda infraestrutura dos containers. Após isso basta apenas dar o comando:

```
supabase functions new nome-da-edge-function
```

Importante para subir para produção utilize os comandos link e login para sincronizar com o projeto Unimble. Qualquer dúvida em relação aos comandos digite:

```
supabase -h
```

### 🔑Chaves

Sendo supabase um backend como serviço o mesmo abstrair várias das tarefas normalmente implementadas. Uma delas se trata da autenticação/login, a unica coisa que o programador deve informar é o token no qual o cliente do supabase retorna ao realizar login. No supabase existem dois tipos de Tokens/chaves para realizar requisições com a plataforma, ambos são utilizados ao criar o cliente de comunicação com supabase:

* **Anon:** Se trata de um Token/chave que respeita as regras do sistema, o supabase utiliza o RLS do postgresql, então se uma tabela está com RLS ativado a anon key vai respeitar as regras, se usuário não tiver permissão o mesmo vai ser impedido de continuar.
* **Service:** Se trata de um Token/chave que burla completamente todos os RLS de qualquer tabela, muito cuidado ao se utilizar essa chave, ela se comporta como um superusuário **(Nunca utilizar em produção)**. 


